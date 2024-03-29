import { LoadCommandByIdRepository } from './db-load-command-by-id-protocols';
import { DbLoadCommandById } from './db-load-command-by-id';
import MockDate from 'mockdate';
import { mockLoadCommandByIdRepository } from '@/data/test';
import { mockCommandModel } from '@/domain/test';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
interface SutTypes {
  sut: DbLoadCommandById;
  loadCommandByIdRepositoryStub: LoadCommandByIdRepository;
}

const makeSut = (): SutTypes => {
  const loadCommandByIdRepositoryStub = mockLoadCommandByIdRepository();
  const sut = new DbLoadCommandById(loadCommandByIdRepositoryStub);
  return {
    sut,
    loadCommandByIdRepositoryStub
  };
};

describe('DbLoadCommandById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadCommandByIdRepository with correct id', async () => {
    const { sut, loadCommandByIdRepositoryStub } = makeSut();
    const loadByIdSpy = vi.spyOn(loadCommandByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('should return a Command on success', async () => {
    const { sut, loadCommandByIdRepositoryStub } = makeSut();
    const commandModel = mockCommandModel();
    vi.spyOn(loadCommandByIdRepositoryStub, 'loadById').mockResolvedValueOnce(commandModel);
    const command = await sut.loadById('any_id');
    expect(command).toEqual(commandModel);
  });

  test('should throw exception if LoadCommandByIdRepository throws exception', async () => {
    const { sut, loadCommandByIdRepositoryStub } = makeSut();
    vi.spyOn(loadCommandByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error());
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });
});
