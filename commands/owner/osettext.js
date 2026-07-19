module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0];
        const text = ctx.text ? (ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.text) : ctx.quoted?.body;

        if (key?.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "osettext");
            return await ctx.reply(listText);
        }

        if (!key || !text)
            return await ctx.reply(
                `${ctx.text.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.text.generateCmdExample(ctx.used, "price $1 untuk sewa bot 1 bulan")}\n` +
                ctx.text.generateNotes([
                    `Ketik ${ctx.text.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    `Gunakan ${ctx.text.inlineCode("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`
                ])
            );

        try {
            let setKey;

            switch (key.toLowerCase()) {
                case "donate":
                case "price":
                case "qris":
                    setKey = key.toLowerCase();
                    break;
                default:
                    return await ctx.reply(ctx.text.info(`Teks ${ctx.text.inlineCode(key)} tidak valid!`));
            }

            const botDb = ctx.db.bot;

            if (text.toLowerCase() === "delete") {
                delete botDb?.text[setKey];
                botDb.save();
                return await ctx.reply(ctx.text.info(`Pesan untuk teks ${ctx.text.inlineCode(key)} berhasil dihapus!`));
            }

            (botDb.text ||= {})[setKey] = text;
            botDb.save();
            await ctx.reply(ctx.text.info(`Pesan untuk teks ${ctx.text.inlineCode(key)} berhasil disimpan!`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};