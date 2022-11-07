import { LoadQueue, LoadQueueRepository, QueueModel } from './db-load-queue-protocols';

export class DbLoadQueue implements LoadQueue {
  constructor(private readonly loadQueueRepository: LoadQueueRepository) {}

  async load(): Promise<QueueModel> {
    const queue = await this.loadQueueRepository.load();
    return queue;
  }
}
