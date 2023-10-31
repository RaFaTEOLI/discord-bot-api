import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeUpdateCommandValidation } from './update-command-validation-factory';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@/validation/validators/validation-composite');

describe('UpdateCommand Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeUpdateCommandValidation();
    const validations: Validation[] = [];
    for (const field of ['id']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
