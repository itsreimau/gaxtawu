const util = require("node:util");
const { globSync } = require("glob");

class CommandHandler {
    constructor(bot, path) {
        this._bot = bot;
        this._path = path;
    }

    load(isShowLog = true) {
        if (isShowLog) console.group(util.styleText("cyan", "[i]"), "Command Handler");

        const files = this._getFiles();

        for (const file of files) {
            try {
                const module = require(file);
                const commands = this._normalizeCommands(module, file);

                for (const cmd of commands) {
                    this._registerCommand(cmd);
                    if (isShowLog) {
                        const type = cmd.type === "hears" ? "Hears" : "Command";
                        console.log(util.styleText("green", "[+]"), `Loaded ${type} - ${cmd.name}`);
                    }
                }
            } catch (error) {
                if (isShowLog) console.warn(util.styleText("yellow", "[!]"), `Failed to load ${file}: ${error}`);
            }
        }

        if (isShowLog) console.groupEnd();
    }

    _getFiles() {
        return globSync("**/*.js", {
            cwd: this._path,
            nodir: true,
            absolute: true
        });
    }

    _normalizeCommands(module, file) {
        if (module.name && (!module.type || module.type === "command" || module.type === "hears")) return [module];
        if (Array.isArray(module)) return module.filter(cmd => cmd.name && (!cmd.type || cmd.type === "command" || cmd.type === "hears"));
        return [];
    }

    _registerCommand(cmd) {
        if (cmd.type === "hears") {
            this._bot.hearsMap.set(cmd.name, cmd);
        } else {
            this._bot.cmd.set(cmd.name, cmd);
        }
    }
}

module.exports = CommandHandler;