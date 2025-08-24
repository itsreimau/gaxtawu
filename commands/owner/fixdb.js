module.exports = {
    name: "fixdb",
    aliases: ["fixdatabase"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args[0] || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "user"))
        );

        if (input.toLowerCase() === "list") {
            const listText = await tools.list.get("fixdb");
            await ctx.reply({
                text: listText,
                footer: config.msg.footer
            });
        }

        try {
            const waitMsg = await ctx.reply(config.msg.wait);
            const data = {
                user: await db.get("user") || {},
                group: await db.get("group") || {},
                menfess: await db.get("menfess") || {}
            };

            const mappings = {
                user: {
                    afk: {
                        reason: {
                            type: "string",
                            default: ""
                        },
                        timestamp: {
                            type: "number",
                            default: 0
                        }
                    },
                    autolevelup: {
                        type: "boolean",
                        default: false
                    },
                    banned: {
                        type: "boolean",
                        default: false
                    },
                    coin: {
                        type: "number",
                        default: 0,
                        min: 0
                    },
                    lastClaim: {
                        daily: {
                            type: "number",
                            default: 0
                        },
                        weekly: {
                            type: "number",
                            default: 0
                        },
                        monthly: {
                            type: "number",
                            default: 0
                        },
                        yearly: {
                            type: "number",
                            default: 0
                        }
                    },
                    lastSentMsg: {
                        banned: {
                            type: "number",
                            default: 0
                        },
                        cooldown: {
                            type: "number",
                            default: 0
                        },
                        gamerestrict: {
                            type: "number",
                            default: 0
                        },
                        privatePremiumOnly: {
                            type: "number",
                            default: 0
                        },
                        requireBotGroupMembership: {
                            type: "number",
                            default: 0
                        },
                        requireGroupSewa: {
                            type: "number",
                            default: 0
                        },
                        unavailableAtNight: {
                            type: "number",
                            default: 0
                        },
                        admin: {
                            type: "number",
                            default: 0
                        },
                        botAdmin: {
                            type: "number",
                            default: 0
                        },
                        coin: {
                            type: "number",
                            default: 0
                        },
                        group: {
                            type: "number",
                            default: 0
                        },
                        owner: {
                            type: "number",
                            default: 0
                        },
                        premium: {
                            type: "number",
                            default: 0
                        },
                        private: {
                            type: "number",
                            default: 0
                        },
                        restrict: {
                            type: "number",
                            default: 0
                        }
                    },
                    level: {
                        type: "number",
                        default: 0,
                        min: 0
                    },
                    premium: {
                        type: "boolean",
                        default: false
                    },
                    premiumExpiration: {
                        type: "number",
                        default: 0
                    },
                    uid: {
                        type: "string",
                        default: ""
                    },
                    username: {
                        type: "string",
                        default: ""
                    },
                    winGame: {
                        type: "number",
                        default: 0,
                        min: 0
                    },
                    xp: {
                        type: "number",
                        default: 0,
                        min: 0
                    }
                },
                group: {
                    maxwarnings: {
                        type: "number",
                        default: 3,
                        min: 1
                    },
                    mute: {
                        type: "array",
                        default: []
                    },
                    mutebot: {
                        type: "boolean",
                        default: false
                    },
                    text: {
                        goodbye: {
                            type: "string",
                            default: ""
                        },
                        intro: {
                            type: "string",
                            default: ""
                        },
                        welcome: {
                            type: "string",
                            default: ""
                        }
                    },
                    option: {
                        antiaudio: {
                            type: "boolean",
                            default: false
                        },
                        antidocument: {
                            type: "boolean",
                            default: false
                        },
                        antigif: {
                            type: "boolean",
                            default: false
                        },
                        antiimage: {
                            type: "boolean",
                            default: false
                        },
                        antilink: {
                            type: "boolean",
                            default: false
                        },
                        antinfsw: {
                            type: "boolean",
                            default: false
                        },
                        antisticker: {
                            type: "boolean",
                            default: false
                        },
                        antitagsw: {
                            type: "boolean",
                            default: false
                        },
                        antitoxic: {
                            type: "boolean",
                            default: false
                        },
                        antivideo: {
                            type: "boolean",
                            default: false
                        },
                        autokick: {
                            type: "boolean",
                            default: false
                        },
                        gamerestrict: {
                            type: "boolean",
                            default: false
                        },
                        welcome: {
                            type: "boolean",
                            default: false
                        }
                    },
                    sewa: {
                        type: "boolean",
                        default: false
                    },
                    sewaExpiration: {
                        type: "number",
                        default: 0
                    },
                    spam: {
                        type: "array",
                        default: []
                    },
                    warnings: {
                        type: "array",
                        default: []
                    }
                },
                menfess: {
                    from: {
                        type: "string",
                        default: ""
                    },
                    to: {
                        type: "string",
                        default: ""
                    }
                }
            };

            const validateAndFixValue = (value, schema) => {
                if (schema.type === "array") return Array.isArray(value) ? value : schema.default;

                if (schema.type === "object") {
                    const result = {};
                    for (const key in schema.properties) {
                        result[key] = validateAndFixValue(value?.[key], schema.properties[key]);
                    }
                    return result;
                }

                if (typeof value !== schema.type) return schema.default;

                if (schema.type === "number") {
                    if (value < schema.min) return schema.default;
                    if (value > schema.max) return schema.default;
                }

                return value;
            };

            const processData = async (category, data) => {
                await ctx.editMessage(waitMsg.key, formatter.quote(`🔄 Memproses data ${category}...`));
                const schema = mappings[category];
                const validIds = [];

                for (const id in data) {
                    if (!/^\d+$/.test(id)) continue;

                    const item = data[id] || {};
                    const fixedItem = {};

                    for (const field in schema) {
                        fixedItem[field] = validateAndFixValue(item[field], schema[field]);
                    }

                    await db.set(`${category}.${id}`, fixedItem);
                    validIds.push(id);
                }

                return validIds.length;
            };

            if (!mappings[input]) return await ctx.editMessage(waitMsg.key, formatter.quote(`❌ Invalid data type: ${input}`));

            const processedCount = await processData(input, data[input]);

            await ctx.editMessage(waitMsg.key, formatter.quote(`✅ Berhasil membersihkan ${processedCount} data untuk ${input}!`));
        } catch (error) {
            await tools.cmd.handleError(ctx, error);
        }
    }
};