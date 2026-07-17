module.exports = {
    name: "owner",
    aliases: ["creator", "developer"],
    category: "information",
    code: async (ctx) => {
        try {
            const contacts = [{
                displayName: config.owner.name,
                number: config.owner.id
            }];

            if (config.owner.co?.length) {
                const coOwners = config.owner.co.filter(co => !co.invisible).map(co => ({
                    displayName: co.name,
                    number: co.id
                }));
                contacts.push(...coOwners);
            }

            await ctx.reply({
                contacts: {
                    displayName: "Owner Bot",
                    contacts: contacts
                }
            });
        } catch (error) {
            await tools.helper.handleError(ctx, error);
        }
    }
};