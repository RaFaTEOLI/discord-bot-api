import { QueueClient } from '@/data/protocols/queue';
import { QueueSaveCommandParams } from '@/domain/usecases/command/save-command';

export class AmqpClientSpy<R = QueueSaveCommandParams> implements QueueClient<R> {
  async send(queue: 'command', data: R): Promise<void> {
    return await Promise.resolve();
  }
}
