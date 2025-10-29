const { Gktw } = require("@itsreimau/gktw");
const axios = require("axios");

module.exports = {
    name: "pixverse",
    category: "ai-generate",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const senderDb = ctx.db.user;

        const input = ctx.args.join(" ") || ctx.quoted?.content || null;

        if (!input && !senderDb.task?.pixverse) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "anime girl with short blue hair")}\n` +
            tools.msg.generateNotes(["AI ini dapat melihat gambar.", "Balas/quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."])
        );

        const [checkMedia, checkQuotedMedia] = [
            tools.cmd.checkMedia(ctx.msg.contentType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted?.contentType, "image")
        ];

        try {
            if (senderDb.task?.pixverse) {
                const checkUrl = tools.api.createUrl("nekolabs", "/ai/pixverse-v5/get", {
                    id: senderDb.task.pixverse.id
                });
                const checkResult = (await axios.get(checkUrl)).data.result;

                const taskStatus = checkResult.status;
                if (taskStatus === "succeeded") {
                    delete senderDb.task.pixverse;
                    senderDb.save();
                    return await ctx.reply({
                        video: {
                            url: checkResult.output
                        },
                        mimetype: tools.mime.lookup("mp4"),
                        caption: `➛ ${formatter.bold("Prompt")}: ${senderDb.task.pixverse.prompt}`
                    });
                } else if (taskStatus === "processing" || taskStatus === "starting") {
                    return await ctx.reply(`ⓘ ${formatter.italic("Video masih dalam proses pembuatan. Silakan tunggu beberapa saat dan kirim perintah lagi untuk mengecek hasilnya.")}`);
                } else {
                    delete senderDb.task.pixverse;
                    senderDb.save();
                    return await ctx.reply(`ⓘ ${formatter.italic("Proses pembuatan video gagal!")}`);
                }
            }

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = (await Gktw.uploadFile(buffer)).data.url;
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/pixverse/create", {
                    prompt: input,
                    ratio: tools.cmd.getRandomElement(["16:9", "9:16"]),
                    imageUrl: uploadUrl
                });
                const result = (await axios.get(apiUrl)).data.result;

                (senderDb.task ||= {}).pixverse = {
                    id: result.id,
                    prompt: input
                };
                senderDb.save();

                await ctx.reply(`ⓘ ${formatter.italic("Proses ini membutuhkan waktu beberapa menit. Kirim perintah lagi nanti untuk mengecek hasilnya.")}`);
            } else {
                const apiUrl = tools.api.createUrl("nekolabs", "/ai/pixverse-v5/create", {
                    prompt: input,
                    ratio: tools.cmd.getRandomElement(["16:9", "9:16"])
                });
                const result = (await axios.get(apiUrl)).data.result;

                (senderDb.task ||= {}).pixverse = {
                    id: result.id,
                    prompt: input
                };
                senderDb.save();

                await ctx.reply(`ⓘ ${formatter.italic("Proses ini membutuhkan waktu beberapa menit. Kirim perintah lagi nanti untuk mengecek hasilnya.")}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};