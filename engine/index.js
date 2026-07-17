const client = require("./classes/client");
const commandHandler = require("./classes/command-handler");
const config = require("./classes/config");
const cooldown = require("./classes/cooldown");

module.exports = {
    client,
    commandHandler,
    config,
    cooldown
};