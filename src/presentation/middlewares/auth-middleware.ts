import { LoadAccountByToken, Middleware, HttpRequest, HttpResponse } from './auth-middleware-protocols';
import { AccessDeniedError } from '../errors';
import { forbidden, serverError, success } from '../helpers/http/http-helper';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: string) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role);
        if (account) {
          const { password, ...accountToReturn } = account;
          return success({ account: accountToReturn });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
