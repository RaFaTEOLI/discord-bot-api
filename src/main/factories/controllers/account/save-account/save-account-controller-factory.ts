import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { SaveAccountController } from '@/presentation/controllers/account/save-account/save-account-controller';
import { makeDbSaveAccount } from '@/main/factories/usecases/account/save-account/db-save-account-factory';

export const makeSaveAccountController = (): Controller => {
  return makeLogControllerDecorator(new SaveAccountController(makeDbSaveAccount()));
};
