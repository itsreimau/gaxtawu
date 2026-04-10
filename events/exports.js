module.exports = (bot) => {
    bot.ev.setMaxListeners(config.system.maxListeners); // Tetapkan max listeners untuk events

    require("./ready.js")(bot);
    require("./messages.js")(bot);
    require("./welcome.js")(bot);
    require("./call.js")(bot);
};