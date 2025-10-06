const { VCardBuilder } = require("@itsreimau/gktw");

module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    code: async (ctx) => {
        try {
            const owner = new VCardBuilder()
                .setFullName(config.owner.name)
                .setOrg(config.owner.organization)
                .setNumber(config.owner.id)
                .build();

            const coOwners = config.owner.co.map(co => {
                return {
                    displayName: co.name,
                    vcard: new VCardBuilder()
                        .setFullName(co.name)
                        .setOrg(co.organization || config.owner.organization)
                        .setNumber(co.id)
                        .build()
                };
            });

            await ctx.reply({
                contacts: {
                    displayName: "Owner Bot",
                    contacts: [{
                        displayName: config.owner.name,
                        vcard: owner
                    }, ...coOwners]
                }
            });
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};