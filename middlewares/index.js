const check = require("./check");
const permissions = require("./permissions");
const restrictions = require("./restrictions");
const track = require("./track");

module.exports = (bot) => {
    check(bot);
    permissions(bot);
    restrictions(bot);
    track(bot);
};