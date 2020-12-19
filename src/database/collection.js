class Collection {
    constructor(collection, model) {
        this.collection = collection;
        this.model = model;
    }

    insertOne(item) {
        return this.collection.insertOne(item.toObject());
    }

    async findOne(query) {
        const item = await this.collection.findOne(query);

        if(item === undefined) return;

        return new (this.model)(item);
    }

    removeOne(query) {
        return this.collection.deleteOne(query);
    }

    remove(query) {
        return this.collection.deleteMany(query);
    }
}

module.exports = Collection;