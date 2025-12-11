const { spawn } = require("node:child_process");

module.exports = {
    name: "node",
    aliases: ["eval", "javascript", "js"],
    category: "tool",
    permissions: {
        coin: 5
    },
    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.text || null;

        if (!input) return await ctx.reply(
            `${tools.msg.generateInstruction(["send"], ["text"])}\n` +
            tools.msg.generateCmdExample(ctx.used, 'console.log("halo, dunia!");')
        );

        try {
            const restricted = ["eval", "global", "import", "require"];
            for (const restrict of restricted) {
                if (input.includes(restrict)) return await ctx.reply(`ⓘ ${formatter.italic(`Penggunaan ${restrict} tidak diperbolehkan dalam kode!`)}`);
            }

            const output = await new Promise(resolve => {
                const childProcess = spawn("node", ["-e", input]);

                let outputData = "";
                let errorData = "";

                childProcess.stdout.on("data", (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve("ⓘ Kode mencapai batas penggunaan memori!");
                        childProcess.kill();
                    }
                    outputData += chunk.toString();
                });

                childProcess.stderr.on("data", (chunk) => {
                    errorData += chunk.toString();
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        resolve(
                            `ⓘ Keluar dari proses dengan kode: ${code}\n` +
                            formatter.monospace(errorData)
                        );
                    } else {
                        resolve(formatter.monospace(outputData));
                    }
                });

                setTimeout(() => {
                    resolve("ⓘ Kode mencapai batas waktu output!");
                    childProcess.kill();
                }, 10000);
            });

            await ctx.reply(output);
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};