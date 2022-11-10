import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/test';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';

export const mockSpotifyRequestToken = (): SpotifyRequestToken => {
  class SpotifyRequestTokenStub implements SpotifyRequestToken {
    async request(params: SpotifyRequestTokenParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new SpotifyRequestTokenStub();
};
