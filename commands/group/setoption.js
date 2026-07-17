module.exports = {
    name: "setoption",
    aliases: ["setopt"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "antilink")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    `Ketik ${tools.msg.inlineCode(`${ctx.used.prefix + ctx.used.command} status`)} untuk melihat status.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setoption");
            return await ctx.reply(listText);
        }

        if (input.toLowerCase() === "status") {
            const groupOption = ctx.db.group.option || {};
            return await ctx.reply(
                `❖ ${tools.msg.bold("Antiaudio")}: ${groupOption.antiaudio ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antidocument")}: ${groupOption.antidocument ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antiimage")}: ${groupOption.antiimage ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antisticker")}: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antivideo")}: ${groupOption.antivideo ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antigcsw")}: ${groupOption.antigcsw ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antilink")}: ${groupOption.antilink ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antispam")}: ${groupOption.antispam ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antitagsw")}: ${groupOption.antitagsw ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Antitoxic")}: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Autokick")}: ${groupOption.autokick ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Gamerestrict")}: ${groupOption.gamerestrict ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${tools.msg.bold("Welcome")}: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`
            );
        }

        try {
            let setKey;

            switch (input.toLowerCase()) {
                case "antiaudio":
                case "antidocument":
                case "antiimage":
                case "antisticker":
                case "antivideo":
                case "antigcsw":
                case "antilink":
                case "antispam":
                case "antitagsw":
                case "antitoxic":
                case "autokick":
                case "gamerestrict":
                case "welcome":
                    setKey = input.toLowerCase();
                    break;
                default:
                    return await ctx.reply(tools.msg.info(`Opsi ${tools.msg.inlineCode(input)} tidak valid!`));
            }

            const groupDb = ctx.db.group;

            const currentStatus = groupDb?.option?.[setKey] || false;
            const newStatus = !currentStatus;

            (groupDb.option ||= {})[setKey] = newStatus;
            groupDb.save();
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            await ctx.reply(tools.msg.info(`Opsi ${tools.msg.inlineCode(input)} berhasil ${statusText}!`));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};