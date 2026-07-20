module.exports = {
    name: "autodownload",
    aliases: ["autodl"],
    category: "profile",
    code: async (ctx) => {
        const senderDb = ctx.db.user;

        const currentStatus = senderDb?.autodownload || false;
        const newStatus = !currentStatus;

        senderDb.autodownload = newStatus;
        senderDb.save();

        const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
        await ctx.reply(ctx.format.info(`Auto download berhasil ${statusText}!`));
    }
};