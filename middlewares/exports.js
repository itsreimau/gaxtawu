const check = require("./check.js");
const permissions = require("./permissions.js");
const restrictions = require("./restrictions.js");
const track = require("./track.js");

module.exports = (bot) => {
    check(bot);
    permissions(bot);
    restrictions(bot);
    track(bot);
};