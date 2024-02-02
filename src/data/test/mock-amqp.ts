import { Queue, QueueClient } from '@/data/protocols/queue';

export class AmqpClientSpy<DataParams> implements QueueClient<DataParams> {
  async send(queue: Queue, data: DataParams): Promise<void> {
    return await Promise.resolve();
  }
}
