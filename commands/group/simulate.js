const { WelcomeHandler } = require("../../events/welcome");

module.exports = {
    name: "simulate",
    aliases: ["sim"],
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "join")}\n` +
                ctx.format.generateNotes([
                    `Gunakan ${ctx.format.inlineCode("leave")} untuk mensimulasikan keluar dari grup.`
                ])
            );

        try {
            const welcome = {
                id: ctx.id,
                participant: ctx.sender.lid,
                participantPn: ctx.sender.jid
            };

            switch (input.toLowerCase()) {
                case "j":
                case "join":
                    await WelcomeHandler(ctx, welcome, "UserJoin", true);
                    break;
                case "l":
                case "leave":
                    await WelcomeHandler(ctx, welcome, "UserLeave", true);
                    break;
                default:
                    await ctx.reply(ctx.format.info(`Simulasi ${ctx.format.inlineCode(input)} tidak valid!`));
            }

            await ctx.reply(ctx.format.info("Simulasi berhasil!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};