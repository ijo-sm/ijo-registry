const {nanoid} = require("nanoid");
const UserApi = require("./api");
const UserModel = require("./model");
const UserTokens = require("./token/manager");

class Users {
    constructor() {
        this.tokens = new UserTokens();
    }

    initialize({apiServer, databaseHandler} = {}, {secret, defaultExpiresIn} = {}) {
        this.api = new UserApi(this, apiServer);
        this.tokens.initialize({databaseHandler}, {secret, defaultExpiresIn});
        databaseHandler.registerCollection("users", UserModel);
    }

    load({databaseHandler} = {}) {
        this.collection = databaseHandler.collection("users");
        this.tokens.load({databaseHandler});
    }

    create({username, password, email} = {}) {
        const id = nanoid(16);
        const user = new UserModel({id, username, email});
        user.setPassword(password);

        return user;
    }

    add(user) {
        return this.collection.insertOne(user);
    }

    get(query) {
        return this.collection.findOne(query);
    }

    async isUsernameInUse(username) {
        return await this.get({username}) !== undefined;
    }

    async isEmailInUse(email) {
        return await this.get({email}) !== undefined;
    }

    async remove(user) {
        await this.tokens.removeByUser(user);
        await this.collection.removeOne({id: user.id});
    }

    verifyTokenAndGetUser(req, res) {
        const token = req.getBearerToken();

        if(token === undefined) {
            res.sendError({message: "The user token is missing.", code: 400});
            return;
        }

        return new Promise(resolve => {
            this.auth.verifyAndGetToken(token)
            .catch(err => {
                if(err === "token-expired") {
                    res.sendError({message: "The user token has expired.", code: 400});
                }
                else if(err === "incorrect-token") {
                    res.sendError({message: "The user token was incorrect.", code: 400});
                }
                else {
                    res.sendError({message: "An unexpected error occurred while verifying the user token", code: 500});
                }

                resolve();
            })
            .then(token => {
                this.get({id: token.owner})
                .then(user => resolve(user))
                .catch(() => {
                    res.sendError({message: "An unexpected error occurred while verifying the user token", code: 500});
                    resolve();
                });
            });
        });
    }
}

module.exports = Users;