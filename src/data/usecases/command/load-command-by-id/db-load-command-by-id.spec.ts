import { LoadCommandByIdRepository } from './db-load-command-by-id-protocols';
import { DbLoadCommandById } from './db-load-command-by-id';
import MockDate from 'mockdate';
import { mockLoadCommandByIdRepository } from '@/data/test';
import { mockCommandModel } from '@/domain/test';
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
    const loadByIdSpy = jest.spyOn(loadCommandByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });

  test('should return a Command on success', async () => {
    const { sut } = makeSut();
    const command = await sut.loadById('any_id');
    expect(command).toEqual(mockCommandModel());
  });

  test('should throw exception if LoadCommandByIdRepository throws exception', async () => {
    const { sut, loadCommandByIdRepositoryStub } = makeSut();
    jest.spyOn(loadCommandByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error());
    const promise = sut.loadById('any_id');
    await expect(promise).rejects.toThrow();
  });
});
