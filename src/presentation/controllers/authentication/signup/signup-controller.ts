import {
  HttpResponse,
  HttpRequest,
  Controller,
} from '@/presentation/protocols';
import {
  AddAccount,
  Validation,
  Authentication,
} from './signup-controller-protocols';
import {
  badRequest,
  forbidden,
  serverError,
  success,
} from '@/presentation/helpers/http/http-helper';
import { EmailInUseError } from '@/presentation/errors';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });
      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const accessToken = await this.authentication.auth({ email, password });
      return success({ accessToken, user: account });
    } catch (error) {
      return serverError(error);
    }
  }
}