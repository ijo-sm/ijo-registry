const {CryptoUtils} = require("ijo-utils");

class UserModel {
    constructor({id, username, password, email} = {}) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    setPassword(plain) {
        this.password = CryptoUtils.hash(plain);
    }

    isEqualPassword(plain) {
        const hashedPassword = CryptoUtils.hash(plain);

        return this.password === hashedPassword;
    }

    toObject() {
        return {
            id: this.id,
            username: this.username,
            password: this.password,
            email: this.email
        };
    }
}

module.exports = UserModel;