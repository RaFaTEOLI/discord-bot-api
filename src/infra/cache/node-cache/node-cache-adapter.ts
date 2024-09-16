import { CacheGet } from '@/data/protocols/cache/cache-get';
import NodeCache from 'node-cache';

export class NodeCacheAdapter implements CacheGet {
  constructor(private readonly cache: NodeCache = new NodeCache()) {}

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any, ttl: number): boolean {
    return this.cache.set(key, value, ttl);
  }
}
