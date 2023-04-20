import { SpotifyAccessModel } from '@/domain/models/spotify';

export type SpotifyRequestTokenParams = {
  code: string;
  state?: string;
  redirectUri: string;
  encodedAuthorization: string;
};

export interface SpotifyRequestToken {
  request: (params: SpotifyRequestTokenParams) => Promise<SpotifyAccessModel>;
}
