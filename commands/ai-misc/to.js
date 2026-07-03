const codeBase = async (ctx, apiConfig) => {
    const [checkMedia, checkQuotedMedia] = [
        tools.cmd.checkMedia(ctx.msg.messageType, ["image"]),
        tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["image"])
    ];

    if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["image"]));

    try {
        const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
        let result;

        if (apiConfig.type === "direct") {
            const params = apiConfig.params || {};
            params.url = uploadUrl;
            result = tools.api.createUrl(apiConfig.base, apiConfig.path, params, apiConfig.apiKeyParam || null);
        } else if (apiConfig.type === "axios") {
            const params = {
                [apiConfig.urlParam || "url"]: uploadUrl
            };
            const apiUrl = tools.api.createUrl(apiConfig.base, apiConfig.path, params);
            const response = await axios.get(apiUrl);
            result = apiConfig.resultPath.split(".").reduce((obj, key) => obj?.[key], response.data);
        }

        await ctx.reply({
            image: { url: result }
        });
    } catch (error) {
        await tools.cmd.handleError(ctx, error, true);
    }
};

const API_CONFIGS = {
    toanime: {
        type: "direct",
        base: "faaa",
        path: "/faa/toanime",
        permissions: { coin: 10 },
        aliases: ["animekan"]
    },
    tobugil: {
        type: "axios",
        base: "kuroneko",
        path: "/api/maker/deepnude",
        permissions: { premium: true },
        urlParam: "url",
        resultPath: "data.image",
        aliases: ["bugilkan", "deepnude", "removeclothes"]
    },
    tochibi: {
        type: "direct",
        base: "faaa",
        path: "/faa/tochibi",
        permissions: { coin: 10 },
        aliases: ["chibikan"]
    },
    tofigure: {
        type: "direct",
        base: "faaa",
        path: "/faa/tofigura",
        permissions: { coin: 10 },
        aliases: ["figurekan"]
    },
    toghibli: {
        type: "direct",
        base: "faaa",
        path: "/faa/toghibli",
        permissions: { coin: 10 },
        aliases: ["ghiblikan"]
    },
    tohijab: {
        type: "direct",
        base: "faaa",
        path: "/faa/tohijab",
        permissions: { coin: 10 },
        aliases: ["hijabkan"]
    },
    tohitam: {
        type: "direct",
        base: "faaa",
        path: "/faa/tohitam",
        permissions: { coin: 10 },
        aliases: ["hitamkan"]
    },
    tolego: {
        type: "direct",
        base: "faaa",
        path: "/faa/tolego",
        permissions: { coin: 10 },
        aliases: ["legokan"]
    },
    tomaid: {
        type: "direct",
        base: "faaa",
        path: "/faa/tomaid",
        permissions: { coin: 10 },
        aliases: ["maidkan"]
    },
    tomirrorselfie: {
        type: "direct",
        base: "faaa",
        path: "/faa/tomirror",
        permissions: { coin: 10 },
        aliases: ["mirrorselfiekan"]
    },
    toroblox: {
        type: "direct",
        base: "faaa",
        path: "/faa/toroblox",
        permissions: { coin: 10 },
        aliases: ["robloxkan"]
    },
    tostreetwear: {
        type: "direct",
        base: "faaa",
        path: "/faa/tostreetwear",
        permissions: { coin: 10 },
        aliases: ["streetwearkan"]
    },
    tounderground: {
        type: "direct",
        base: "faaa",
        path: "/faa/tounderground",
        permissions: { coin: 10 },
        aliases: ["undergroundkan"]
    },
    tovintage: {
        type: "direct",
        base: "faaa",
        path: "/faa/tovintage",
        permissions: { coin: 10 },
        aliases: ["vintagekan"]
    }
};

module.exports = Object.entries(API_CONFIGS).map(([name, config]) => {
    const aliases = config.aliases || [];

    return {
        name: name,
        aliases: aliases,
        category: "ai-misc",
        permissions: config.permissions,
        code: async (ctx) => codeBase(ctx, config)
    };
});