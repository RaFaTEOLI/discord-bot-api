import { DeleteCommandByIdRepository } from './db-delete-command-by-id-protocols';
import { DbDeleteCommandById } from './db-delete-command-by-id';
import { mockDeleteCommandByIdRepository } from '@/data/test';
import { faker } from '@faker-js/faker';

interface SutTypes {
  sut: DbDeleteCommandById;
  deleteCommandByIdRepositoryStub: DeleteCommandByIdRepository;
}

const makeSut = (): SutTypes => {
  const deleteCommandByIdRepositoryStub = mockDeleteCommandByIdRepository();
  const sut = new DbDeleteCommandById(deleteCommandByIdRepositoryStub);
  return {
    sut,
    deleteCommandByIdRepositoryStub
  };
};

describe('DbDeleteCommandById', () => {
  test('should call DeleteCommandByIdRepository with correct id', async () => {
    const { sut, deleteCommandByIdRepositoryStub } = makeSut();
    const deleteByIdSpy = jest.spyOn(deleteCommandByIdRepositoryStub, 'deleteById');
    const id = faker.datatype.uuid();
    await sut.deleteById(id);
    expect(deleteByIdSpy).toHaveBeenCalledWith(id);
  });

  test('should return true on success', async () => {
    const { sut } = makeSut();
    const command = await sut.deleteById(faker.datatype.uuid());
    expect(command).toBeTruthy();
  });

  test('should return false if no record is found', async () => {
    const { sut, deleteCommandByIdRepositoryStub } = makeSut();
    jest.spyOn(deleteCommandByIdRepositoryStub, 'deleteById').mockResolvedValueOnce(false);
    const command = await sut.deleteById(faker.datatype.uuid());
    expect(command).toBeFalsy();
  });

  test('should throw exception if DeleteCommandByIdRepository throws exception', async () => {
    const { sut, deleteCommandByIdRepositoryStub } = makeSut();
    jest.spyOn(deleteCommandByIdRepositoryStub, 'deleteById').mockRejectedValueOnce(new Error());
    const promise = sut.deleteById(faker.datatype.uuid());
    await expect(promise).rejects.toThrow();
  });
});
