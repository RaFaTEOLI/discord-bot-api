import {
  SaveCommandRepository,
  LoadCommandByNameRepository,
  ApplicationCommandType
} from './db-save-command-protocols';
import { DbSaveCommand } from './db-save-command';
import MockDate from 'mockdate';
import { mockSaveCommandRepository, mockLoadCommandByNameRepository, AmqpClientSpy } from '@/data/test';
import { mockCommandModel, mockSaveCommandParams } from '@/domain/test';
import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { faker } from '@faker-js/faker';

interface SutTypes {
  sut: DbSaveCommand;
  saveCommandRepositoryStub: SaveCommandRepository;
  loadCommandByNameRepositoryStub: LoadCommandByNameRepository;
  amqpClientSpy: AmqpClientSpy;
}

const makeSut = (useApiQueue = true): SutTypes => {
  const saveCommandRepositoryStub = mockSaveCommandRepository();
  const loadCommandByNameRepositoryStub = mockLoadCommandByNameRepository();
  const amqpClientSpy = new AmqpClientSpy();
  const sut = new DbSaveCommand(
    saveCommandRepositoryStub,
    loadCommandByNameRepositoryStub,
    amqpClientSpy,
    useApiQueue
  );
  return {
    sut,
    saveCommandRepositoryStub,
    loadCommandByNameRepositoryStub,
    amqpClientSpy
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
    const saveSpy = vi.spyOn(saveCommandRepositoryStub, 'save');
    const commandData = mockSaveCommandParams();
    await sut.save(commandData);
    expect(saveSpy).toHaveBeenCalledWith(commandData);
  });

  test('should return a Command if SaveCommandRepository returns a command', async () => {
    const { sut } = makeSut();
    const commandData = mockSaveCommandParams();
    const command = await sut.save(commandData);
    expect(command).toBeTruthy();
    expect(command.id).toBeTruthy();
    expect(command.discordStatus).toBe('SENT');
  });

  test('should throw exception if SaveCommandRepository throws exception', async () => {
    const { sut, saveCommandRepositoryStub } = makeSut();
    vi.spyOn(saveCommandRepositoryStub, 'save').mockRejectedValueOnce(new Error());
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadCommandByName returns a command and id is not provided', async () => {
    const { sut, loadCommandByNameRepositoryStub } = makeSut();
    vi.spyOn(loadCommandByNameRepositoryStub, 'loadByName').mockResolvedValueOnce(mockCommandModel());
    const commandData = mockSaveCommandParams();
    const command = await sut.save(commandData);
    expect(command).toBeNull();
  });

  test('should return a Command with discordStatus received', async () => {
    const { sut } = makeSut();
    const command = await sut.save({ ...mockSaveCommandParams(), discordStatus: 'RECEIVED' });
    expect(command.discordStatus).toBe('RECEIVED');
  });

  test('should call AmqpClient when useApiQueue is true', async () => {
    const { sut, amqpClientSpy } = makeSut();
    const sendSpy = vi.spyOn(amqpClientSpy, 'send');
    await sut.save(mockSaveCommandParams());
    expect(sendSpy).toHaveBeenCalled();
  });

  test('should call console.error when AmqpClient fails', async () => {
    const { sut, amqpClientSpy } = makeSut();
    vi.spyOn(amqpClientSpy, 'send').mockRejectedValue(new Error());
    const errorLogSpy = vi.spyOn(console, 'error');
    const body = mockSaveCommandParams();
    await sut.save(body);
    expect(errorLogSpy).toHaveBeenCalledWith(
      `Error sending command payload to API Queue: ${JSON.stringify(body)} with error: ${new Error().message}`
    );
  });

  test('should not call AmqpClient when useApiQueue is false', async () => {
    const { sut, amqpClientSpy, saveCommandRepositoryStub } = makeSut(false);
    const sendSpy = vi.spyOn(amqpClientSpy, 'send');
    const commandModel = mockCommandModel();
    vi.spyOn(saveCommandRepositoryStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.save(mockSaveCommandParams());
    expect(sendSpy).not.toHaveBeenCalled();
  });

  test('should call AmqpClient with description when command type is CHAT_INPUT', async () => {
    const { sut, amqpClientSpy, saveCommandRepositoryStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientSpy, 'send');
    const commandModel = mockCommandModel({ discordType: ApplicationCommandType.CHAT_INPUT });
    vi.spyOn(saveCommandRepositoryStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.save(mockSaveCommandParams());
    expect(sendSpy).toHaveBeenCalledWith('command', {
      id: commandModel.id,
      name: commandModel.command,
      type: ApplicationCommandType.CHAT_INPUT,
      description: commandModel.description,
      ...(commandModel.options && { options: commandModel.options })
    });
  });

  test('should call AmqpClient without description when command type is different than CHAT_INPUT', async () => {
    const { sut, amqpClientSpy, saveCommandRepositoryStub } = makeSut();
    const sendSpy = vi.spyOn(amqpClientSpy, 'send');
    const commandModel = mockCommandModel({
      discordType: faker.helpers.arrayElement([ApplicationCommandType.MESSAGE, ApplicationCommandType.USER])
    });
    vi.spyOn(saveCommandRepositoryStub, 'save').mockResolvedValueOnce(commandModel);
    await sut.save(mockSaveCommandParams());
    expect(sendSpy).toHaveBeenCalledWith('command', {
      id: commandModel.id,
      name: commandModel.command,
      type: commandModel.discordType,
      ...(commandModel.options && { options: commandModel.options })
    });
  });
});
