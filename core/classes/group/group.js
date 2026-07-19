class Group {
    constructor(ctx) {
        this.ctx = ctx;
    }

    async create(subject, members) {
        return await this.ctx._client.groupCreate(subject, members);
    }

    async inviteCodeInfo(code) {
        return await this.ctx._client.groupGetInviteInfo(code);
    }

    async acceptInvite(code) {
        return await this.ctx._client.groupAcceptInvite(code);
    }

    async acceptInviteV4(key, inviteMessage) {
        return await this.ctx._client.groupAcceptInviteV4(key, inviteMessage);
    }
}

module.exports = Group;