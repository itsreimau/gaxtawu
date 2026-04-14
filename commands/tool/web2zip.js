const axios = require("axios");

module.exports = {
    name: "web2zip",
    aliases: ["webtozip"],
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
            const apiUrl = tools.api.createUrl("zenzxz", "/tools/saveweb2zip", {
                url
            });
            const result = (await axios.get(apiUrl)).data.result;

            await ctx.reply({
                document: {
                    url: result.download_url
                },
                fileName: "web2zip.zip",
                mimetype: tools.mime.lookup("zip"),
                caption: `➛ ${formatter.bold("URL")}: ${url}`
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};