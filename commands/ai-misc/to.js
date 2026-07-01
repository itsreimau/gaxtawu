module.exports = [{
    name: "toanime",
    aliases: ["animekan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/toanime", {
                url: uploadUrl
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
}, {
    name: "tobugil",
    aliases: ["bugilkan", "deepnude", "removeclothes"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("kuroneko", "/api/maker/deepnude", {
                url: uploadUrl
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
}, {
    name: "tochibi",
    aliases: ["chibikan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tochibi", {
                url: uploadUrl
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
}, {
    name: "tofigure",
    aliases: ["figurekan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tofigura", {
                url: uploadUrl
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
}, {
    name: "toghibli",
    aliases: ["ghiblikan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/toghibli", {
                url: uploadUrl
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
}, {
    name: "tohijab",
    aliases: ["hijabkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tohijab", {
                url: uploadUrl
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
}, {
    name: "tohitam",
    aliases: ["hitamkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tohitam", {
                url: uploadUrl
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
}, {
    name: "tolego",
    aliases: ["legokan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tolego", {
                url: uploadUrl
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
}, {
    name: "tomaid",
    aliases: ["maidkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tomaid", {
                url: uploadUrl
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
}, {
    name: "tomirrorselfie",
    aliases: ["mirrorselfiekan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tomirror", {
                url: uploadUrl
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
}, {
    name: "toroblox",
    aliases: ["robloxkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/toroblox", {
                url: uploadUrl
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
}, {
    name: "tostreetwear",
    aliases: ["streetwearkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tostreetwear", {
                url: uploadUrl
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
}, {
    name: "tounderground",
    aliases: ["undergroundkan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tounderground", {
                url: uploadUrl
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
}, {
    name: "tovintage",
    aliases: ["vintagekan"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const result = tools.api.createUrl("faaa", "/faa/tovintage", {
                url: uploadUrl
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
}];