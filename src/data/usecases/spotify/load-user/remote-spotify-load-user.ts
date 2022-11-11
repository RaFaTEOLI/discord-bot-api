/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models/account';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { SpotifyUserModel } from '@/domain/models/spotify';
import { SpotifyLoadUser, SpotifyLoadUserParams } from '@/domain/usecases/spotify/spotify-load-user';

export class RemoteSpotifyLoadUser implements SpotifyLoadUser {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<SpotifyUserModel>,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async load(params: SpotifyLoadUserParams): Promise<AccountModel> {
    const { accessToken, refreshToken } = params;
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const spotify = {
      accessToken,
      refreshToken
    };

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        const { email, display_name, id } = httpResponse.body;
        const account = await this.loadAccountByEmailRepository.loadByEmail(email);

        if (!account) {
          return {
            email,
            name: display_name,
            password: id,
            spotify,
            id: 'NOT-FOUND'
          };
        }
        return {
          ...account,
          spotify
        };
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
