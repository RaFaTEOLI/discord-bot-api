import { AmqpClient } from '@/infra/queue/amqp-client';

export const makeAmqpClient = (): AmqpClient => {
  return new AmqpClient();
};
