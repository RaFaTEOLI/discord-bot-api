import { badRequest, serverError, success, unauthorized } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols';

export class LoginController implements Controller {
  constructor(private readonly authentication: Authentication, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

      const authAccount = await this.authentication.auth({ email, password });
      if (!authAccount) {
        return unauthorized();
      }

      const { accessToken, ...account } = authAccount;
      delete account.password;

      return success({ accessToken, user: account });
    } catch (error) {
      return serverError(error);
    }
  }
}
