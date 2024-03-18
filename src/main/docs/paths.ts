import {
  loginPath,
  commandPath,
  signUpPath,
  commandParamPath,
  healthCheckPath,
  musicPath,
  queuePath,
  spotifyPath,
  accountPath,
  spotifyRefreshTokenPath,
  discordCommandPath
} from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/commands': commandPath,
  '/commands/{commandId}': commandParamPath,
  '/health-check': healthCheckPath,
  '/music': musicPath,
  '/queue': queuePath,
  '/spotify/auth': spotifyPath,
  '/spotify/refresh-token': spotifyRefreshTokenPath,
  '/account': accountPath,
  '/discord/commands': discordCommandPath
};
