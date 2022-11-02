import { EmailValidation } from './email-validation';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { InvalidParamError } from '@/presentation/errors';
import { mockEmailValidator } from '@/validation/test';

interface SutTypes {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  };
};

describe('Email Validation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'any_email@mail.com' });
    expect(error).toEqual(new InvalidParamError('email'));
  });

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@mail.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should throw an exception 500 if EmailValidator throws an exception', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow();
  });
});
