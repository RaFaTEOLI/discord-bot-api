import { LoadCommandByIdController } from './load-command-by-id-controller';
import { LoadCommandById, HttpRequest } from './load-command-by-id-protocols';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockCommandModel } from '@/domain/test';
import { mockLoadCommandById } from '@/presentation/test';

interface SutTypes {
  sut: LoadCommandByIdController;
  loadCommandByIdStub: LoadCommandById;
}

const mockRequest = (): HttpRequest => ({
  params: {
    commandId: 'any_id'
  }
});

const makeSut = (): SutTypes => {
  const loadCommandByIdStub = mockLoadCommandById();
  const sut = new LoadCommandByIdController(loadCommandByIdStub);
  return {
    sut,
    loadCommandByIdStub
  };
};

describe('LoadCommandById Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call LoadCommandById', async () => {
    const { sut, loadCommandByIdStub } = makeSut();
    const loadSpy = jest.spyOn(loadCommandByIdStub, 'loadById');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test('should return 200 on success', async () => {
    const { sut, loadCommandByIdStub } = makeSut();
    const commandModel = mockCommandModel();
    jest.spyOn(loadCommandByIdStub, 'loadById').mockResolvedValueOnce(commandModel);
    const httpResponse = await sut.handle({
      params: {
        commandId: 'any_id'
      }
    });
    expect(httpResponse).toEqual(success(commandModel));
  });

  test('should return 204 if LoadCommandById returns empty', async () => {
    const { sut, loadCommandByIdStub } = makeSut();
    jest.spyOn(loadCommandByIdStub, 'loadById').mockResolvedValue(null);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('should return 500 if LoadCommandById throws an exception', async () => {
    const { sut, loadCommandByIdStub } = makeSut();
    jest.spyOn(loadCommandByIdStub, 'loadById').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
