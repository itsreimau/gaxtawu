module.exports = {
    name: "settext",
    aliases: ["settxt"],
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const key = ctx.args[0] || null;
        const text = ctx.text ? (ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.text) : (ctx.quoted?.text || null);

        if (key?.toLowerCase() === "list") {
            const listText = await tools.list.get("settext");
            return await ctx.reply(listText);
        }

        if (!key || !text)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "welcome Selamat datang di grup!")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    `Gunakan ${formatter.inlineCode("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`
                ])
            );

        try {
            const groupDb = ctx.db.group;
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                case "intro":
                case "welcome":
                    setKey = key.toLowerCase();
                    break;
                default:
                    return await ctx.reply(`ⓘ ${formatter.italic(`Teks ${formatter.inlineCode(key)} tidak valid!`)}`);
            }

            if (text.toLowerCase() === "delete") {
                delete groupDb?.text?.[setKey];
                groupDb.save();
                return await ctx.reply(`ⓘ ${formatter.italic(`Pesan untuk teks ${formatter.inlineCode(key)} berhasil dihapus!`)}`);
            }

            (groupDb.text ||= {})[setKey] = text;
            groupDb.save();
            await ctx.reply(`ⓘ ${formatter.italic(`Pesan untuk teks ${formatter.inlineCode(key)} berhasil disimpan!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};