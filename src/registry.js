const path = require("path");
const {nanoid} = require("nanoid");
const {ConfigFile, ApiServer} = require("ijo-utils");
const DatabaseHandler = require("./database/handler");
const Users = require("./user/manager");

class Registry {
    constructor() {
        this.apiServer = new ApiServer();
        this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
            api: {port: 8082, secret: nanoid(32), defaultExpiresIn: 1000*3600*24*7*5},
            database: {url: "mongodb://localhost:27017", name: "ijo-registry"}
        }});
        this.databaseHandler = new DatabaseHandler();
        this.users = new Users();
    }

    get root() {
		return path.join(path.dirname(require.main.filename), "../");
	}

    async initialize() {
        await this.config.load();
        this.apiServer.initialize();
        this.users.initialize({
            apiServer: this.apiServer, 
            databaseHandler: this.databaseHandler
        }, {
            secret: this.config.get("api").secret,
            defaultExpiresIn: this.config.get("api").defaultExpiresIn
        });
    }

    async start() {
        await this.databaseHandler.connect({url: this.config.get("database").url, name: this.config.get("database").name});
        this.users.load({databaseHandler: this.databaseHandler});
        await this.apiServer.start({port: this.config.get("api").root});
    }

    async stop() {
        await this.apiServer.close();
        await this.databaseHandler.close();
        await this.config.save();
    }
}

module.exports = Registry;