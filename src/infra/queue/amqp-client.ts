import { Queue, QueueClient } from '@/data/protocols/queue';
import { connect } from 'amqplib';
import env from '@/main/config/env';

export class AmqpClient<DataParams> implements QueueClient<DataParams> {
  async send(queue: Queue, data: DataParams): Promise<void> {
    const connection = await connect(
      `amqp://${env.apiQueueUsername}:${env.apiQueuePassword}@${env.apiQueueAdress}:${env.apiQueuePort}`
    );

    const channel = await connection.createChannel();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}
