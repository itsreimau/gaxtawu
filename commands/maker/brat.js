module.exports = [{
    name: "brat",
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
            const result = tools.api.createUrl("delirius", "/canvas/brat", {
                text: input
            });

            await ctx.reply({
                sticker: { url: buffer }
            }, {
                pack: config.sticker.packname,
                author: config.sticker.author
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
}, {
    name: "bratgif",
    aliases: ["bratvid", "bratvideo"],
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
            const result = tools.api.createUrl("delirius", "/canvas/bratvideo", {
                text: input
            });

            await ctx.reply({
                sticker: { url: result }
            }, {
                pack: config.sticker.packname,
                author: config.sticker.author
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error, true);
        }
    }
}];