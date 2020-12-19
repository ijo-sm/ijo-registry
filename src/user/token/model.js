class UserTokenModel {
    constructor({key, owner, createdOn} = {}) {
        this.key = key;
        this.owner = owner;
        this.createdOn = createdOn;
    }

    toObject() {
        return {
            key: this.key,
            owner: this.owner,
            createdOn: this.createdOn
        };
    }
}

module.exports = UserTokenModel;