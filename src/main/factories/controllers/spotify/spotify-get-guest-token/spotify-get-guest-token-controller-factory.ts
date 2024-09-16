import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SpotifyGetGuestTokenController } from '@/presentation/controllers/spotify/spotify-get-guest-token/spotify-get-guest-token-controller';
import { makeSpotifyGetGuestToken } from '@/main/factories/usecases/spotify/spotify-get-guest-token/spotify-get-guest-token-factory';

export const makeSpotifyGetGuestTokenController = (): Controller => {
  return makeLogControllerDecorator(new SpotifyGetGuestTokenController(makeSpotifyGetGuestToken()));
};
