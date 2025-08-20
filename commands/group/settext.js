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
        const text = ctx.args.slice(1).join(" ") || ctx?.quoted.content || null;

        if (key?.toLowerCase() === "list") {
            const listText = await tools.list.get("settext");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        if (!key || !text) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "welcome Selamat datang di grup!"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru.", `Gunakan ${formatter.inlineCode("delete")} sebagai teks untuk menghapus teks yang disimpan sebelumnya.`]))
        );

        try {
            const groupId = ctx.getId(ctx.id);
            let setKey;

            switch (key.toLowerCase()) {
                case "goodbye":
                case "intro":
                case "welcome":
                    setKey = `group.${groupId}.text.${key.toLowerCase()}`;
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Teks ${formatter.inlineCode(key)} tidak valid!`));
            }

            if (text.toLowerCase() === "delete") {
                await db.delete(setKey);
                return await ctx.reply(formatter.quote(`🗑️ Pesan untuk teks ${formatter.inlineCode(key)} berhasil dihapus!`));
            }

            await db.set(setKey, text);
            return await ctx.reply(formatter.quote(`✅ Pesan untuk teks ${formatter.inlineCode(key)} berhasil disimpan!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};