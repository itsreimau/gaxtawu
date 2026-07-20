const Baileys = require("baileys");
const EventEmitter = require("node:events");
const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");
const { NodeCache } = require("@cacheable/node-cache");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const SimplDB = require("simpl.db");
const vCard = require("vcard-parser");
const WASF = require("wa-sticker-formatter");
const Commands = require("../handler/commands");
const Ctx = require("./ctx");
const Utils = require("../utils");

class Client {
    constructor(opts = {}) {
        this._initAuth(opts.auth || {});
        this._initConnection(opts.connection || {});
        this._initMessaging(opts.messaging || {});
        this._initDatabase(opts.database || {});

        this.owner = opts.owner || [];
        this.ev = new EventEmitter();
        this.cmd = new Map();
        this.cooldown = new Map();
        this.hearsMap = new Map();
        this.middlewares = new Map();
        this.logger = pino({
            level: this.loggerLevel
        });
        this.store = null;
        this.storePath = path.resolve(this.authDir, "store.json");
        this.groupCache = new NodeCache({
            stdTTL: 24 * 60 * 60,
            useClones: false
        });
        this.messageIdCache = new NodeCache({
            stdTTL: 24 * 60 * 60,
            useClones: false
        });
        this.db = new SimplDB({
            collectionsFolder: this.databaseDir,
            tabSize: 2
        });

        this._normalizePrefix();
        this._ensureDatabaseCollections();
    }

    _initAuth(authOpts) {
        this.authDir = authOpts.dir || "./auth";
        this.phoneNumber = authOpts.phoneNumber || null;
        this.usePairingCode = authOpts.usePairingCode || false;
        this.customPairingCode = authOpts.customPairingCode || null;
        this.useStore = authOpts.useStore || false;
    }

    _initConnection(connOpts) {
        this.browser = connOpts.browser || Baileys.Browsers.macOS("Safari");
        this.WAVersion = connOpts.version || null;
        this.alwaysOnline = connOpts.alwaysOnline || false;
        this.selfReply = connOpts.selfReply || false;
        this.loggerLevel = connOpts.loggerLevel || "silent";
    }

    _initMessaging(msgOpts) {
        this.autoRead = msgOpts.autoRead || false;
        this.prefix = msgOpts.prefix || /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i;
    }

    _initDatabase(dbOpts) {
        this.databaseDir = dbOpts.dir || "./database";
        this.databaseDefaults = dbOpts.defaults || {};
    }

    _normalizePrefix() {
        if (Array.isArray(this.prefix)) {
            if (this.prefix.includes("")) this.prefix.sort((a, b) => a === "" ? 1 : b === "" ? -1 : 0);
        } else if (typeof this.prefix === "string") {
            this.prefix = this.prefix.split("");
        }
    }

    _ensureDatabaseCollections() {
        const collections = ["bot", "users", "groups"];
        for (const name of collections) {
            if (!this.db.getCollection(name)) this.db.createCollection(name, this.databaseDefaults?.[name] || {});
        }
    }

    _shouldIgnore(messageId) {
        if (this.messageIdCache.get(messageId)) return true;
        this.messageIdCache.set(messageId, true);
        return false;
    }

    _updatePushName(jid, pushName) {
        const userDb = Utils.helper.getDb(this.db.getCollection("users"), jid);
        if (userDb?.pushName !== pushName) {
            userDb.pushName = pushName;
            userDb.save();
        }
    }

    async _cacheGroupMetadata(id) {
        try {
            const metadata = await this.core.groupMetadata(id);
            this.groupCache.set(id, metadata);
            return metadata;
        } catch {
            return null;
        }
    }

    async _cacheAllGroups() {
        const groups = await this.core.groupFetchAllParticipating();
        for (const [id, metadata] of Object.entries(groups)) {
            this.groupCache.set(id, metadata);
        }
    }

