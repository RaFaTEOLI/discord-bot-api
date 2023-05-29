import { HttpRequest, SaveAccount } from './save-account-controller-protocols';
import { SaveAccountController } from './save-account-controller';
import { noContent, serverError } from '@/presentation/helpers/http/http-helper';
import MockDate from 'mockdate';
import { mockSaveAccount } from '@/presentation/test';
import { mockAccountModel, mockAccountModelWithSpotifyAndDiscord } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  body: mockAccountModelWithSpotifyAndDiscord(),
  account: mockAccountModel()
});

interface SutTypes {
  sut: SaveAccountController;
  saveAccountStub: SaveAccount;
}

const makeSut = (): SutTypes => {
  const saveAccountStub = mockSaveAccount();
  const sut = new SaveAccountController(saveAccountStub);
  return {
    sut,
    saveAccountStub
  };
};

describe('SaveAccount Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call SaveAccount with correct values', async () => {
    const { sut, saveAccountStub } = makeSut();
    const saveSpy = jest.spyOn(saveAccountStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(saveSpy).toHaveBeenCalledWith(httpRequest.account.id, httpRequest.body);
  });

  test('should not call SaveAccount with password, accessToken and role', async () => {
    const { sut, saveAccountStub } = makeSut();
    const saveSpy = jest.spyOn(saveAccountStub, 'save');
    const httpRequest = mockRequest();
    const newRequest = {
      body: {
        ...httpRequest.body,
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      },
      account: httpRequest.account
    };
    await sut.handle(newRequest);
    expect(saveSpy).toHaveBeenCalledWith(httpRequest.account.id, httpRequest.body);
  });

  test('should return 500 if SaveAccount throws an exception', async () => {
    const { sut, saveAccountStub } = makeSut();
    jest.spyOn(saveAccountStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});
