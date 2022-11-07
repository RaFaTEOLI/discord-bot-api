import { LoadQueue } from '@/domain/usecases/queue/load-queue';
import { DbLoadQueue } from '@/data/usecases/queue/load-queue/db-load-queue';
import { QueueMongoRepository } from '@/infra/db/mongodb/queue/queue-mongo-repository';

export const makeDbLoadQueue = (): LoadQueue => {
  const queueMongoRepository = new QueueMongoRepository();
  return new DbLoadQueue(queueMongoRepository);
};
