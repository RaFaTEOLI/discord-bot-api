import { CacheGet } from '@/data/protocols/cache/cache-get';
import { CacheSet } from '@/data/protocols/cache/cache-set';
import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors';
import { SpotifyGuestTokenModel } from '@/domain/models/spotify';
import { SpotifyGetGuestToken } from '@/domain/usecases/spotify/spotify-get-guest-token';

export class RemoteSpotifyGetGuestToken implements SpotifyGetGuestToken {
  private readonly spotifyGuestTokenKey: string = 'spotify-guest-token';

  constructor(
    private readonly url: string,
    private readonly cacheGet: CacheGet<SpotifyGuestTokenModel>,
    private readonly cacheSet: CacheSet<SpotifyGuestTokenModel>,
    private readonly httpClient: HttpClient<SpotifyGuestTokenModel>
  ) {}

  async get(): Promise<SpotifyGuestTokenModel> {
    const spotifyGuestToken = this.cacheGet.get(this.spotifyGuestTokenKey);

    if (spotifyGuestToken) {
      return spotifyGuestToken;
    }

    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        this.cacheSet.set(this.spotifyGuestTokenKey, httpResponse.body, 3600);
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
