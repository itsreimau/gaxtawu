const { Events } = require("@itsreimau/gktw");
const moment = require("moment-timezone");

async function handleWelcome(bot, welcome, type, isSimulate = false) {
    const groupJid = welcome.id;
    const groupDb = bot.getDb("groups", groupJid);
    const botDb = bot.getDb("bot");
    const participantJid = welcome.participant;

    if (!isSimulate && groupDb?.mutebot) return;
    if (!isSimulate && !groupDb?.option?.welcome) return;
    if (!isSimulate && !["group", "public"].includes(botDb?.mode || "public")) return;

    const now = moment().tz(config.system.timeZone);
    const hour = now.hour();
    if (!isSimulate && config.system.unavailableAtNight && hour >= 0 && hour < 6) return;

    const isWelcome = type === Events.UserJoin;
    const tag = `@${bot.getId(participantJid)}`;
    const customText = isWelcome ? groupDb?.text?.welcome : groupDb?.text?.goodbye;
    const metadata = await bot.core.groupMetadata(groupJid);
    const text = customText ? customText.replace(/%tag%/g, tag).replace(/%subject%/g, metadata.subject).replace(/%description%/g, metadata.description) : (isWelcome ? `>ᴗ< ${formatter.italic(`Selamat datang ${tag} di grup ${metadata.subject}!`)}` : `•︵• ${formatter.italic(`Selamat tinggal, ${tag}!`)}`);
    const profilePictureUrl = await bot.core.profilePictureUrl(participantJid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
    const canvasUrl = tools.api.createUrl("siputzx", `/api/canvas/${isWelcome ? "welcomev5" : "goodbyev5"}`, {
        username: bot.getPushName(participantJid),
        guildName: metadata.subject,
        memberCount: metadata.participants.length,
        avatar: profilePictureUrl,
        background: "https://picsum.photos/1024/450"
    });

    await bot.sendMessage(groupJid, {
        image: {
            url: canvasUrl
        },
        mimetype: tools.mime.lookup("png"),
        caption: text,
        mentions: [participantJid]
    });

    if (isWelcome && groupDb?.text?.intro)
        await bot.sendMessage(groupJid, {
            text: groupDb.text.intro,
            mentions: [participantJid],
            interactiveButtons: [{
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "Salin Teks",
                    copy_code: groupDb.text.intro
                })
            }]
        });
}

module.exports = (bot) => {
    bot.ev.on(Events.UserJoin, async (welcome) => handleWelcome(bot, welcome, Events.UserJoin));
    bot.ev.on(Events.UserLeave, async (welcome) => handleWelcome(bot, welcome, Events.UserLeave));
};

module.exports.handleWelcome = handleWelcome;
