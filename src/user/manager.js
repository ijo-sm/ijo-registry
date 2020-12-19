const {nanoid} = require("nanoid");
const UserApi = require("./api");
const UserModel = require("./model");
const UserTokens = require("./token/manager");

class Users {
    constructor() {
        this.tokens = new UserTokens();
    }

    initialize({apiServer, databaseHandler} = {}) {
        this.api = new UserApi(this, apiServer);
        this.tokens.initialize({databaseHandler});
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
}

module.exports = Users;