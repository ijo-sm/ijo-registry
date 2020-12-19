const http = require("http");

class ApiServer {
    initialize() {
        this.server = http.createServer((req, res) => this.handle(req, res));
    }

    handle(req, res) {

    }

    start({port}) {
        return new Promise(resolve => {
            this.server.listen({port}, () => resolve());
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close(err => {
                if(err) reject(err);
                else resolve();
            });
        })
    }
}

module.exports = ApiServer;