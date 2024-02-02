import { AmqpClient } from '@/infra/queue/amqp-client';

export const makeAmqpClient = <DataParams>(): AmqpClient<DataParams> => {
  return new AmqpClient<DataParams>();
};
