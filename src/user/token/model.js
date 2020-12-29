class UserTokenModel {
    constructor({key, owner, createdAt, expiresIn} = {}) {
        this.key = key;
        this.owner = owner;
        this.createdAt = createdAt;
        this.expiresIn = expiresIn;
    }

    hasExpired() {
        return token.createdAt + token.expiresIn <= new Date().getTime();
    }

    toObject() {
        return {
            key: this.key,
            owner: this.owner,
            createdAt: this.createdAt,
            expiresIn: this.expiresIn
        };
    }
}

module.exports = UserTokenModel;