// Impor modul dan dependensi yang diperlukan
const util = require("node:util");

// Daftar API gratis
const APIs = {
    chocomilk: {
        baseURL: "https://chocomilk.amira.us.kg"
    },
    cuki: {
        baseURL: "https://api.cuki.biz.id",
        APIKey: "cuki-x"
    },
    faaa: {
        baseURL: "https://api-faa.my.id"
    },
    kuroneko: {
        baseURL: "https://api.danzy.web.id"
    },
    lexcode: {
        baseURL: "https://api.lexcode.biz.id"
    },
    nekolabs: {
        baseURL: "https://rynekoo-api.hf.space"
    },
    neo: {
        baseURL: "https://www.neoapis.xyz"
    },
    nexray: {
        baseURL: "https://api.nexray.web.id"
    },
    omegatech: {
        baseURL: "https://omegatech-api.dixonomega.tech"
    },
    sanka: {
        baseURL: "https://www.sankavolereii.my.id",
        APIKey: "planaai"
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
    zenzxz: {
        baseURL: "https://api.zenzxz.my.id"
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