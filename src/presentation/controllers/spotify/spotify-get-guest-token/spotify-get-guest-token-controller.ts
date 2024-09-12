import { serverError, success } from '@/presentation/helpers/http/http-helper';

import {
  Controller,
  HttpRequest,
  HttpResponse,
  SpotifyGetGuestToken
} from './spotify-get-guest-token-controller-protocols';

export class SpotifyGetGuestTokenController implements Controller {
  constructor(private readonly spotifyGetGuestToken: SpotifyGetGuestToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guestTokenModel = await this.spotifyGetGuestToken.get();

      return success({
        accessToken: guestTokenModel.accessToken,
        expiresAt: guestTokenModel.accessTokenExpirationTimestampMs
      });
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}
