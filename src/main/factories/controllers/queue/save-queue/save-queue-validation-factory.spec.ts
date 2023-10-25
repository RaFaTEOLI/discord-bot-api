import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeSaveQueueValidation } from './save-queue-validation-factory';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@/validation/validators/validation-composite');

describe('SaveMusic Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSaveQueueValidation();
    const validations: Validation[] = [];
    for (const field of ['songs']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
