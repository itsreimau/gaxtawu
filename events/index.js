const call = require("./call");
const join = require("./join");
const messages = require("./messages");
const ready = require("./ready");
const welcome = require("./welcome");

module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners);

    call(bot);
    join(bot);
    messages(bot);
    ready(bot);
    welcome(bot);
};