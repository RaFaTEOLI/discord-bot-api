import { LoadCommandsController } from './load-commands-controller';
import { LoadCommands } from './load-commands-protocols';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockCommandsData } from '@/domain/test';
import { mockLoadCommands } from '@/presentation/test';

interface SutTypes {
  sut: LoadCommandsController;
  loadCommandsStub: LoadCommands;
}

const makeSut = (): SutTypes => {
  const loadCommandsStub = mockLoadCommands();
  const sut = new LoadCommandsController(loadCommandsStub);
  return {
    sut,
    loadCommandsStub
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
});