const axios = require("axios");

module.exports = {
    name: "jadian",
    aliases: ["jodoh"],
    category: "entertainment",
    permissions: {
        group: true
    },
    code: async (ctx) => {
        try {
            const members = await ctx.group().members();
            const memberIDs = members.map(m => m.id);

            let selected = [];
            selected[0] = tools.cmd.getRandomElement(memberIDs);
            do {
                selected[1] = tools.cmd.getRandomElement(memberIDs);
            } while (selected[1] === selected[0]);

            const word = tools.cmd.getRandomElement((await axios.get(tools.api.createUrl("https://raw.githubusercontent.com", "/BochilTeam/database/master/kata-kata/bucin.json"))).data);

            return await ctx.reply({
                text: `${formatter.quote(`@${ctx.getId(selected[0])} ❤️ @${ctx.getId(selected[1])}`)}\n` +
                    formatter.quote(word) || config.msg.notFound,
                mentions: selected,
                footer: config.msg.footer,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    }
                }]
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};