import { Collection, InsertOneResult, MongoClient, Document, WithId } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  },

  async disconnect() {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  map(result: InsertOneResult<Document>, collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, {
      id: result.insertedId.toString()
    });
  },

  format(result: WithId<Document>): any {
    if (result) {
      const { _id, ...document } = result;
      return Object.assign({}, document, {
        id: _id.toString()
      });
    }
    return null;
  },

  formatArray(results: Array<WithId<Document>>): any {
    return results.map(result => MongoHelper.format(result));
  }
};
