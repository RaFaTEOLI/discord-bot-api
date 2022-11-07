import { SaveQueueRepository } from './db-save-queue-protocols';
import { DbSaveQueue } from './db-save-queue';
import { mockSaveQueueRepository } from '@/data/test';
import { mockSaveQueueParams } from '@/domain/test';

interface SutTypes {
  sut: DbSaveQueue;
  saveQueueRepositoryStub: SaveQueueRepository;
}

const makeSut = (): SutTypes => {
  const saveQueueRepositoryStub = mockSaveQueueRepository();
  const sut = new DbSaveQueue(saveQueueRepositoryStub);
  return {
    sut,
    saveQueueRepositoryStub
  };
};

describe('DdSaveQueue Usecase', () => {
  test('should call SaveQueueRepository with correct values', async () => {
    const { sut, saveQueueRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveQueueRepositoryStub, 'save');
    const queueData = mockSaveQueueParams();
    await sut.save(queueData);
    expect(saveSpy).toHaveBeenCalledWith(queueData);
  });
});
