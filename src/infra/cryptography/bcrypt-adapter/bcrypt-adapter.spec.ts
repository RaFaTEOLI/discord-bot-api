import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';
import { describe, test, expect, vi } from 'vitest';

vi.mock('bcrypt', async () => {
  return {
    default: {
      async hash(): Promise<string> {
        return await Promise.resolve('hash');
      },
      async compare(): Promise<boolean> {
        return await Promise.resolve(true);
      }
    }
  };
});

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('should call hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = vi.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('should return a valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hash');
    });

    test('should throw exception if hash throws exception', async () => {
      const sut = makeSut();
      vi.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error() as never);
      const promise = sut.hash('any_value');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = vi.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('should return true when comparison succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');
      expect(isValid).toBeTruthy();
    });

    test('should return false when comparison fails', async () => {
      const sut = makeSut();
      vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);
      const isValid = await sut.compare('any_value', 'any_hash');
      expect(isValid).toBeFalsy();
    });

    test('should throw exception if compare throws exception', async () => {
      const sut = makeSut();
      vi.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error() as never);
      const promise = sut.compare('any_value', 'any_hash');
      await expect(promise).rejects.toThrow();
    });
  });
});
