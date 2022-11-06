import { HttpRequest, Validation, SaveMusic } from './save-music-controller-protocols';
import { SaveMusicController } from './save-music-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockValidation, mockSaveMusic } from '@/presentation/test';
import { mockSaveMusicParams } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  body: mockSaveMusicParams()
});

interface SutTypes {
  sut: SaveMusicController;
  validationStub: Validation;
  saveMusicStub: SaveMusic;
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation();
  const saveMusicStub = mockSaveMusic();
  const sut = new SaveMusicController(validationStub, saveMusicStub);
  return {
    sut,
    validationStub,
    saveMusicStub
  };
};

describe('SaveMusic Controller', () => {
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

  test('should call SaveMusic with correct values', async () => {
    const { sut, saveMusicStub } = makeSut();
    const addSpy = jest.spyOn(saveMusicStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 500 if SaveMusic throws an exception', async () => {
    const { sut, saveMusicStub } = makeSut();
    jest.spyOn(saveMusicStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
