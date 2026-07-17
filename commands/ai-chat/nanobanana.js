const { randomUUID } = require("node:crypto");

module.exports = {
        name: "nanobanana",
        category: "ai-chat",
        permissions: {
            coin: 10
        },
        code: async (ctx) => {
            const input = ctx.text;

            if (!input)
                return await ctx.reply(
                    `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                    tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
                );

            const [checkMedia, checkQuotedMedia] = [
                tools.helper.checkMedia(ctx.msg.messageType, ["image"]),
                tools.helper.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
            ];

            if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

            try {
                const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
                const result = tools.api.createUrl("faaa", "/faa/nano-banana", {
                    url: uploadUrl,
                    prompt: input
                });

                await ctx.reply({
                    image: {
                        url: result
                    },
                    caption: `❖ ${formatter.bold("Prompt")}: ${input}`
                });
            } catch (error) {
                await tools.helper.handleError(ctx, error, true);
            }
        };