import { LoadQueueRepository } from '@/data/protocols/db/queue/load-queue-repository';
import { SaveQueueRepository } from '@/data/protocols/db/queue/save-queue-repository';
import { QueueModel } from '@/domain/models/queue';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class QueueMongoRepository implements SaveQueueRepository, LoadQueueRepository {
  async save(songs: SaveQueueParams): Promise<void> {
    const queueCollection = await MongoHelper.getCollection('queue');
    if (songs.length) {
      await queueCollection.deleteMany({});
      await queueCollection.insertMany(songs);
    }
  }

  async load(): Promise<QueueModel> {
    const queueCollection = await MongoHelper.getCollection('queue');
    const result = await queueCollection.find().toArray();
    return MongoHelper.formatArray(result);
  }
}
