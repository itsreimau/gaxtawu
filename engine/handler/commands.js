const baileys = require("baileys");
const context = require("../classes/context");

async function commands(self, runMiddlewares) {
    const {
        m,
        prefix,
        cmd,
        core
    } = self;

    if (!m.body || baileys..isJidStatusBroadcast(m.key.remoteJid) || baileys..isJidNewsletter(m.key.remoteJid)) return;

    const findMatchingCommands = (cmdMap, commandName) => {
        const commands = Array.from(cmdMap?.values() || []);
        return commands.filter(cmd => cmd.name?.toLowerCase() === commandName || (Array.isArray(cmd.aliases) && cmd.aliases.includes(commandName)) || cmd.aliases === commandName);
    };

    const createContext = (self, client, used, args, text) => {
        return new context({
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

        const ctx = createContext(self, core, {
            prefix: "force",
            command: commandName
        }, args, text);
        if (!await runMiddlewares(ctx)) return;
        matched.forEach(cmd => cmd.code(ctx));
        return;
    }

    const hears = handleHears(self, m.body, m.messageType);
    if (hears.length) {
        const ctx = createContext(self, core, {
            hears: m.body
        }, [], "");
        hears.forEach(hear => hear.code(ctx));
        return;
    }

    const parsed = tools.helper.parseCommand(prefix, m.body);
    if (!parsed.commandName) return;

    const matched = findMatchingCommands(cmd, parsed.commandName);
    if (!matched.length) return;

    const ctx = createContext(self, core, {
        prefix: parsed.selectedPrefix,
        command: parsed.commandName
    }, parsed.args, parsed.text);

    if (!await runMiddlewares(ctx)) return;
    matched.forEach(cmd => cmd.code(ctx));
};

module.exports = commands;
