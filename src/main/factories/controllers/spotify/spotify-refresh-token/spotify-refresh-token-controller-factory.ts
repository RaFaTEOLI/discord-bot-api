import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeSpotifyRefreshToken } from '@/main/factories/usecases/spotify/spotify-refresh-token/spotify-refresh-token-factory';
import { makeDbSaveAccount } from '@/main/factories/usecases/account/save-account/db-save-account-factory';
import { SpotifyRefreshTokenController } from '@/presentation/controllers/spotify/spotify-refresh-token/spotify-refresh-token-controller';

export const makeSpotifyRefreshTokenController = (): Controller => {
  return makeLogControllerDecorator(
    new SpotifyRefreshTokenController(makeSpotifyRefreshToken(), makeDbSaveAccount())
  );
};
