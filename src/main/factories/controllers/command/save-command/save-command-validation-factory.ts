import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';

export const makeSaveCommandValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['command', 'dispatcher', 'type', 'description', 'discordType']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
