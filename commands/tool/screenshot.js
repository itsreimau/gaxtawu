const axios = require("axios");

module.exports = {
    name: "screenshot",
    aliases: ["ss", "sshp", "sspc", "ssweb"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const url = ctx.args[0];

        if (!url)
            return await ctx.reply(
                `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
                tools.msg.generateCmdExample(ctx.used, "https://itsreimau.is-a.dev")
            );

        const isUrl = tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(`ⓘ ${formatter.italic(config.msg.urlInvalid)}`);

        try {
            const apiUrl = tools.api.createUrl("azbry", "/api/tools/ssweb", {
                url,
                type: ctx.used.command == "sshp" ? "mobile" : "desktop"
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};