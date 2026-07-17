const collector = require("./Collector");

class messageCollector extends collector {
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
                if (tools.helper.areJidsSameUser(jid, chatJid)) return ctx;
            }
        }
        return false;
    }
}

module.exports = messageCollector;