import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  commandsSchema,
  commandSchema,
  signUpParamsSchema,
  saveCommandParamsSchema,
  musicSchema,
  saveMusicParamsSchema
} from './schemas/';

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  SaveCommandParams: saveCommandParamsSchema,
  error: errorSchema,
  commands: commandsSchema,
  command: commandSchema,
  music: musicSchema,
  saveMusicParams: saveMusicParamsSchema
};
