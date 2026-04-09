module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners);

    require("./ready")(bot);
    require("./messages")(bot);
    require("./welcome")(bot);
    require("./call")(bot);
};

