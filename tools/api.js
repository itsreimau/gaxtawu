// Impor modul dan dependensi yang diperlukan
const util = require("node:util");

// Daftar API gratis
const APIs = {
    davidcyril: {
        baseURL: "https://apis.davidcyriltech.my.id"
    },
    diibot: {
        baseURL: "https://api.diioffc.web.id"
    },
    hang: {
        baseURL: "https://api.hanggts.xyz"
    },
    izumi: {
        baseURL: "https://izumiiiiiiii.dpdns.org"
    },
    neko: {
        baseURL: "https://api.nekoo.qzz.io"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    zell: {
        baseURL: "https://zellapi.autos"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    try {
        const api = APIs[apiNameOrURL];
        if (!api) {
            const url = new URL(apiNameOrURL);
            apiNameOrURL = url;
        }

        const queryParams = new URLSearchParams(params);
        if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

        const baseURL = api ? api.baseURL : apiNameOrURL.origin;
        const apiUrl = new URL(endpoint, baseURL);
        apiUrl.search = queryParams.toString();

        return apiUrl.toString();
    } catch (error) {
        consolefy.error(`Error: ${util.format(error)}`);
        return null;
    }
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};