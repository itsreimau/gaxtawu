const Baileys = require("baileys");
const Ctx = require("../classes/ctx");

async function Commands(self, runMiddlewares) {
    const {
        m,
        prefix,
        cmd,
        core
    } = self;

    if (!m.body || Baileys.isJidStatusBroadcast(m.key.remoteJid) || Baileys.isJidNewsletter(m.key.remoteJid)) return;

    const findMatchingCommands = (cmdMap, commandName) => {
        const commands = Array.from(cmdMap?.values() || []);
        return commands.filter(cmd => cmd.name?.toLowerCase() === commandName || (Array.isArray(cmd.aliases) && cmd.aliases.includes(commandName)) || cmd.aliases === commandName);
    };

    const createCtx = (self, client, used, args, text) => {
        return new Ctx({
            used,
            args,
            text,
            self,
            client
        });
    };

    const handleHears = (self, body, messageType) => {
        const allHears = Array.from(self.hearsMap?.values() || []);
        return allHears.filter(hear => hear.name === body || hear.name === messageType || new RegExp(hear.name).test(body) || (Array.isArray(hear.name) && hear.name.includes(body)));
    };

    if (self.force) {
        const args = m.body.split(/\s+/);
        const commandName = args.shift()?.toLowerCase();
        const text = args.join(" ");

        if (!commandName) return;

        const matched = findMatchingCommands(cmd, commandName);
        if (!matched.length) return;

        const ctx = createCtx(self, core, {
            prefix: "force",
            command: commandName
        }, args, text);
        if (!await runMiddlewares(ctx)) return;
        matched.forEach(cmd => cmd.code(ctx));
        return;
    }

    const hears = handleHears(self, m.body, m.messageType);
    if (hears.length) {
        const ctx = createCtx(self, core, {
            hears: m.body
        }, [], "");
        hears.forEach(hear => hear.code(ctx));
        return;
    }

    const parsed = ctx.helper.parseCommand(prefix, m.body);
    if (!parsed.commandName) return;

    const matched = findMatchingCommands(cmd, parsed.commandName);
    if (!matched.length) return;

    const ctx = createCtx(self, core, {
        prefix: parsed.selectedPrefix,
        command: parsed.commandName
    }, parsed.args, parsed.text);

    if (!await runMiddlewares(ctx)) return;
    matched.forEach(cmd => cmd.code(ctx));
};

module.exports = Commands;