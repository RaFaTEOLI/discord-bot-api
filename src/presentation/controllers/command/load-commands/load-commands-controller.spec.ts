import { LoadCommandsController } from './load-commands-controller';
import { LoadCommands, LoadCommandByName } from './load-commands-protocols';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockCommandModel, mockCommandsData } from '@/domain/test';
import { mockLoadCommandByName, mockLoadCommands } from '@/presentation/test';

interface SutTypes {
  sut: LoadCommandsController;
  loadCommandsStub: LoadCommands;
  loadCommandByNameStub: LoadCommandByName;
}

const makeSut = (): SutTypes => {
  const loadCommandsStub = mockLoadCommands();
  const loadCommandByNameStub = mockLoadCommandByName();
  const sut = new LoadCommandsController(loadCommandsStub, loadCommandByNameStub);
  return {
    sut,
    loadCommandsStub,
    loadCommandByNameStub
  };
};

describe('LoadCommands Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadCommands', async () => {
    const { sut, loadCommandsStub } = makeSut();
    const loadSpy = jest.spyOn(loadCommandsStub, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(success(mockCommandsData()));
  });

  test('should return 204 if LoadCommands returns empty', async () => {
    const { sut, loadCommandsStub } = makeSut();
    jest.spyOn(loadCommandsStub, 'load').mockResolvedValue([]);
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 500 if LoadCommands throws an exception', async () => {
    const { sut, loadCommandsStub } = makeSut();
    jest.spyOn(loadCommandsStub, 'load').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 on success if name query string is provided', async () => {
    const { sut, loadCommandByNameStub } = makeSut();
    const commandModel = mockCommandModel();
    jest.spyOn(loadCommandByNameStub, 'loadByName').mockResolvedValueOnce(commandModel);
    const httpResponse = await sut.handle({
      query: {
        name: 'any_command'
      }
    });
    expect(httpResponse).toEqual(success(commandModel));
    expect(httpResponse.body.command).toBe('any_command');
  });

  test('should return 204 on if no command is found when name query string is provided', async () => {
    const { sut, loadCommandByNameStub } = makeSut();
    jest.spyOn(loadCommandByNameStub, 'loadByName').mockResolvedValue(null);
    const httpResponse = await sut.handle({
      query: {
        name: 'invalid_command'
      }
    });
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 500 if LoadCommandByName throws an exception', async () => {
    const { sut, loadCommandByNameStub } = makeSut();
    jest.spyOn(loadCommandByNameStub, 'loadByName').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({
      query: {
        name: 'any_command'
      }
    });
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
