import { SaveCommandRepository } from './db-save-command-protocols';
import { DbSaveCommand } from './db-save-command';
import MockDate from 'mockdate';
import { mockSaveCommandRepository } from '@/data/test';
import { mockSaveCommandParams } from '@/domain/test';
import env from '@/main/config/env';

interface SutTypes {
  sut: DbSaveCommand;
  saveCommandRepositoryStub: SaveCommandRepository;
}

const makeSut = (): SutTypes => {
  const saveCommandRepositoryStub = mockSaveCommandRepository();
  const sut = new DbSaveCommand(saveCommandRepositoryStub);
  return {
    sut,
    saveCommandRepositoryStub
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

  test('should throw exception if SaveCommandRepository throws exception', async () => {
    const { sut, saveCommandRepositoryStub } = makeSut();
    jest.spyOn(saveCommandRepositoryStub, 'save').mockRejectedValueOnce(new Error());
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow();
  });
});
