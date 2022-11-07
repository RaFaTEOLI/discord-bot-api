import { SaveQueue, SaveQueueParams } from '@/domain/usecases/queue/save-queue';

export const mockSaveQueue = (): SaveQueue => {
  class SaveQueueStub implements SaveQueue {
    async save(songs: SaveQueueParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new SaveQueueStub();
};
