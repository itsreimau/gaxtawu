const moment = require("moment-timezone");

module.exports = {
    name: "iphonequotedchat",
    aliases: ["iqc"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 1000) return await ctx.reply(formatter.quote("❎ Maksimal 1000 kata!"));

        try {
            const result = tools.api.createUrl("deline", "/maker/iqc", {
                text: input,
                chatTime: moment().tz("Asia/Tokyo").format("HH:mm"),
                statusBarTime: moment().tz("Asia/Jakarta").format("HH:mm")
            });

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                footer: config.msg.footer
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};