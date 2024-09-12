import { SpotifyGuestTokenModel } from '@/domain/models/spotify';

export interface SpotifyGetGuestToken {
  get: () => Promise<SpotifyGuestTokenModel>;
}
