const path = require("path");
const {ConfigFile} = require("ijo-utils");
const ApiServer = require("./net/api/server");

class Registry {
    constructor() {
        this.apiServer = new ApiServer();
        this.config = new ConfigFile(path.join(this.root, "./config.json"), {defaults: {
            api: {port: 8082}
        }});
    }

    get root() {
		return path.join(path.dirname(require.main.filename), "../");
	}

    async initialize() {
        await this.config.load();
        this.apiServer.initialize();
    }

    async start() {
        await this.apiServer.start({port: this.config.get("api").root});
    }

    async stop() {
        await this.apiServer.stop();
        await this.config.save();
    }
}

module.exports = Registry;