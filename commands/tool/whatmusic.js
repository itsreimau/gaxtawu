module.exports = {
    name: "whatmusic",
    aliases: ["shazam"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.messageType, ["audio"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.messageType, ["audio"])
        ];

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(tools.msg.generateInstruction(["send", "reply"], ["audio"]));

        try {
            const uploadUrl = await ctx.msg.upload() || await ctx.quoted.upload();
            const apiUrl = tools.api.createUrl("nexray", "/tools/whatsmusic", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                text: `❖ ${formatter.bold("Judul")}: ${result.title}\n` +
                    `❖ ${formatter.bold("Artis")}: ${result.artist}`,
                buttons: [{
                    text: "Download (Spotify)",
                    id: `${ctx.used.prefix}spotifydl ${result.url.find(url => url.includes("spotify.com"))}`
                }, {
                    text: "Download (YouTube)",
                    id: `${ctx.used.prefix}youtubevideo ${result.url.find(url => url.includes("youtu.be"))}`
                }]
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};