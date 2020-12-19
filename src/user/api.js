const {ApiModel} = require("ijo-utils");

class UserApi extends ApiModel {
    constructor(users, apiServer) {
        super(apiServer);

        apiServer.register("/user/create", "POST", (...args) => this.create(users, ...args));
        apiServer.register("/user/:userid/delete", "POST", (...args) => this.delete(users, ...args));
        apiServer.register("/user/:userid/token/create", "POST", (...args) => this.createToken(users, ...args));
        apiServer.register("/user/:userid/token/delete", "POST", (...args) => this.deleteToken(users, ...args));
    }

    async create(users, req, res) {
        const data = await req.bodyAsJSON();

        if (!await req.isValidKey(res, "username", "string") ||
            !await req.isValidKey(res, "password", "string") ||
            !await req.isValidKey(res, "email", "string")) return;
        else if(await users.isUsernameInUse(data.username)) {
            return res.sendError({message: "That username is already in use."});
        }
        else if(await users.isEmailInUse(data.email)) {
            return res.sendError({message: "That email adres is already in use."});
        }

        const user = users.create({
            username: data.username, 
            password: data.password, 
            email: data.email
        });

        await users.add(user);

        res.send({data: {message: "Created"}, code: 201});
    }

    async delete(users, req, res) {
        const user = await users.verifyTokenAndGetUser(req, res);

        if(user === undefined) return;

        await users.remove(user);
        
        res.send({data: {message: "Deleted"}, code: 200});
    }

    async createToken(users, req, res) {
        const data = await req.bodyAsJSON();

        if (!await req.isValidKey(res, "username", "string") ||
            !await req.isValidKey(res, "password", "string")) return;

        const user = users.get({username: data.username});

        if(user === undefined || !user.isEqualPassword(data.password)) {
            return res.sendError({message: "The username and/or password is incorrect.", code: 400});
        }

        const token = await users.tokens.create(user, {expiresIn: data.expiresIn});
        await users.tokens.add(token);
        const jwt = await users.tokens.build(token);

        res.send({data: {token: jwt}, code: 200})
    }

    async deleteToken(users, req, res) {
        
    }
}

module.exports = UserApi;