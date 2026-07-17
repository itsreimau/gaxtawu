const { handleWelcome } = require("../../events/welcome");

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
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "join")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${tools.msg.inlineCode("leave")} untuk mensimulasikan keluar dari grup.`
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
                    await handleWelcome(ctx, welcome, "UserJoin", true);
                    break;
                case "l":
                case "leave":
                    await handleWelcome(ctx, welcome, "UserLeave", true);
                    break;
                default:
                    await ctx.reply(tools.msg.info(`Simulasi ${tools.msg.inlineCode(input)} tidak valid!`));
            }

            await ctx.reply(tools.msg.info("Simulasi berhasil!"));
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};