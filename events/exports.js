const call = require("./call.js");
const join = require("./join.js");
const messages = require("./messages.js");
const ready = require("./ready.js");
const welcome = require("./welcome.js");

module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners);

    call(bot);
    join(bot);
    messages(bot);
    ready(bot);
    welcome(bot);
};