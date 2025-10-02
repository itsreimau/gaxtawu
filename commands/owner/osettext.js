module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0] || null;
        const text = ctx.args.slice(1).join(" ") || ctx.quoted?.content || null;

        if (key?.toLowerCase() === "list") {
            const listText = await tools.list.get("osettext");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        if (!key || !text) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "price $1 untuk sewa bot 1 bulan"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah.", `Gunakan ${formatter.inlineCode("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`]))
        );

        try {
            const groupDb = ctx.db.group;
            let setKey;

            switch (key.toLowerCase()) {
                case "donate":
                case "price":
                case "qris":
                    setKey = key.toLowerCase();
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Teks ${formatter.inlineCode(key)} tidak valid!`));
            }

            if (text.toLowerCase() === "delete") {
                delete groupDb?.text[setKey];
                await groupDb.save();
                return await ctx.reply(formatter.quote(`🗑️ Pesan untuk teks ${formatter.inlineCode(key)} berhasil dihapus!`));
            }

            (groupDb.text ||= {})[setKey] = text;
            await groupDb.save();
            await ctx.reply(formatter.quote(`✅ Pesan untuk teks ${formatter.inlineCode(key)} berhasil disimpan!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};