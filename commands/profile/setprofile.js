module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    code: async (ctx) => {
        let input = ctx.text || null;

        if (!input)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                `${tools.msg.generateCmdExample(ctx.used, "autolevelup")}\n` +
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

                    if (!input) return await ctx.reply(`ⓘ ${formatter.italic("Mohon masukkan username yang ingin digunakan.")}`);
                    if (/[^a-zA-Z0-9._-]/.test(input)) return await ctx.reply(`ⓘ ${formatter.italic("Username hanya boleh berisi huruf, angka, titik (.), underscore (_) atau tanda hubung (-).")}`);

                    const usernameTaken = ctx.db.users.getMany(user => user.username === input).length > 0;
                    if (usernameTaken) return await ctx.reply(`ⓘ ${formatter.italic("Username tersebut sudah digunakan oleh pengguna lain.")}`);

                    const username = `@${input}`;
                    senderDb.username = username;
                    senderDb.save();

                    await ctx.reply(`ⓘ ${formatter.italic(`Username berhasil diubah menjadi ${formatter.inlineCode(username)}!`)}`);
                    break;
                }
                case "autolevelup": {
                    const currentStatus = senderDb?.autolevelup || false;
                    const newStatus = !currentStatus;
                    senderDb.autolevelup = newStatus;
                    senderDb.save();

                    const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
                    await ctx.reply(`ⓘ ${formatter.italic(`Autolevelup berhasil ${statusText}!`)}`);
                    break;
                }
                default:
                    await ctx.reply(`ⓘ ${formatter.italic(`Setelan ${formatter.inlineCode(input)} tidak valid.`)}`);
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};