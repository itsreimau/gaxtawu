const codeBase = async (ctx, apiConfig) => {
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
        let result;

        if (apiConfig.type === "direct") {
            const params = {
                url: uploadUrl,
                prompt: input
            };
            result = tools.api.createUrl(apiConfig.base, apiConfig.path, params, apiConfig.apiKeyParam || null);
        } else if (apiConfig.type === "axios") {
            const params = {
                [apiConfig.urlParam || "url"]: uploadUrl,
                prompt: input
            };
            const apiUrl = tools.api.createUrl(apiConfig.base, apiConfig.path, params);
            const response = await axios.get(apiUrl);
            result = apiConfig.resultPath.split(".").reduce((obj, key) => obj?.[key], response.data);
        }

        await ctx.reply({
            image: {
                url: result
            },
            caption: `❖ ${formatter.bold("Prompt")}: ${input}`
        });
    } catch (error) {
        await tools.cmd.handleError(ctx, error, true);
    }
};

const API_CONFIGS = {
    editimage: {
        type: "direct",
        base: "faaa",
        path: "/faa/editfoto",
        permissions: {
            coin: 10
        }
    },
    editimage2: {
        type: "direct",
        base: "faaa",
        path: "/faa/nano-banana",
        permissions: {
            coin: 10
        }
    },
    editimage3: {
        type: "axios",
        base: "lexcode",
        path: "/api/ai/nano-banana",
        permissions: {
            premium: true
        },
        urlParam: "url",
        resultPath: "result.image"
    },
    editimage4: {
        type: "axios",
        base: "lexcode",
        path: "/api/ai/deepai-editor",
        permissions: {
            premium: true
        },
        urlParam: "imgUrl",
        resultPath: "result.image"
    },
    editimage5: {
        type: "direct",
        base: "neosoft",
        path: "/api/ai-image/editimage",
        permissions: {
            premium: true
        }
    },
    editimage6: {
        type: "direct",
        base: "sanka",
        path: "/ai/editimg",
        permissions: {
            premium: true
        },
        apiKeyParam: "apikey"
    },
    editimage7: {
        type: "axios",
        base: "kuroneko",
        path: "/api/tools/nanobanana",
        permissions: {
            premium: true
        },
        urlParam: "media",
        resultPath: "data.image"
    }
};

module.exports = Object.entries(API_CONFIGS).map(([name, config]) => {
    const aliases = [];

    const numberMatch = name.match(/\d+$/);
    if (numberMatch) {
        aliases.push(`editimg${numberMatch[0]}`);
    } else {
        aliases.push("editimg");
    }

    return {
        name: name,
        aliases: aliases,
        category: "ai-misc",
        permissions: config.permissions,
        code: async (ctx) => codeBase(ctx, config)
    };
});