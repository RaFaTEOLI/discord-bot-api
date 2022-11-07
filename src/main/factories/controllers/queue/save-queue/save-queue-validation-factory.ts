import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';

export const makeSaveQueueValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['songs']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
