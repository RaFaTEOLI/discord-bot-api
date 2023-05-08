/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';
import { InvalidParamError } from '@/presentation/errors';
import { SpotifyAccessModel } from '@/domain/models/spotify';

export class RemoteSpotifyRequestToken implements SpotifyRequestToken {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<SpotifyAccessModel>) {}

  async request(params: SpotifyRequestTokenParams): Promise<SpotifyAccessModel> {
    const formData = new URLSearchParams();
    formData.append('code', params.code);
    if ('state' in params) {
      formData.append('state', params.state);
    }
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
        return httpResponse.body;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.badRequest:
        const badRequestResponse = httpResponse.body as any;
        throw new InvalidParamError(badRequestResponse.error.replace('invalid_', ''));
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
