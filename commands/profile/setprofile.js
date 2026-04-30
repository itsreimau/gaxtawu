module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    code: async (ctx) => {
        let input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, tools.cmd.getRandomElement(["username itsreimau", "autolevelup", "stickerwm stiker saya|reimau von lilitz"])}\n` +
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
                case "username": {
                    input = ctx.args.slice(1).join(" ");

                    if (!input) return await ctx.reply(tools.msg.info("Mohon masukkan username yang ingin digunakan."));
                    if (/[^a-zA-Z0-9._-]/.test(input)) return await ctx.reply(tools.msg.info("Username hanya boleh berisi huruf, angka, titik (.), underscore (_) atau tanda hubung (-)."));

                    const usernameTaken = ctx.db.users.getMany(user => user.username === input).length > 0;
                    if (usernameTaken) return await ctx.reply(tools.msg.info("Username tersebut sudah digunakan oleh pengguna lain."));

                    const username = `@${input}`;
                    senderDb.username = username;
                    senderDb.save();

                    await ctx.reply(tools.msg.info(`Username berhasil diubah menjadi ${formatter.inlineCode(username)}!`));
                    break;
                }
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