module.exports = {
    name: "sertifikattolol",
    aliases: ["sertiftolol", "tolol"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "shinji ikari")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        if (input.length > 100) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 100 kata!")}`);

        try {
            const result = tools.api.createUrl("hang", "/imagecreator/sertifikat-tolol", {
                text: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png")
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};