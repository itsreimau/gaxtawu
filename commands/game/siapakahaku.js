const axios = require("axios");

const session = new Map();

module.exports = {
	name: "siapakahaku",
	category: "game",
	code: async (ctx) => {
		if (session.has(ctx.id))
			return await ctx.reply(
				`ⓘ ${formatter.italic("Sesi permainan sedang berjalan!")}`
			);

		try {
			const apiUrl = tools.api.createUrl(
				"siputzx",
				"/api/games/siapakahaku"
			);
			const result = (await axios.get(apiUrl)).data.data;

			const game = {
				coin: 5,
				timeout: 60000,
				answer: result.jawaban.toLowerCase(),
			};

			session.set(ctx.id, true);

			await ctx.reply({
				text:
					`— ${result.soal}\n` +
					"\n" +
					`➛ ${formatter.bold("Bonus")}: ${game.coin} Koin\n` +
					`➛ ${formatter.bold("Batas waktu")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
				buttons: [
					{
						buttonId: `hint_${ctx.used.command}`,
						buttonText: {
							displayText: "Petunjuk",
						},
					},
					{
						buttonId: `surrender_${ctx.used.command}`,
						buttonText: {
							displayText: "Menyerah",
						},
					},
				],
			});

			const collector = ctx.MessageCollector({
				time: game.timeout,
			});

			const playAgain = [
				{
					buttonId: ctx.used.prefix + ctx.used.command,
					buttonText: {
						displayText: "Main Lagi",
					},
				},
			];

			collector.on("collect", async (collCtx) => {
				const participantAnswer = collCtx.msg.body?.toLowerCase();
				const participantDb = collCtx.db.user;

				if (participantAnswer === game.answer) {
					session.delete(ctx.id);
					collector.stop();
					participantDb.coin += game.coin;
					participantDb.winGame += 1;
					participantDb.save();
					await collCtx.reply({
						text: `ⓘ ${formatter.italic(`Benar! +${game.coin} Koin`)}`,
						buttons: playAgain,
					});
				} else if (participantAnswer === `hint_${ctx.used.command}`) {
					const clue = game.answer.replace(/[aiueo]/g, "_");
					await collCtx.reply(
						formatter.monospace(clue.toUpperCase())
					);
				} else if (
					participantAnswer === `surrender_${ctx.used.command}`
				) {
					session.delete(ctx.id);
					collector.stop();
					await collCtx.reply({
						text: `ⓘ ${formatter.italic(`Anda menyerah! Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)}`,
						buttons: playAgain,
					});
				} else if (
					tools.cmd.didYouMean(participantAnswer, [game.answer]) ===
					game.answer
				) {
					await collCtx.reply(
						`ⓘ ${formatter.italic("Sedikit lagi!")}`
					);
				}
			});

			collector.on("end", async () => {
				if (session.has(ctx.id)) {
					session.delete(ctx.id);
					await ctx.reply({
						text: `ⓘ ${formatter.italic(`Waktu habis! Jawabannya adalah ${tools.msg.ucwords(game.answer)}.`)}`,
						buttons: playAgain,
					});
				}
			});
		} catch (error) {
			await tools.cmd.handleError(ctx, error, true);
		}
	},
};
