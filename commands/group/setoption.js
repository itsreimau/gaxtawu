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
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "antilink")}\n` +
                ctx.format.generateNotes([
                    `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} status`)} untuk melihat status.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "setoption");
            return await ctx.reply(listText);
        }

        if (input.toLowerCase() === "status") {
            const groupOption = ctx.db.group.option || {};
            return await ctx.reply(
                `❖ ${ctx.format.bold("Antiaudio")}: ${groupOption.antiaudio ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antidocument")}: ${groupOption.antidocument ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antiimage")}: ${groupOption.antiimage ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antisticker")}: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antivideo")}: ${groupOption.antivideo ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antigcsw")}: ${groupOption.antigcsw ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antilink")}: ${groupOption.antilink ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antispam")}: ${groupOption.antispam ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antitagsw")}: ${groupOption.antitagsw ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Antitoxic")}: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Autokick")}: ${groupOption.autokick ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Gamerestrict")}: ${groupOption.gamerestrict ? "Aktif" : "Nonaktif"}\n` +
                `❖ ${ctx.format.bold("Welcome")}: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`
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
                    return await ctx.reply(ctx.format.info(`Opsi ${ctx.format.inlineCode(input)} tidak valid!`));
            }

            const groupDb = ctx.db.group;

            const currentStatus = groupDb?.option?.[setKey] || false;
            const newStatus = !currentStatus;

            (groupDb.option ||= {})[setKey] = newStatus;
            groupDb.save();
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            await ctx.reply(ctx.format.info(`Opsi ${ctx.format.inlineCode(input)} berhasil ${statusText}!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};