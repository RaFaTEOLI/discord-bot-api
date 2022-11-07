import { QueueModel } from '@/domain/models/queue';

export interface LoadQueueRepository {
  load: () => Promise<QueueModel>;
}
