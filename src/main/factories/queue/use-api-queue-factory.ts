import env from '@/main/config/env';

export const useApiQueueFactory = (): boolean => {
  if (env.useApiQueue === 'true') {
    return true;
  }
  return false;
};
