const axios = require("axios");

module.exports = {
    name: "twitterdl",
    aliases: ["twitter", "twit", "twitdl", "x", "xdl"],
    category: "downloader",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://x.com/kaotaro12/status/1459493783964250118")
            );

        if (!tools.cmd.isUrl(url)) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("izumi", "/downloader/twitter", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;
            const album = [];
            let currentVideo;
            for (const item of result) {
                if (item.type === "video") {
                    if (!currentVideo || item.resolution !== currentVideo.resolution) {
                        currentVideo = item;
                        album.push({
                            video: {
                                url: item.link
                            },
                            mimetype: tools.mime.lookup("mp4")
                        });
                    }
                } else {
                    album.push({
                        image: {
                            url: item.link
                        },
                        mimetype: tools.mime.lookup("png")
                    });
                }
            }

            await ctx.reply({
                album,
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};