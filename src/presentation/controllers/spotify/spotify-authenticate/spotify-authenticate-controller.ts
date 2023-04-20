import { EmailInUseError, InvalidParamError } from '@/presentation/errors';
import {
  badRequest,
  forbidden,
  serverError,
  success,
  unauthorized
} from '@/presentation/helpers/http/http-helper';

import {
  Controller,
  HttpRequest,
  HttpResponse,
  SpotifyRequestToken,
  SpotifyLoadUser,
  AddAccount,
  Authentication
} from './spotify-authenticate-controller-protocols';

export class SpotifyAuthenticateController implements Controller {
  constructor(
    private readonly spotifyRequestToken: SpotifyRequestToken,
    private readonly spotifyLoadUser: SpotifyLoadUser,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { redirectUri } = httpRequest.body;
      const accessModel = await this.spotifyRequestToken.request(httpRequest.body);
      console.debug('Fetched Access Model from Spotify:', accessModel);
      const spotifyUser = await this.spotifyLoadUser.load({
        accessToken: accessModel.access_token,
        refreshToken: accessModel.refresh_token,
        redirectUri
      });
      console.debug('Fetched SpotifyUser:', spotifyUser);

      let userAccount = spotifyUser;
      let accessToken = spotifyUser.accessToken;

      if (spotifyUser.id === 'NOT-FOUND') {
        if (redirectUri.endsWith('/signup')) {
          const account = await this.addAccount.add({
            email: spotifyUser.email,
            name: spotifyUser.name,
            password: spotifyUser.password
          });
          if (!account) {
            return forbidden(new EmailInUseError());
          }
          userAccount = account;
          const authAccount = await this.authentication.auth({
            email: spotifyUser.email,
            password: spotifyUser.password
          });
          accessToken = authAccount.accessToken;
        } else {
          return unauthorized();
        }
      }

      return success({
        accessToken,
        user: {
          email: userAccount.email,
          name: userAccount.name,
          id: userAccount.id,
          ...(userAccount.role && { role: userAccount.role }),
          spotify: userAccount.spotify
        }
      });
    } catch (error) {
      if (error.message.includes('Invalid param')) {
        return badRequest(new InvalidParamError(error.message.replace('Invalid ', '')));
      }
      return serverError(error);
    }
  }
}
