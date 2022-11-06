import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';

export const makeSaveMusicValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
