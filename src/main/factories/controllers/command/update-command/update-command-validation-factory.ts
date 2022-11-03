import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';

export const makeUpdateCommandValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['id', 'command', 'dispatcher', 'type', 'description']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
