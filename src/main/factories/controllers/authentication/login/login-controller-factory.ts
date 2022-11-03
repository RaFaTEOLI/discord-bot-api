import { LoginController } from '@/presentation/controllers/authentication/login/login-controller';
import { Controller } from '@/presentation/protocols';
import { makeLoginValidation } from './login-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation())
  );
};
