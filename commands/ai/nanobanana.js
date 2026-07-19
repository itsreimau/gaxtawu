module.exports = {
    name: "nanobanana",
    category: "ai",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.msg.generateInstruction(["send"], ["text"])}\n` +
                ctx.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const isMedia = ctx.isMedia(["image"]);

        if (!isMedia) return await ctx.reply(ctx.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = ctx.api.createUrl("faaa", "/faa/nano-banana", {
                url: uploadUrl,
                prompt: input
            });

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${ctx.msg.bold("Prompt")}: ${input}`
            });
        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};