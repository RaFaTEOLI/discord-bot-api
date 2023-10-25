import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';
import { describe, test, expect, vi } from 'vitest';

vi.mock('validator', async () => {
  return {
    default: {
      isEmail(): boolean {
        return true;
      }
    }
  };
});

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut();
    vi.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBeFalsy();
  });

  test('should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBeTruthy();
  });

  test('should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = vi.spyOn(validator, 'isEmail');
    sut.isValid('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
