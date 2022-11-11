import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  commandsSchema,
  commandSchema,
  signUpParamsSchema,
  saveCommandParamsSchema,
  musicSchema,
  saveMusicParamsSchema,
  saveQueueParamsSchema,
  songSchema,
  songParamsSchema,
  queueSchema,
  spotifyParamsSchema
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
  saveMusicParams: saveMusicParamsSchema,
  saveQueueParams: saveQueueParamsSchema,
  song: songSchema,
  songParams: songParamsSchema,
  queue: queueSchema,
  spotifyParams: spotifyParamsSchema
};
