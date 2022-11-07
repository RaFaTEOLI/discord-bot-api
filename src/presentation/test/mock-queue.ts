import { QueueModel } from '@/domain/models/queue';
import { SaveQueue, SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { LoadQueue } from '@/domain/usecases/queue/load-queue';
import { mockQueueModel } from '@/domain/test';

export const mockSaveQueue = (): SaveQueue => {
  class SaveQueueStub implements SaveQueue {
    async save(songs: SaveQueueParams): Promise<void> {
      return await Promise.resolve();
    }
  }
  return new SaveQueueStub();
};

export const mockLoadQueue = (fakeQueue = mockQueueModel()): LoadQueue => {
  class LoadQueueStub implements LoadQueue {
    async load(): Promise<QueueModel> {
      return await Promise.resolve(fakeQueue);
    }
  }
  return new LoadQueueStub();
};
