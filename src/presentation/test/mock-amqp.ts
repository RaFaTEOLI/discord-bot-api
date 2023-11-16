import { AmqpClientSpy } from '@/data/test';

export const mockAmqpClient = (): AmqpClientSpy => {
  return new AmqpClientSpy();
};
