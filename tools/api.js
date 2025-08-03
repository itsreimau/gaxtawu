// Impor modul dan dependensi yang diperlukan
const util = require("node:util");

// Daftar API gratis
const APIs = {
    archive: {
        baseURL: "https://archive.lick.eu.org"
    },
    davidcyril: {
        baseURL: "https://apis.davidcyriltech.my.id"
    },
    diibot: {
        baseURL: "https://api.diioffc.web.id"
    },
    hang: {
        baseURL: "https://api.hanggts.xyz"
    },
    nekorinn: {
        baseURL: "https://api.nekorinn.my.id"
    },
    nirkyy: {
        baseURL: "https://nirkyy-dev.hf.space"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    zell: {
        baseURL: "https://zellapi.autos"
    },
    zenzxz: {
        baseURL: "https://zenzxz.dpdns.org"
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