import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeSaveCommandValidation } from './save-command-validation-factory';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@/validation/validators/validation-composite');

describe('SaveCommand Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSaveCommandValidation();
    const validations: Validation[] = [];
    for (const field of ['command', 'dispatcher', 'type', 'description', 'discordType']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
