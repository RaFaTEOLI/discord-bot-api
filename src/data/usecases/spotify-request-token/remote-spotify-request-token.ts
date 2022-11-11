/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models/account';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';
import { InvalidParamError } from '@/presentation/errors';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { SpotifyAccessModel } from '@/domain/models/spotify';

export class RemoteSpotifyRequestToken implements SpotifyRequestToken {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<SpotifyAccessModel>,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly httpClientSpotify: HttpClient<{ email: string }>
  ) {}

  async request(params: SpotifyRequestTokenParams): Promise<AccountModel> {
    const formData = new URLSearchParams();
    formData.append('code', params.code);
    formData.append('state', params.state);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', params.redirectUri);

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Basic ${params.encodedAuthorization}`
      }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        const { access_token, refresh_token } = httpResponse.body;
        const userHttpResponse = await this.httpClientSpotify.request({
          url: 'https://api.spotify.com/v1/me',
          method: 'get',
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });
        const { email } = userHttpResponse.body;
        const account = await this.loadAccountByEmailRepository.loadByEmail(email);
        if (!account) {
          throw new AccessDeniedError();
        }

        return {
          ...account,
          spotify: {
            accessToken: access_token,
            refreshToken: refresh_token
          }
        };
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.badRequest:
        const badRequestResponse = httpResponse.body as any;
        throw new InvalidParamError(badRequestResponse.error_description.replace('Invalid ', ''));
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
