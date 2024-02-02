import { AmqpClientSpy } from '@/data/test';

export const mockAmqpClient = <DataParams>(): AmqpClientSpy<DataParams> => {
  return new AmqpClientSpy<DataParams>();
};
