// Impor modul dan dependensi yang diperlukan
const { Gktw } = require("@itsreimau/gktw");

// Ekspor modul atau fungsi yang diperlukan
const tools = {
    api: require("./api.js"),
    cmd: require("./cmd.js"),
    list: require("./list.js"),
    mime: Gktw.mime,
    msg: require("./msg.js")
};

module.exports = tools;