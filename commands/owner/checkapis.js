const axios = require("axios");

module.exports = {
    name: "checkapis",
    aliases: ["cekapi", "checkapi"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        try {
            const APIs = tools.api.listUrl();
            let resultText = "";

            for (const [name, api] of Object.entries(APIs)) {
                try {
                    const response = await axios.get(api.baseURL, {
                        timeout: 5000,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                        }
                    });

                    if (response.status >= 200 && response.status < 500) {
                        resultText += `➛ ${api.baseURL} >ᴗ< (${response.status})\n`;
                    } else {
                        resultText += `➛ ${api.baseURL} •︵• (${response.status})\n`;
                    }
                } catch (error) {
                    if (error.response) {
                        resultText += `➛ ${api.baseURL} •︵• (${error.response.status})\n`;
                    } else if (error.request) {
                        resultText += `➛ ${api.baseURL} •︵• (Tidak ada respon)\n`;
                    } else {
                        resultText += `➛ ${api.baseURL} •︵• (Kesalahan: ${error.message})\n`;
                    }
                }
            }

            await ctx.reply(resultText.trim());
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};