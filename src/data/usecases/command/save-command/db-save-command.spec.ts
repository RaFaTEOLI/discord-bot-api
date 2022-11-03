import { SaveCommandRepository, LoadCommandByNameRepository } from './db-save-command-protocols';
import { DbSaveCommand } from './db-save-command';
import MockDate from 'mockdate';
import { mockSaveCommandRepository, mockLoadCommandByNameRepository } from '@/data/test';
import { mockCommandModel, mockSaveCommandParams } from '@/domain/test';
import env from '@/main/config/env';

interface SutTypes {
  sut: DbSaveCommand;
  saveCommandRepositoryStub: SaveCommandRepository;
  loadCommandByNameRepositoryStub: LoadCommandByNameRepository;
}

const makeSut = (): SutTypes => {
  const saveCommandRepositoryStub = mockSaveCommandRepository();
  const loadCommandByNameRepositoryStub = mockLoadCommandByNameRepository();
  const sut = new DbSaveCommand(saveCommandRepositoryStub, loadCommandByNameRepositoryStub);
  return {
    sut,
    saveCommandRepositoryStub,
    loadCommandByNameRepositoryStub
  };
};

describe('DdSaveCommand Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call SaveCommandRepository with correct values', async () => {
    const { sut, saveCommandRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveCommandRepositoryStub, 'save');
    const commandData = mockSaveCommandParams();
    await sut.save(commandData);
    expect(saveSpy).toHaveBeenCalledWith(
      Object.assign({}, commandData, { command: `${env.commandPrefix}${commandData.command}` })
    );
  });

  test('should call SaveCommandRepository with correct values with prefix', async () => {
    const { sut, saveCommandRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveCommandRepositoryStub, 'save');
    const commandData = mockSaveCommandParams();
    const commandDataWithPrefix = Object.assign({}, commandData, {
      command: `${env.commandPrefix}${commandData.command}`
    });
    await sut.save(commandDataWithPrefix);
    expect(saveSpy).toHaveBeenCalledWith(
      Object.assign({}, commandData, { command: `${env.commandPrefix}${commandData.command}` })
    );
  });

  test('should return a Command if SaveCommandRepository returns a command', async () => {
    const { sut } = makeSut();
    const commandData = mockSaveCommandParams();
    const command = await sut.save(commandData);
    expect(command).toEqual({ ...commandData, id: command.id });
  });

  test('should throw exception if SaveCommandRepository throws exception', async () => {
    const { sut, saveCommandRepositoryStub } = makeSut();
    jest.spyOn(saveCommandRepositoryStub, 'save').mockRejectedValueOnce(new Error());
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadCommandByName returns a command and id is not provided', async () => {
    const { sut, loadCommandByNameRepositoryStub } = makeSut();
    jest.spyOn(loadCommandByNameRepositoryStub, 'loadByName').mockResolvedValueOnce(mockCommandModel());
    const commandData = mockSaveCommandParams();
    const command = await sut.save(commandData);
    expect(command).toBeNull();
  });
});
