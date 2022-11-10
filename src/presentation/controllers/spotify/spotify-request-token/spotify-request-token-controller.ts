import { InvalidParamError } from '@/presentation/errors';
import { badRequest, serverError, success } from '@/presentation/helpers/http/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  SpotifyRequestToken
} from './spotify-request-token-controller-protocols';

export class SpotifyRequestTokenController implements Controller {
  constructor(private readonly spotifyRequestToken: SpotifyRequestToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.spotifyRequestToken.request(httpRequest.body);
      return success(account);
    } catch (error) {
      if (error.message === 'Invalid param: client id') {
        return badRequest(new InvalidParamError('Client ID'));
      }
      return serverError(error);
    }
  }
}
