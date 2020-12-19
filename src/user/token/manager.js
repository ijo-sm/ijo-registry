const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");
const UserTokenModel = require("./model");

class UserTokens {
    initialize({databaseHandler} = {}, {secret, defaultExpiresIn} = {}) {
        databaseHandler.registerCollection("userTokens", UserTokenModel);
        this.secret = secret;
        this.defaultExpiresIn = defaultExpiresIn;
    }

    load({databaseHandler} = {}) {
        this.collection = databaseHandler.collection("userTokens");
    }

    create(user, {expiresIn = this.defaultExpiresIn} = {}) {
        const key = nanoid(32);
        const createdAt = new Date().getTime();
        
        return new UserTokenModel({key, owner: user.id, createdAt, expiresIn});
    }

    build(token) {
        if(token.hasExpired()) return;

        return new Promise((resolve, reject) => {
            jwt.sign({
                key: token.key
            }, this.secret, {
                expiresIn: (token.createdAt + token.expiresIn) - new Date().getTime()
            }, (err, token) => {
                if(err) reject(err);
                else resolve(token);
            });
        });
    }

    add(token) {
        return this.collection.addOne(token);
    }

    get(key) {
        return this.collection.findOne({key});
    }

    remove(key) {
        return this.collection.removeOne({key});
    }

    async removeExpired(key) {
        const token = await this.get(key);

        if(!token.hasExpired()) return;

        await this.remove(key);
    }

    verifyAndGetToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if(err) {
                    if(err.name === "TokenExpiredError") {
                        if(decoded && decoded.key) this.removeExpired(decoded.key);
                        reject("token-expired");
                    }
                    else if(err.name === "JsonWebTokenError") reject("incorrect-token");
                    else reject(err);
                }
                else if(!decoded.key) reject("incorrect-token");
                else {
                    this.get({key: decoded.key})
                    .then(token => resolve(token))
                    .catch(err => reject(err));
                }
            });
        });
    }
}

module.exports = UserTokens;