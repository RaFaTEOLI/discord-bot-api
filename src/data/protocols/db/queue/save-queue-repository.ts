import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';

export interface SaveQueueRepository {
  save: (songs: SaveQueueParams) => Promise<void>;
}
