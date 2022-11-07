import { SaveQueueRepository } from '@/data/protocols/db/queue/save-queue-repository';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';

export const mockSaveQueueRepository = (): SaveQueueRepository => {
  class SaveQueueRepositoryStub implements SaveQueueRepository {
    async save(songs: SaveQueueParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new SaveQueueRepositoryStub();
};
