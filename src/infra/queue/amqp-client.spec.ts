import { mockQueueSaveCommandParams } from '@/domain/test';
import { AmqpClient } from '@/infra/queue/amqp-client';
import { describe, test, expect, vi } from 'vitest';

const mockSendToQueue = vi.fn();

vi.mock('amqplib', async () => {
  const actual = await vi.importActual('amqplib');
  return {
    ...(actual as any),
    connect: vi.fn().mockImplementation(
      async () =>
        await Promise.resolve({
          createChannel: async () => ({ sendToQueue: mockSendToQueue })
        })
    )
  };
});

type SutTypes = {
  sut: AmqpClient;
};

const makeSut = async (): Promise<SutTypes> => {
  const sut = new AmqpClient();
  return {
    sut
  };
};

describe('AmqpClient', () => {
  test('should call send with correct values for command', async () => {
    const { sut } = await makeSut();
    const commandParams = mockQueueSaveCommandParams();
    await sut.send('command', commandParams);
    expect(mockSendToQueue).toHaveBeenCalledWith('command', Buffer.from(JSON.stringify(commandParams)));
  });
});
