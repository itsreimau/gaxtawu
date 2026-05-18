module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    code: async (ctx) => {
        let input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, tools.cmd.getRandomElement(["autolevelup", "stickerwm stiker saya|itsreimau"]))}\n` +
                tools.msg.generateNotes([
                    `Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setprofile");
            return await ctx.reply(listText);
        }

        try {
            const senderDb = ctx.db.user;
            const option = ctx.args[0]?.toLowerCase();

            switch (option) {
                case "autolevelup": {
                    const currentStatus = senderDb?.autolevelup || false;
                    const newStatus = !currentStatus;
                    senderDb.autolevelup = newStatus;
                    senderDb.save();

                    const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
                    await ctx.reply(tools.msg.info(`Autolevelup berhasil ${statusText}!`));
                    break;
                }
                case "stickerwm": {
                    input = ctx.args.slice(1).join(" ");

                    if (!input) return await ctx.reply(tools.msg.info("Mohon masukkan stickerwm yang ingin digunakan."));

                    const [packname, author] = input.split("|");
                    senderDb.stickerwm = {
                        packname: packname || "",
                        author: author || ""
                    };
                    senderDb.save();

                    await ctx.reply(tools.msg.info("Stickerwm berhasil disimpan!"));
                    break;
                }
                default:
                    await ctx.reply(tools.msg.info(`Setelan ${formatter.inlineCode(input)} tidak valid.`));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};