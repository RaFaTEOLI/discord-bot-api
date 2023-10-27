import { MissingParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols/validation';

export class ConditionalRequiredFieldValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly conditionalField: string,
    private readonly fieldValue: string
  ) {}

  validate(input: any): Error {
    if (input[this.conditionalField] === this.fieldValue) {
      if (!input[this.fieldName]) {
        return new MissingParamError(this.fieldName);
      }
    }
  }
}
