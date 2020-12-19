const {ApiModel} = require("ijo-utils");

class UserApi extends ApiModel {
    constructor(users, apiServer) {
        super(apiServer);

        apiServer.register("/user/create", "POST", (...args) => this.create(users, ...args));
    }

    async create(users, req, res) {
        const data = await req.bodyAsJSON();

        if (!await req.isValidKey(res, "username", "string") ||
            !await req.isValidKey(res, "password", "string") ||
            !await req.isValidKey(res, "email", "string")) return;

        const user = users.create({username: data.username, password: data.password, email: data.email});
        await users.add(user);

        res.send({data: {message: "Created"}, code: 201});
    }
}

module.exports = UserApi;