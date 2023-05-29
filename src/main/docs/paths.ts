import {
  loginPath,
  commandPath,
  signUpPath,
  commandParamPath,
  healthCheckPath,
  musicPath,
  queuePath,
  spotifyPath,
  accountPath
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
  '/account': accountPath
};
