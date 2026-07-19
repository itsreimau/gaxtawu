const check = require("./check");
const permissions = require("./permissions");
const restrictions = require("./restrictions");
const track = require("./track");

module.exports = (bot) => {
    Check(bot);
    Permissions(bot);
    Restrictions(bot);
    Track(bot);
};