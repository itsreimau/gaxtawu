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
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!")
            );

        if (input.length > 1000) return await ctx.reply(tools.msg.info("Maksimal 1000 karakter!"));

        try {
            const result = tools.api.createUrl("nexray", "/maker/v1/iqc", {
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};

async function checkBrandProvider(number) {
    const prefix = number.replace(/^62/, "0").substring(0, 4);
    const providers = (await axios.get("https://raw.githubusercontent.com/zororaka00/id-mobile-detector/refs/heads/main/dist/providers.json")).data;
    const found = providers.find(p => p.prefix === prefix);
    return found ? found.brand : "Telkomsel";
}