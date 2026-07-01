module.exports = [{
    name: "editimage",
    aliases: ["editimg"],
    category: "ai-misc",
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
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/editfoto", {
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage2",
    aliases: ["editimg2"],
    category: "ai-misc",
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
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage3",
    aliases: ["editimg3"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("lexcode", "/api/ai/nano-banana", {
                url: uploadUrl,
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.result.image;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage4",
    aliases: ["editimg4"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("lexcode", "/api/ai/deepai-editor", {
                imgUrl: uploadUrl,
                prompt: input
            });
            const result = (await axios.get(apiUrl)).data.result.image;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage5",
    aliases: ["editimg5"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("neosoft", "/api/ai-image/editimage", {
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
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage6",
    aliases: ["editimg6"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("sanka", "/ai/editimg", {
                url: uploadUrl,
                prompt: input
            }, "apikey");

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}, {
    name: "editimage7",
    aliases: ["editimg7"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "make it evangelion art style")
            );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("kuroneko", "/api/tools/nanobanana", {
                prompt: input,
                media: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.data.image;

            await ctx.reply({
                image: {
                    url: result
                },
                caption: `❖ ${formatter.bold("Prompt")}: ${input}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
}];