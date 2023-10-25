import { LoadQueueRepository, QueueModel } from './db-load-queue-protocols';
import { DbLoadQueue } from './db-load-queue';
import { mockLoadQueueRepository } from '@/data/test';
import { mockQueueModel } from '@/domain/test';
import { describe, test, expect, vi } from 'vitest';

interface SutTypes {
  sut: DbLoadQueue;
  loadQueueRepositoryStub: LoadQueueRepository;
  fakeQueue: QueueModel;
}

const makeSut = (): SutTypes => {
  const fakeQueue = mockQueueModel(5);
  const loadQueueRepositoryStub = mockLoadQueueRepository(fakeQueue);
  const sut = new DbLoadQueue(loadQueueRepositoryStub);
  return {
    sut,
    loadQueueRepositoryStub,
    fakeQueue
  };
};

describe('DbLoadQueue Usecase', () => {
  test('should call LoadQueueRepository', async () => {
    const { sut, loadQueueRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(loadQueueRepositoryStub, 'load');
    await sut.load();
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return a queue on LoadQueueRepository success', async () => {
    const { sut, fakeQueue } = makeSut();
    const queue = await sut.load();
    expect(queue.length).toBe(fakeQueue.length);
  });
});
