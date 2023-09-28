import { LoadCommandsRepository } from './db-load-commands-protocols';
import { DbLoadCommands } from './db-load-commands';
import MockDate from 'mockdate';
import { mockLoadCommandsRepository } from '@/data/test';
import { mockCommandsData } from '@/domain/test';

interface SutTypes {
  sut: DbLoadCommands;
  loadCommandsRepositoryStub: LoadCommandsRepository;
}

const makeSut = (): SutTypes => {
  const loadCommandsRepositoryStub = mockLoadCommandsRepository();
  const sut = new DbLoadCommands(loadCommandsRepositoryStub);
  return {
    sut,
    loadCommandsRepositoryStub
  };
};

describe('DbLoadCommands', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadCommandsRepository', async () => {
    const { sut, loadCommandsRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadCommandsRepositoryStub, 'loadAll');
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test('should return a list of Commands on success', async () => {
    const { sut, loadCommandsRepositoryStub } = makeSut();
    const commandsData = mockCommandsData();
    jest.spyOn(loadCommandsRepositoryStub, 'loadAll').mockResolvedValueOnce(commandsData);
    const commands = await sut.load();
    expect(commands).toEqual(commandsData);
  });

  test('should throw exception if LoadCommandsRepository throws exception', async () => {
    const { sut, loadCommandsRepositoryStub } = makeSut();
    jest.spyOn(loadCommandsRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error());
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
