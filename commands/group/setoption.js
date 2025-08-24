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
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "antilink"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} status`)} untuk melihat status.`]))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setoption");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        if (input.toLowerCase() === "status") {
            const groupId = ctx.getId(ctx.id);
            const groupOption = await db.get(`group.${groupId}.option`) || {};

            return await ctx.reply({
                text: `${formatter.quote(`Antiaudio: ${groupOption.antiaudio ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antidocument: ${groupOption.antidocument ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antigif: ${groupOption.antigif ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antiimage: ${groupOption.antiimage ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antilink: ${groupOption.antilink ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antinsfw: ${groupOption.antinsfw ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antispam: ${groupOption.antispam ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antisticker: ${groupOption.antisticker ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antitagsw: ${groupOption.antitagsw ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antitoxic: ${groupOption.antitoxic ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Antivideo: ${groupOption.antivideo ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Autokick: ${groupOption.autokick ? "Aktif" : "Nonaktif"}`)}\n` +
                    `${formatter.quote(`Gamerestrict: ${groupOption.gamerestrict ? "Aktif" : "Nonaktif"}`)}\n` +
                    formatter.quote(`Welcome: ${groupOption.welcome ? "Aktif" : "Nonaktif"}`),
                footer: config.msg.footer
            });
        }

        try {
            const groupId = ctx.getId(ctx.id);
            let setKey;

            switch (input.toLowerCase()) {
                case "antiaudio":
                case "antidocument":
                case "antigif":
                case "antiimage":
                case "antilink":
                case "antinsfw":
                case "antispam":
                case "antisticker":
                case "antitagsw":
                case "antitoxic":
                case "antivideo":
                case "autokick":
                case "gamerestrict":
                case "welcome":
                    setKey = `group.${groupId}.option.${input.toLowerCase()}`;
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Opsi ${formatter.inlineCode(input)} tidak valid!`));
            }

            const currentStatus = await db.get(setKey);
            const newStatus = !currentStatus;

            await db.set(setKey, newStatus);
            const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
            await ctx.reply(formatter.quote(`✅ Opsi ${formatter.inlineCode(input)} berhasil ${statusText}!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};