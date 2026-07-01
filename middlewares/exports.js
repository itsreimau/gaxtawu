module.exports = (bot) => {
    require("./check.js")(bot);
    require("./permissions.js")(bot);
    require("./restrictions.js")(bot);
    require("./xp.js")(bot);
};