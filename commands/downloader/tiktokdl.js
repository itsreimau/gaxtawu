const axios = require("axios");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tt", "ttdl", "vt", "vtdl"],
    category: "downloader",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@grazeuz/video/7486690677888158984")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("yp", "/api/downloader/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            if (!result.data[0].type.includes("photo")) {
                await ctx.reply({
                    video: {
                        url: result.data.find(res => res.type === "nowatermark").url
                    },
                    mimetype: tools.mime.lookup("mp4"),
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else {
                const album = result.data.map(res => ({
                    image: {
                        url: res.url
                    },
                    mimetype: tools.mime.lookup("png")
                }));

                await ctx.reply({
                    album,
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};