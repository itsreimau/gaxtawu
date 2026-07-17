const events = ["ClientReady", "MessagesUpsert", "GroupJoin", "UserJoin", "UserLeave", "Call"];

module.exports = Object.fromEntries(events.map(event => [event, event]));