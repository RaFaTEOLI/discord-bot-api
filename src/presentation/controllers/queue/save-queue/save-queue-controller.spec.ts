import { HttpRequest, Validation, SaveQueue } from './save-queue-controller-protocols';
import { SaveQueueController } from './save-queue-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { mockValidation, mockSaveQueue } from '@/presentation/test';
import { mockSaveQueueParams } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  body: { songs: mockSaveQueueParams() }
});

interface SutTypes {
  sut: SaveQueueController;
  validationStub: Validation;
  saveQueueStub: SaveQueue;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const saveQueueStub = mockSaveQueue();
  const sut = new SaveQueueController(validationStub, saveQueueStub);
  return {
    sut,
    validationStub,
    saveQueueStub
  };
};

describe('SaveQueue Controller', () => {
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

  test('should call SaveQueue with correct values', async () => {
    const { sut, saveQueueStub } = makeSut();
    const saveSpy = jest.spyOn(saveQueueStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith(httpRequest.body.songs);
  });

  test('should return 500 if SaveQueue throws an exception', async () => {
    const { sut, saveQueueStub } = makeSut();
    jest.spyOn(saveQueueStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
