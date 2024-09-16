import { SpotifyAccessModel, SpotifyGuestTokenModel } from '@/domain/models/spotify';
import { mockAccountModel, mockSpotifyAccessModel } from '@/domain/test';
import { SpotifyRequestToken, SpotifyRequestTokenParams } from '@/domain/usecases/spotify/spotify-request-token';
import { SpotifyLoadUser, SpotifyLoadUserParams } from '@/domain/usecases/spotify/spotify-load-user';
import { AccountModel } from '@/domain/models/account';
import { SpotifyRefreshToken, SpotifyRefreshTokenParams } from '@/domain/usecases/spotify/spotify-refresh-token';
import { SpotifyGetGuestToken } from '@/domain/usecases/spotify/spotify-get-guest-token';
import { mockSpotifyGuestTokenModel } from '@/domain/test/mock-spotify-get-guest-token';

export const mockSpotifyRequestToken = (accessModel = mockSpotifyAccessModel()): SpotifyRequestToken => {
  class SpotifyRequestTokenStub implements SpotifyRequestToken {
    async request(params: SpotifyRequestTokenParams): Promise<SpotifyAccessModel> {
      return await Promise.resolve(accessModel);
    }
  }
  return new SpotifyRequestTokenStub();
};

export const mockSpotifyLoadUser = (spotifyUserModel = mockAccountModel()): SpotifyLoadUser => {
  class SpotifyLoadUserStub implements SpotifyLoadUser {
    async load(params: SpotifyLoadUserParams): Promise<AccountModel> {
      return await Promise.resolve(spotifyUserModel);
    }
  }
  return new SpotifyLoadUserStub();
};

export const mockSpotifyRefreshToken = (accessModel = mockSpotifyAccessModel()): SpotifyRefreshToken => {
  class SpotifyRefreshTokenStub implements SpotifyRefreshToken {
    async refresh(params: SpotifyRefreshTokenParams): Promise<SpotifyAccessModel> {
      return await Promise.resolve(accessModel);
    }
  }
  return new SpotifyRefreshTokenStub();
};

export const mockSpotifyGetGuestToken = (guestTokenModel = mockSpotifyGuestTokenModel()): SpotifyGetGuestToken => {
  class SpotifyGetGuestTokenStub implements SpotifyGetGuestToken {
    async get(): Promise<SpotifyGuestTokenModel> {
      return await Promise.resolve(guestTokenModel);
    }
  }
  return new SpotifyGetGuestTokenStub();
};
