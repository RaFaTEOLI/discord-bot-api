import { SaveQueueRepository } from '@/data/protocols/db/queue/save-queue-repository';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class QueueMongoRepository implements SaveQueueRepository {
  async save(songs: SaveQueueParams): Promise<void> {
    const queueCollection = await MongoHelper.getCollection('queue');
    if (songs.length) {
      await queueCollection.deleteMany({});
      await queueCollection.insertMany(songs);
    }
  }
}
