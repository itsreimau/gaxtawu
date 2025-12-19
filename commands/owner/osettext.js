module.exports = {
    name: "osettext",
    aliases: ["osettxt"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const key = ctx.args[0] || null;
        const text = ctx.text ? (ctx.text.startsWith(`${key} `) ? ctx.text.slice(key.length + 1) : ctx.text) : (ctx.quoted?.text || null);

        if (key?.toLowerCase() === "list") {
            const listText = await tools.list.get("osettext");
            return await ctx.reply(listText);
        }

        if (!key || !text)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "price $1 untuk sewa bot 1 bulan")}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`,
                    "Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah.",
                    `Gunakan ${formatter.inlineCode("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`
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
                    return await ctx.reply(`ⓘ ${formatter.italic(`Teks ${formatter.inlineCode(key)} tidak valid!`)}`);
            }

            if (text.toLowerCase() === "delete") {
                delete config?.text[setKey];
                config.save();
                return await ctx.reply(`ⓘ ${formatter.italic(`Pesan untuk teks ${formatter.inlineCode(key)} berhasil dihapus!`)}`);
            }

            (config.text ||= {})[setKey] = text;
            config.save();
            await ctx.reply(`ⓘ ${formatter.italic(`Pesan untuk teks ${formatter.inlineCode(key)} berhasil disimpan!`)}`);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};