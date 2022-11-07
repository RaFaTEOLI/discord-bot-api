import { SaveQueue } from '@/domain/usecases/queue/save-queue';
import { DbSaveQueue } from '@/data/usecases/queue/save-queue/db-save-queue';
import { QueueMongoRepository } from '@/infra/db/mongodb/queue/queue-mongo-repository';

export const makeDbSaveQueue = (): SaveQueue => {
  const musicMongoRepository = new QueueMongoRepository();
  return new DbSaveQueue(musicMongoRepository);
};
