const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "quotlychat",
    aliases: ["qc", "quotly"],
    category: "maker",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "get in the fucking robot, shinji!"))}\n` +
            formatter.quote(tools.msg.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (input.length > 1000) return await ctx.reply(formatter.quote("❎ Maksimal 1000 kata!"));

        try {
            const isQuoted = ctx.args.length === 0 && ctx.quoted?.senderJid;
            const profilePictureUrl = await ctx.core.profilePictureUrl(isQuoted ? ctx.quoted?.senderJid : ctx.sender.jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
            const payload = {
                backgroundColor: "#111b21",
                scale: 2,
                emojiBrand: "apple",
                messages: [{
                    from: {
                        name: isQuoted ? ctx.quoted?.pushName : ctx.sender.pushName,
                        photo: {
                            url: profilePictureUrl
                        }
                    },
                    text: input,
                    avatar: true
                }]
            };
            const apiurl = tools.api.createUrl("https://bot.lyo.su", "/quote/generate.webp");
            const result = (await axios.post(apiurl, payload, {
                responseType: "arraybuffer"
            })).data;
            const sticker = new Sticker(result, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🌕"],
                id: ctx.id,
                quality: 50
            });

            await ctx.reply(await sticker.toMessage());
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};