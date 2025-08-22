module.exports = {
    name: "upload",
    aliases: ["tourl"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(ctx.msg.contentType, ["audio", "document", "image", "video", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, ["audio", "document", "image", "video", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "video", "sticker"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "-t any -h cloudku"))}\n` +
            formatter.quote(tools.msg.generatesFlagInfo({
                "-t <text>": "Atur tipe media (tersedia: any, image, video, audio | default: any)",
                "-h <text>": `Atur host uploader (tersedia: catbox, cloudku, fasturl, litterbox, pomf, quax, ryzumi, uguu, videy | default: ${config.system.uploaderHost.toLowerCase()})`
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-t": {
                    type: "value",
                    key: "type",
                    validator: (val) => /^(any|image|video|audio)$/.test(val),
                    parser: (val) => val
                },
                "-h": {
                    type: "value",
                    key: "host",
                    validator: (val) => /^(catbox|cloudku|fasturl|litterbox|pomf|quax|ryzumi|uguu|videy)$/.test(val),
                    parser: (val) => val
                }
            });

            const type = flag?.type ? flag.type : (checkMedia || checkQuotedMedia);
            const host = flag?.host || config.system.uploaderHost;

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const result = await tools.cmd.upload(buffer, type, host);

            return await ctx.reply({
                text: formatter.quote(`URL: ${result}`),
                footer: config.msg.footer,
                interactiveButtons: [{
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Salin URL",
                        copy_code: result
                    })
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};