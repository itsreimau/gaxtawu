// Impor modul dan dependensi yang diperlukan
const util = require("node:util");

// Daftar API gratis
const APIs = {
    diibot: {
        baseURL: "https://api.diioffc.web.id"
    },
    hang: {
        baseURL: "https://api.hanggts.xyz"
    },
    izumi: {
        baseURL: "https://izumiiiiiiii.dpdns.org"
    },
    kyyokatsu: {
        baseURL: "https://okatsu-rolezapiiz.vercel.app"
    },
    nekolabs: {
        baseURL: "https://api.nekolabs.my.id"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    },
    vreden: {
        baseURL: "https://api.vreden.my.id"
    },
    yp: {
        baseURL: "https://api.yupra.my.id"
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