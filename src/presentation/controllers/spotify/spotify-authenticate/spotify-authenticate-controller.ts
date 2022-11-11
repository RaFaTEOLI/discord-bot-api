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
      const spotifyUser = await this.spotifyLoadUser.load({
        accessToken: accessModel.access_token,
        refreshToken: accessModel.refresh_token,
        redirectUri
      });

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
          accessToken = await this.authentication.auth({
            email: spotifyUser.email,
            password: spotifyUser.password
          });
        } else {
          return unauthorized();
        }
      }

      console.log({
        accessToken,
        user: {
          email: userAccount.email,
          name: userAccount.name,
          id: userAccount.id,
          spotify: userAccount.spotify
        }
      });
      return success({
        accessToken,
        user: {
          email: userAccount.email,
          name: userAccount.name,
          id: userAccount.id,
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
