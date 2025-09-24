// Impor modul dan dependensi yang diperlukan
const { Helper } = require("@itsreimau/gktw");
const mime = require("mime-types");

// Ekspor modul atau fungsi yang diperlukan
const tools = {
    api: require("./api.js"),
    cmd: {
        ...require("./cmd.js"),
        uploadFile: Helper.tmpfiles
    },
    list: require("./list.js"),
    mime,
    msg: require("./msg.js")
};

module.exports = tools;