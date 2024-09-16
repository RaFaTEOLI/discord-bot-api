import { NodeCacheAdapter } from '@/infra/cache/node-cache/node-cache-adapter';

export const makeNodeCacheAdapter = (): NodeCacheAdapter => {
  return new NodeCacheAdapter();
};
