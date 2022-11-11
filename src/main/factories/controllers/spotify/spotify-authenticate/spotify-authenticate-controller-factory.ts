import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeSpotifyRequestToken } from '@/main/factories/usecases/spotify/spotify-request-token/spotify-request-token-factory';
import { SpotifyAuthenticateController } from '@/presentation/controllers/spotify/spotify-authenticate/spotify-authenticate-controller';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory';
import { makeSpotifyLoadUser } from '@/main/factories/usecases/spotify/spotify-load-user/spotify-load-user-factory';

export const makeSpotifyAuthenticateController = (): Controller => {
  return makeLogControllerDecorator(
    new SpotifyAuthenticateController(
      makeSpotifyRequestToken(),
      makeSpotifyLoadUser(),
      makeDbAddAccount(),
      makeDbAuthentication()
    )
  );
};
