const {MongoClient} = require("mongodb");
const Collection = require("./collection");

class DatabaseHandler {
    constructor() {
        this.collections = [];
    }
    
    async connect({url, name} = {}) {
        this.client = await MongoClient.connect(url, {
            useUnifiedTopology: true
        });
        this.database = this.client.db(name);
    }

    registerCollection(name, model) {
        this.collections.push({name, model});
    }

    unregisterCollection(name) {
        this.collections = this.collections.filter(collection => collection.name !== name);
    }

    collection(name) {
        const collection = this.collections.find(collection => collection.name === name);

        if(collection === undefined) throw Error(`Collection ${name} not found.`);
        if(collection.value) return collection.value;

        return collection.value = new Collection(this.database.collection(name), collection.model);
    }

    close() {
        return this.client.close();
    }
}

module.exports = DatabaseHandler;