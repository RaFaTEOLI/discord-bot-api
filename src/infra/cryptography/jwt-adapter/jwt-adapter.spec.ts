import jwt from 'jsonwebtoken';
import { JWTAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return await Promise.resolve('any_token');
  },

  async verify(): Promise<string> {
    return await Promise.resolve('any_value');
  },
}));

const makeSut = (): JWTAdapter => {
  return new JWTAdapter('secret');
};

describe('JWT Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('any_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    test('should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt('any_id');
      expect(accessToken).toBe('any_token');
    });

    test('should throw an exception if sign throws an exception', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockRejectedValueOnce(new Error() as never);
      const promise = sut.encrypt('any_id');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });

    test('should throw an exception if verify throws an exception', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockRejectedValueOnce(new Error() as never);
      const promise = sut.decrypt('any_token');
      await expect(promise).rejects.toThrow();
    });
  });
});