    _normalizeMessage(message, event) {
        const senderJids = [message.key.participant, message.key.participantAlt, message.key.remoteJid, message.key.remoteJidAlt].filter(Boolean).map(jid => Baileys.jidNormalizedUser(jid));

        const senderJid = message.key.fromMe ? Baileys.jidNormalizedUser(this.core.user.id) : senderJids.find(jid => Baileys.isPnUser(jid));
        const senderLid = message.key.fromMe ? Baileys.jidNormalizedUser(this.core.user.lid) : senderJids.find(jid => Baileys.isLidUser(jid));

        if (!senderJid || !senderLid || !message.pushName) return null;

        this._updatePushName(senderLid, message.pushName);

        return {
            sender: {
                jid: senderJid,
                lid: senderLid,
                pushName: message.pushName
            },
            message: {
                ...message,
                body: Utils.helper.getBodyFromMsg(message)
            }
        };
    }

    _setupEventHandlers() {
        this.core.ev.on("connection.update", this._handleConnectionUpdate.bind(this));
        this.core.ev.on("creds.update", this.saveCreds);
        this.core.ev.on("messages.upsert", this._handleMessagesUpsert.bind(this));
        this.core.ev.on("groups.update", this._handleGroupsUpdate.bind(this));
        this.core.ev.on("group-participants.update", this._handleGroupParticipantsUpdate.bind(this));
        this.core.ev.on("groups.upsert", this._handleGroupsUpsert.bind(this));
        this.core.ev.on("call", (calls) => calls.forEach(call => this.ev.emit("Call", call)));

        this._setupNotificationAck("passkey_prologue_request");
        this._setupNotificationAck("crsc_continuation");
    }

    _setupNotificationAck(type) {
        this.core.ws.on(`CB:notification,type:${type}`, async (node) => {
            await this.core.sendNode({
                tag: "ack",
                attrs: {
                    id: node.attrs.id,
                    class: "notification",
                    to: node.attrs.from,
                    type: node.attrs.type
                }
            });
        });
    }

