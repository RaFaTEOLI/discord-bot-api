import { QueueClient } from '@/data/protocols/queue';
import { connect } from 'amqplib';
import env from '@/main/config/env';
import { QueueSaveCommandParams } from '@/domain/usecases/command/save-command';

export class AmqpClient<R = QueueSaveCommandParams> implements QueueClient<R> {
  async send(queue: 'command', data: R): Promise<void> {
    const connection = await connect(
      `amqp://${env.apiQueueUsername}:${env.apiQueuePassword}@${env.apiQueueAdress}:${env.apiQueuePort}`
    );

    const channel = await connection.createChannel();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}
