import { loginPath, commandPath, signUpPath, commandParamPath, healthCheckPath } from './paths/';

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/commands': commandPath,
  '/commands/{commandId}': commandParamPath,
  '/health-check': healthCheckPath
};
