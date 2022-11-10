import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeSpotifyRequestToken } from '@/main/factories/usecases/spotify/spotify-request-token/spotify-request-token-factory';
import { SpotifyRequestTokenController } from '@/presentation/controllers/spotify/spotify-request-token/spotify-request-token-controller';

export const makeSpotifyRequestTokenController = (): Controller => {
  return makeLogControllerDecorator(new SpotifyRequestTokenController(makeSpotifyRequestToken()));
};
