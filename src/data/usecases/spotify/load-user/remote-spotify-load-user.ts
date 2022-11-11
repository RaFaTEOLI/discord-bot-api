/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models/account';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { SpotifyUserModel } from '@/domain/models/spotify';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { SpotifyLoadUser, SpotifyLoadUserParams } from '@/domain/usecases/spotify/spotify-load-user';

export class RemoteSpotifyLoadUser implements SpotifyLoadUser {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<SpotifyUserModel>,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async load(params: SpotifyLoadUserParams): Promise<AccountModel> {
    const { accessToken, refreshToken, redirectUri } = params;
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        const { id, email, display_name } = httpResponse.body;
        let account = await this.loadAccountByEmailRepository.loadByEmail(email);
        if (!account) {
          if (redirectUri.endsWith('/signup')) {
            account = await this.addAccountRepository.add({
              email,
              name: display_name,
              password: id
            });
          } else {
            throw new AccessDeniedError();
          }
        }

        return {
          ...account,
          spotify: {
            accessToken,
            refreshToken
          }
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
