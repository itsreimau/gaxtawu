const {
    VCardBuilder
} = require("@itsreimau/gktw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    code: async (ctx) => {
        try {
            const vcard = new VCardBuilder()
                .setFullName(config.owner.name)
                .setOrg(config.owner.organization)
                .setNumber(config.owner.id)
                .build();

            await ctx.reply({
                contacts: {
                    displayName: config.owner.name,
                    contacts: [{
                        vcard
                    }]
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};