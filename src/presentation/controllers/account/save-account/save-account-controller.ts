import { InvalidParamError } from '@/presentation/errors';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, SaveAccount } from './save-account-controller-protocols';

export class SaveAccountController implements Controller {
  constructor(private readonly saveAccount: SaveAccount) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!('id' in httpRequest.body)) {
        return badRequest(new InvalidParamError('id'));
      }

      if ('password' in httpRequest.body) {
        delete httpRequest.body.password;
      }

      if ('accessToken' in httpRequest.body) {
        delete httpRequest.body.accessToken;
      }

      if ('role' in httpRequest.body) {
        delete httpRequest.body.role;
      }

      await this.saveAccount.save(httpRequest.body);

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
