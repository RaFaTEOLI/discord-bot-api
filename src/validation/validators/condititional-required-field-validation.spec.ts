import { MissingParamError } from '@/presentation/errors';
import { ConditionalRequiredFieldValidation } from './condititional-required-field-validation';
import { describe, test, expect } from 'vitest';

const makeSut = (): ConditionalRequiredFieldValidation => {
  return new ConditionalRequiredFieldValidation('field', 'otherField', 'any_value');
};

describe('Conditional Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name', otherField: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('should return void if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_name', otherField: 'any_value' });
    expect(error).toBeFalsy();
  });

  test('should return void if validation succeeds when comparison field is not present', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toBeFalsy();
  });
});
