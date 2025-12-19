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
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "antilink")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} status`)} untuk melihat status.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setoption");
            return await ctx.reply(listText);
        }

        if (input.toLowerCase() === "status") {
            const groupId = ctx.getId(ctx.id);
            const groupOption = ctx.db.group.option || {};

            return await ctx.reply(
                `➛ ${formatter.bold("Antiaudio")}: ${groupOption.antiaudio ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antidocument")}: ${groupOption.antidocument ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antigif")}: ${groupOption.antigif ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antiimage")}: ${groupOption.antiimage ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antilink")}: ${groupOption.antilink ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antispam")}: ${groupOption.antispam ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antisticker")}: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antitagsw")}: ${groupOption.antitagsw ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antitoxic")}: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Antivideo")}: ${groupOption.antivideo ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Autokick")}: ${groupOption.autokick ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Gamerestrict")}: ${groupOption.gamerestrict ? "Aktif" : "Nonaktif"}\n` +
                `➛ ${formatter.bold("Welcome")}: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`
            );
        }

        try {
            const groupDb = ctx.db.group;
            let setKey;

            switch (input.toLowerCase()) {
                case "antiaudio":
                case "antidocument":
                case "antigif":
                case "antiimage":
                case "antilink":
                case "antispam":
                case "antisticker":
                case "antitagsw":
                case "antitoxic":
                case "antivideo":
                case "autokick":
                case "gamerestrict":
                case "welcome":
                    setKey = input.toLowerCase();
                    break;
                default:
                    return await ctx.reply(`ⓘ ${formatter.italic(`Opsi ${formatter.inlineCode(input)} tidak valid!`)}`);
            }

            const currentStatus = groupDb?.option?.[setKey] || false;
            const newStatus = !currentStatus;

            (groupDb.option ||= {})[setKey] = newStatus;
            groupDb.save();
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            await ctx.reply(`ⓘ ${formatter.italic(`Opsi ${formatter.inlineCode(input)} berhasil ${statusText}!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};