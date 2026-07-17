const APIs = {
    alwayscodex: {
        baseURL: "https://api.alwayscodex.my.id"
    },
    delirius: {
        baseURL: "https://api.delirius.store"
    },
    faaa: {
        baseURL: "https://api-faa.my.id"
    },
    lexcode: {
        baseURL: "https://api.lexcode.biz.id"
    },
    nexray: {
        baseURL: "https://api.nexray.eu.cc"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
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
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};