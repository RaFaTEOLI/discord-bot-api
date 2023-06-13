import { InvalidParamError } from '@/presentation/errors';
import { badRequest, serverError, success } from '@/presentation/helpers/http/http-helper';

import {
  Controller,
  HttpRequest,
  HttpResponse,
  SpotifyRefreshToken,
  SaveAccount
} from './spotify-refresh-token-controller-protocols';

export class SpotifyRefreshTokenController implements Controller {
  constructor(
    private readonly spotifyRefreshToken: SpotifyRefreshToken,
    private readonly saveAccount: SaveAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessModel = await this.spotifyRefreshToken.refresh(httpRequest.body);

      await this.saveAccount.save(httpRequest.account.id, { spotify: { accessToken: accessModel.access_token } });

      return success({
        accessToken: accessModel.access_token
      });
    } catch (error) {
      console.log(error);
      if (error.message.includes('Invalid param')) {
        return badRequest(new InvalidParamError(error.message.replace('Invalid ', '')));
      }
      return serverError(error);
    }
  }
}
