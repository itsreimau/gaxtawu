const { Events } = require("@itsreimau/gktw");
const { handleWelcome } = require("../../events/handler.js");

module.exports = {
    name: "simulate",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "join")}\n` +
                tools.msg.generateNotes([
                    `Gunakan ${formatter.inlineCode("leave")} untuk mensimulasikan keluar dari grup.`
                ])
            );

        try {
            const m = {
                id: ctx.id,
                participant: ctx.sender.jid
            };

            switch (input.toLowerCase()) {
                case "j":
                case "join":
                    await handleWelcome(ctx, m, Events.UserJoin, true);
                    break;
                case "l":
                case "leave":
                    await handleWelcome(ctx, m, Events.UserLeave, true);
                    break;
                default:
                    await ctx.reply(`ⓘ ${formatter.italic(`Simulasi ${formatter.inlineCode(input)} tidak valid!`)}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};