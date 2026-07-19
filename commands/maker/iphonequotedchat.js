const moment = require("moment-timezone");

module.exports = {
    name: "iphonequotedchat",
    aliases: ["iqc"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!")
            );

        if (input.length > 1000) return await ctx.reply(ctx.msg.info("Maksimal 1000 karakter!"));

        try {
            const result = ctx.api.createUrl("nexray", "/maker/v1/iqc", {
                text: input,
                provider: await checkBrandProvider(ctx.getId(ctx.sender.jid)),
                jam: moment.tz(config.system.timeZone).format("HH:mm"),
                baterai: Math.floor(Math.random() * 100) + 1
            });

            await ctx.reply({
                image: {
                    url: result
                }
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};

async function checkBrandProvider(number) {
    const provider = (await ctx.request.get(ctx.api.createUrl("sanka", "/random/cek-nomor", {
        nomor: number.replace(/^62/, "0")
    }, "apikey"))).data.data.operator;
    return provider || "Telkomsel";
}