    async _handleConnectionUpdate(update) {
        const {
            connection,
            lastDisconnect,
            qr
        } = update;

        if (qr && !this.usePairingCode)
            qrcode.generate(qr, {
                small: true
            });

        if (connection === "close") {
            const shouldReconnect = lastDisconnect.error.output?.statusCode !== Baileys.DisconnectReason.loggedOut;
            console.warn(util.styleText("yellow", "[!]"), `Connection closed: ${lastDisconnect.error}, reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) await this.launch();
        } else if (connection === "open") {
            if (!this.readyAt) this.readyAt = Date.now();
            this.ev.emit("ClientReady", this.core);
            await Baileys.delay(3000);
            await this._cacheAllGroups();
        }
    }

    async _handleMessagesUpsert(event) {
        if (event.type !== "notify") return;

        for (const message of event.messages) {
            if (message.key.fromMe && message.key.id.includes("STARFALL")) continue;
            if (this._shouldIgnore(message.key.id)) continue;

            const normalized = this._normalizeMessage(message, event);
            if (!normalized) continue;

            const ctx = new Ctx({
                used: {
                    upsert: normalized.message.body
                },
                args: [],
                self: {
                    ...this,
                    sender: normalized.sender,
                    m: normalized.message
                },
                Client: this.core
            });

            this.ev.emit("MessagesUpsert", ctx);
            if (this.autoRead) await this.core.readMessages([message.key]);
            await Commands({
                ...this,
                m: normalized.message,
                sender: normalized.sender
            }, this._runMiddlewares.bind(this));
        }
    }

    async _handleGroupsUpdate([event]) {
        await this._cacheGroupMetadata(event.id);
    }

    async _handleGroupParticipantsUpdate(event) {
        await this._cacheGroupMetadata(event.id);

        const {
            action,
            participants,
            ...rest
        } = event;
        if (!["add", "leave", "remove"].includes(action)) return;

        const eventName = action === "add" ? "UserJoin" : "UserLeave";
        for (const participant of participants) {
            this.ev.emit(eventName, {
                ...rest,
                participant: participant.id,
                participantPn: participant.phoneNumber
            });
        }
    }

    async _handleGroupsUpsert([event]) {
        await this._cacheGroupMetadata(event.id);
        this.ev.emit("GroupJoin", event);
    }

    use(fn) {
        this.middlewares.set(this.middlewares.size, fn);
    }

    async _runMiddlewares(ctx, index = 0) {
        const middlewareFn = this.middlewares.get(index);
        if (!middlewareFn) return true;

        let nextCalled = false;
        let chainCompleted = false;

        await middlewareFn(ctx, async () => {
            if (nextCalled) throw new Error("next() called multiple times in middleware");
            nextCalled = true;
            chainCompleted = await this._runMiddlewares(ctx, index + 1);
        });

        return nextCalled && chainCompleted;
    }

    command(opts, code) {
        const command = typeof opts === "string" ? {
            name: opts,
            code
        } : opts;
        this.cmd.set(this.cmd.size, command);
    }

    hears(query, callback) {
        this.hearsMap.set(this.hearsMap.size, {
            name: query,
            code: callback
        });
    }

    get api() {
        return Utils.api;
    }

    get format() {
        return Utils.format;
    }

    get helper() {
        return Utils.helper;
    }

    get list() {
        return Utils.list;
    }

    checkOwner(jid = Baileys.PSA_WID, fromMe = false) {
        return Utils.helper.checkOwner(jid, this.owner, fromMe);
    }

    getPushName(jid = Baileys.PSA_WID) {
        return Utils.helper.getPushName(jid, this.db);
    }

    getId(jid = Baileys.PSA_WID) {
        return Utils.helper.getId(jid);
    }

    getDb(collection, jid = Baileys.PSA_WID) {
        const coll = this.db.getCollection(collection);
        return Utils.helper.getDb(coll, jid);
    }

    async forceCommand(jid, command, text = "", sender) {
        const body = text ? `${command} ${text}` : command;
        const fakeMsg = {
            key: {
                remoteJid: jid,
                fromMe: Baileys.areJidsSameUser(sender.jid, this.core.user.id),
                id: Baileys.generateMessageIDV2(),
                ...(jid !== sender.jid && {
                    participant: sender.jid,
                    ...(sender.lid && {
                        participantAlt: sender.lid
                    })
                })
            },
            message: {
                conversation: body
            },
            body,
            messageTimestamp: Date.now() / 1000,
            pushName: sender.pushName
        };

        await Commands({
            ...this,
            m: fakeMsg,
            sender,
            force: true
        }, async () => true);
    }

    async launch() {
        const {
            state,
            saveCreds
        } = await Baileys.useMultiFileAuthState(this.authDir);
        this.state = state;
        this.saveCreds = saveCreds;

        this.core = Baileys.default({
            ...(this.WAVersion && {
                version: this.WAVersion
            }),
            browser: this.browser,
            logger: this.logger,
            emitOwnEvents: this.selfReply,
            auth: this.state,
            markOnlineOnConnect: this.alwaysOnline,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            ...(this.useStore && {
                getMessage: async (key) => (await this.store.loadMessage(key.remoteJid, key.id))?.message
            }),
            cachedGroupMetadata: async (jid) => this.groupCache.get(jid)
        });

        if (this.usePairingCode && !this.core.authState.creds.registered) {
            if (!this.phoneNumber) throw new Error("phoneNumber is required when using pairing code");

            this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, "");
            if (!this.phoneNumber.length) throw new Error("Invalid phoneNumber");

            await Baileys.delay(3000);
            const code = await this.core.requestPairingCode(this.phoneNumber, this.customPairingCode);
            console.log(util.styleText("cyan", "[i]"), `Pairing Code: ${code}`);
        }

        this._setupStore();
        this._ensureDatabaseDirectory();
        this._setupEventHandlers();

        this.sendMessage = this._createSendMessage.bind(this);
        return this;
    }

    _setupStore() {
        if (!this.useStore) return;

        this.store = Baileys.makeInMemoryStore({
            logger: this.logger,
            socket: this.core
        });
        this.store.bind(this.core.ev);

        if (fs.existsSync(this.storePath)) this.store.readFromFile(this.storePath);
        setInterval(() => this.store.writeToFile(this.storePath), 10000);

        this.store.cleanupMessages = (cutoff) => {
            for (const jid of Object.keys(this.store.messages)) {
                this.store.messages[jid] = this.store.messages[jid].filter(msg => msg.messageTimestamp * 1000 > cutoff);
            }
        };

        setInterval(() => this.store.cleanupMessages(Date.now() - (7 * 24 * 60 * 60 * 1000)), 24 * 60 * 60 * 1000);
    }

    _ensureDatabaseDirectory() {
        if (!fs.existsSync(this.databaseDir))
            fs.mkdirSync(this.databaseDir, {
                recursive: true
            });
    }

    async _createSendMessage(jid, content, options = {}) {
        if (typeof content === "string")
            content = {
                text: content
            };
        if (content?.album) {
            const {
                album,
                ...restCont
            } = content;
            if (album.length === 1) {
                content = {
                    ...album[0],
                    ...restCont
                };
            } else {
                const processedAlbum = [...album];
                if (processedAlbum.every(a => !a.caption) && content.caption) processedAlbum[0].caption = content.caption;
                content = {
                    album: processedAlbum
                };
            }
        }
        if (content?.sticker) {
            const sticker = Buffer.isBuffer(content.sticker) ? content.sticker : content.sticker?.url;
            if (sticker) {
                const {
                    pack = config.sticker.packname, author = config.sticker.author, type = WASF.StickerTypes.FULL, categories = ["🌕"], id = Date.now().toString(), quality = 50, background, ...restOpts
                } = options;
                content = {
                    sticker: await WASF.Sticker(sticker, {
                        pack,
                        author,
                        type,
                        categories,
                        id,
                        quality,
                        background
                    }).build()
                };
                options = restOpts;
            }
        }
        if (content?.contacts) {
            if (Array.isArray(content.contacts)) {
                const parsed = content.contacts.map(this._parseContact).filter(Boolean);
                content = {
                    contacts: {
                        displayName: "nirwabot",
                        contacts: parsed
                    }
                };
            } else if (content.contacts?.contacts) {
                const parsed = content.contacts.contacts.map(this._parseContact).filter(Boolean);
                content = {
                    contacts: {
                        displayName: content.contacts.displayName || "nirwabot",
                        contacts: parsed
                    }
                };
            } else {
                const parsed = this._parseContact(content.contacts);
                if (parsed)
                    content = {
                        contacts: parsed
                    };
            }
        }
        if (Baileys.isPnUser(jid) || Baileys.isLidUser(jid)) content.ai = true;
        if ((content.title || content.subtitle || content.footer) && !content.buttons && !content.nativeFlow) content.nativeFlow = {};
        return await this.core.sendMessage(jid, content, options);
    }

    _parseContact(contact) {
        if (contact.vcard)
            return {
                displayName: contact.displayName || contact.fullName || "nirwabot",
                vcard: contact.vcard
            };
        if (contact.number) {
            const clean = contact.number.toString().replace(/\s/g, "");
            const vcard = vCard.generate({
                version: [{
                    value: "3.0"
                }],
                fn: [{
                    value: contact.fullName || contact.displayName || "nirwabot"
                }],
                org: [{
                    value: [contact.org || ""]
                }],
                tel: [{
                    value: `+${clean}`,
                    meta: {
                        type: ["CELL", "VOICE"],
                        waid: [clean]
                    }
                }]
            });
            return {
                displayName: contact.fullName || contact.displayName || "nirwabot",
                vcard
            };
        }
        return null;
    }
}

module.exports = Client;