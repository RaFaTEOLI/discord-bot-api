import { QueueClient } from '@/data/protocols/queue';
import { connect } from 'amqplib';
import env from '@/main/config/env';
import { SaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';

export class AmqpClient<R = SaveMusicParams | SaveQueueParams | SaveCommandParams> implements QueueClient<R> {
  async send(queue: 'music' | 'queue' | 'command', data: R): Promise<void> {
    const connection = await connect(
      `amqp://${env.apiQueueUsername}:${env.apiQueuePassword}@${env.apiQueueAdress}:${env.apiQueuePort}`
    );

    const channel = await connection.createChannel();
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}
