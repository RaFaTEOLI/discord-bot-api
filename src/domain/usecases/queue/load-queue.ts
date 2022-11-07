import { QueueModel } from '@/domain/models/queue';

export interface LoadQueue {
  load: () => Promise<QueueModel>;
}
