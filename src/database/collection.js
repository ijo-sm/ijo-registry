class Collection {
    constructor(collection, model) {
        this.collection = collection;
        this.model = model;
    }

    insertOne(item) {
        return this.collection.insertOne(item.toObject());
    }
}

module.exports = Collection;