import { SaveQueueRepository } from '@/data/protocols/db/queue/save-queue-repository';
import { LoadQueueRepository } from '@/data/protocols/db/queue/load-queue-repository';
import { mockQueueModel } from '@/domain/test';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { QueueModel } from '@/domain/models/queue';

export const mockSaveQueueRepository = (): SaveQueueRepository => {
  class SaveQueueRepositoryStub implements SaveQueueRepository {
    async save(songs: SaveQueueParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new SaveQueueRepositoryStub();
};

export const mockLoadQueueRepository = (fakeQueue = mockQueueModel()): LoadQueueRepository => {
  class LoadQueueRepositoryStub implements LoadQueueRepository {
    async load(): Promise<QueueModel> {
      return await Promise.resolve(fakeQueue);
    }
  }
  return new LoadQueueRepositoryStub();
};
