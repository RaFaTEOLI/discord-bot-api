import { QueueModel } from '@/domain/models/queue';

export type SaveQueueParams = Omit<QueueModel, 'id'>;

export interface SaveMusic {
  save: (songs: SaveQueueParams[]) => Promise<void>;
}
