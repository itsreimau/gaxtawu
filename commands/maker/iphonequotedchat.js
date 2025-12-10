module.exports = {
    name: "iphonequotedchat",
    aliases: ["iqc"],
    category: "maker",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!")}\n` +
            tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        if (input.length > 1000) return await ctx.reply(`ⓘ ${formatter.italic("Maksimal 1000 kata!")}`);

        try {
            const result = tools.api.createUrl("znx", "/api/maker/iqc", {
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