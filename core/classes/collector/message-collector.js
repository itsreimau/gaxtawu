const Collector = require("./collector");
const Utils = require("../utils");

class MessageCollector extends Collector {
    constructor(clientReq, opts = {}) {
        super(opts);
        this.jids = [clientReq.msg.key.remoteJid, ...(opts.hears || [])];

        this.handleCollect = (ctx) => this.collect(ctx);
        clientReq.self.ev.on("MessagesUpsert", this.handleCollect);
        this.once("end", () => clientReq.self.ev.removeListener("MessagesUpsert", this.handleCollect));
    }

    _collect(ctx) {
        const chatJids = [ctx.msg.key.remoteJid, ctx.msg.key.remoteJidAlt];
        for (const jid of this.jids) {
            for (const chatJid of chatJids) {
                if (Utils.helper.areJidsSameUser(jid, chatJid)) return ctx;
            }
        }
        return false;
    }
}

module.exports = MessageCollector;