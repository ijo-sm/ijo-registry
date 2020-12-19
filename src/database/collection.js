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

        return new (this.model)(item);
    }

    removeOne(query) {
        return this.collection.deleteOne(query);
    }
}

module.exports = Collection;