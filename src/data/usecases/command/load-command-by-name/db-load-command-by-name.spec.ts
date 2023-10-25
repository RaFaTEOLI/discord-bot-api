import { LoadCommandByNameRepository } from './db-load-command-by-name-protocols';
import { DbLoadCommandByName } from './db-load-command-by-name';
import MockDate from 'mockdate';
import { mockLoadCommandByNameRepository } from '@/data/test';
import { mockCommandModel } from '@/domain/test';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';

interface SutTypes {
  sut: DbLoadCommandByName;
  loadCommandByNameRepositoryStub: LoadCommandByNameRepository;
}

const makeSut = (): SutTypes => {
  const loadCommandByNameRepositoryStub = mockLoadCommandByNameRepository();
  const sut = new DbLoadCommandByName(loadCommandByNameRepositoryStub);
  return {
    sut,
    loadCommandByNameRepositoryStub
  };
};

describe('DbLoadCommandByName', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadCommandByNameRepository with correct name', async () => {
    const { sut, loadCommandByNameRepositoryStub } = makeSut();
    const loadByNameSpy = vi.spyOn(loadCommandByNameRepositoryStub, 'loadByName');
    await sut.loadByName('any_command');
    expect(loadByNameSpy).toHaveBeenCalledWith('any_command');
  });

  test('should return a Command on success', async () => {
    const { sut, loadCommandByNameRepositoryStub } = makeSut();
    const commandModel = mockCommandModel();
    vi.spyOn(loadCommandByNameRepositoryStub, 'loadByName').mockResolvedValueOnce(commandModel);
    const command = await sut.loadByName('any_command');
    expect(command).toEqual(commandModel);
  });

  test('should throw exception if LoadCommandByNameRepository throws exception', async () => {
    const { sut, loadCommandByNameRepositoryStub } = makeSut();
    vi.spyOn(loadCommandByNameRepositoryStub, 'loadByName').mockRejectedValueOnce(new Error());
    const promise = sut.loadByName('any_command');
    await expect(promise).rejects.toThrow();
  });
});
