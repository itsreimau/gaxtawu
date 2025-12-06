// Impor modul dan dependensi yang diperlukan
const util = require("node:util");

// Daftar API gratis
const APIs = {
    bagus: {
        baseURL: "https://api.baguss.xyz"
    },
    deline: {
        baseURL: "https://api.deline.web.id"
    },
    gemini_antidonasi: {
        baseURL: "https://gemini.antidonasi.web.id"
    },
    nekolabs: {
        baseURL: "https://api.nekolabs.web.id"
    },
    yp: {
        baseURL: "https://api.yupra.my.id"
    },
    zell: {
        baseURL: "https://zellapi.autos"
    },
    znx: {
        baseURL: "https://api.zenitsu.web.id"
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