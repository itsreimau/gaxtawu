module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "autolevelup"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("setprofile");
            return await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const senderId = ctx.getId(ctx.sender.jid);
            const args = ctx.args;
            const command = args[0]?.toLowerCase();

            switch (command) {
                case "username": {
                    const input = args.slice(1).join(" ").trim();

                    if (!input) return await ctx.reply(formatter.quote("❎ Mohon masukkan username yang ingin digunakan."));
                    if (/[^a-zA-Z0-9._-]/.test(input)) return await ctx.reply(formatter.quote("❎ Username hanya boleh berisi huruf, angka, titik (.), underscore (_) atau tanda hubung (-)."));

                    const usernameTaken = Object.values(await db.get("user") || {}).some(user => user.username === input);
                    if (usernameTaken) return await ctx.reply(formatter.quote("❎ Username tersebut sudah digunakan oleh pengguna lain."));

                    const username = `@${input}`
                    await db.set(`user.${senderId}.username`, username);
                    await ctx.reply(formatter.quote(`✅ Username berhasil diubah menjadi ${formatter.inlineCode(username)}!`));
                    break;
                }
                case "autolevelup": {
                    const setKey = `user.${senderId}.autolevelup`;
                    const currentStatus = await db.get(setKey) || false;
                    const newStatus = !currentStatus;
                    await db.set(setKey, newStatus);

                    const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
                    await ctx.reply(formatter.quote(`✅ Autolevelup berhasil ${statusText}!`));
                    break;
                }
                default:
                    await ctx.reply(formatter.quote(`❎ Setelan ${formatter.inlineCode(input)} tidak valid.`));
            }
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};