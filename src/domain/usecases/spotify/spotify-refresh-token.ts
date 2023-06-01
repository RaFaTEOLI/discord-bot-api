import { SpotifyAccessModel } from '@/domain/models/spotify';

export type SpotifyRefreshTokenParams = {
  refreshToken: string;
  encodedAuthorization: string;
};

export interface SpotifyRefreshToken {
  refresh: (params: SpotifyRefreshTokenParams) => Promise<SpotifyAccessModel>;
}
