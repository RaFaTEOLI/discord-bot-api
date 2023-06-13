/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyRefreshToken, SpotifyRefreshTokenParams } from '@/domain/usecases/spotify/spotify-refresh-token';
import { InvalidParamError } from '@/presentation/errors';
import { SpotifyAccessModel } from '@/domain/models/spotify';

export class RemoteSpotifyRefreshToken implements SpotifyRefreshToken {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<SpotifyAccessModel>) {}

  async refresh(params: SpotifyRefreshTokenParams): Promise<SpotifyAccessModel> {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', params.refreshToken);

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
