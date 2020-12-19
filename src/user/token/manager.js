const UserTokenModel = require("./model");

class UserTokens {
    initialize({databaseHandler} = {}) {
        databaseHandler.registerCollection("userTokens", UserTokenModel);
    }

    load({databaseHandler} = {}) {
        this.collection = databaseHandler.collection("userTokens");
    }

    create(userid) {

    }

    add(token) {

    }

    verify() {

    }
}

module.exports = UserTokens;