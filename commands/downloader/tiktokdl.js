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

        if (!url) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, "https://www.tiktok.com/@grazeuz/video/7486690677888158984")
        );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/tiktok", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            if (result.play && !result.images) {
                await ctx.reply({
                    video: {
                        url: result.play
                    },
                    mimetype: tools.mime.lookup("mp4"),
                    caption: `➛ ${formatter.bold("URL")}: ${url}`
                });
            } else if (result.images) {
                const album = result.images.map(res => ({
                    image: {
                        url: res
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