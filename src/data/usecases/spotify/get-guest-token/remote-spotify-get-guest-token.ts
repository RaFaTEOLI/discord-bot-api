import { CacheGet } from '@/data/protocols/cache/cache-get';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyGuestTokenModel } from '@/domain/models/spotify';
import { SpotifyGetGuestToken } from '@/domain/usecases/spotify/spotify-get-guest-token';

export class RemoteSpotifyGetGuestToken implements SpotifyGetGuestToken {
  constructor(
    private readonly url: string,
    private readonly cacheGet: CacheGet<SpotifyGuestTokenModel>,
    private readonly httpClient: HttpClient<SpotifyGuestTokenModel>
  ) {}

  async get(): Promise<SpotifyGuestTokenModel> {
    const spotifyGuestToken = this.cacheGet.get('spotify-guest-token');

    if (spotifyGuestToken) {
      return spotifyGuestToken;
    }

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return httpResponse.body;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError();
      default:
        throw new UnexpectedError();
    }
  }
}
