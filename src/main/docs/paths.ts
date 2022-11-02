import { loginPath, commandPath, signUpPath, commandParamPath } from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/commands': commandPath,
  '/commands/{commandId}': commandParamPath
};
