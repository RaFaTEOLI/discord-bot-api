import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { Validation } from '@/presentation/protocols/validation';
import { makeSaveMusicValidation } from './save-music-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('SaveMusic Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSaveMusicValidation();
    const validations: Validation[] = [];
    for (const field of ['name']) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
