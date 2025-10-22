module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            `${tools.msg.generateCmdExample(ctx.used, "autolevelup")}\n` +
            tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`])
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setprofile");
            return await ctx.reply(listText);
        }

        try {
            const userDb = ctx.db.user;
            const args = ctx.args;
            const command = args[0]?.toLowerCase();

            switch (command) {
                case "username": {
                    const input = args.slice(1).join(" ").trim();

                    if (!input) return await ctx.reply(`ⓘ ${formatter.italic("Mohon masukkan username yang ingin digunakan.")}`);
                    if (/[^a-zA-Z0-9._-]/.test(input)) return await ctx.reply(`ⓘ ${formatter.italic("Username hanya boleh berisi huruf, angka, titik (.), underscore (_) atau tanda hubung (-).")}`);

                    const usernameTaken = ctx.db.users.getMany(user => user.username === input).length > 0;
                    if (usernameTaken) return await ctx.reply(`ⓘ ${formatter.italic("Username tersebut sudah digunakan oleh pengguna lain.")}`);

                    const username = `@${input}`
                    userDb.username = username;
                    userDb.save();

                    await ctx.reply(`ⓘ ${formatter.italic(`Username berhasil diubah menjadi ${formatter.inlineCode(username)}!`)}`);
                    break;
                }
                case "autolevelup": {
                    const currentStatus = userDb?.autolevelup || false;
                    const newStatus = !currentStatus;
                    userDb.autolevelup = newStatus;
                    userDb.save();

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