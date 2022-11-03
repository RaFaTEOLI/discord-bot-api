import { HttpRequest, Validation, SaveCommand } from './save-command-controller-protocols';
import { SaveCommandController } from './save-command-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockValidation, mockSaveCommand } from '@/presentation/test';
import { mockSaveCommandParams } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  body: mockSaveCommandParams()
});

const mockRequestWithCommandId = (): HttpRequest => ({
  body: mockSaveCommandParams(),
  params: {
    commandId: 'command_id'
  }
});

interface SutTypes {
  sut: SaveCommandController;
  validationStub: Validation;
  saveCommandStub: SaveCommand;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const saveCommandStub = mockSaveCommand();
  const sut = new SaveCommandController(validationStub, saveCommandStub);
  return {
    sut,
    validationStub,
    saveCommandStub
  };
};

describe('SaveCommand Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('should call SaveCommand with correct values', async () => {
    const { sut, saveCommandStub } = makeSut();
    const addSpy = jest.spyOn(saveCommandStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should call SaveCommand with correct values and commandId', async () => {
    const { sut, saveCommandStub } = makeSut();
    const addSpy = jest.spyOn(saveCommandStub, 'save');
    const httpRequest = mockRequestWithCommandId();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({ id: httpRequest.params.commandId, ...httpRequest.body });
  });

  test('should return 500 if SaveCommand throws an exception', async () => {
    const { sut, saveCommandStub } = makeSut();
    jest.spyOn(saveCommandStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
