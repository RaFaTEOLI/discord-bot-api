export interface CacheSet<T = any> {
  set: (key: string, value: T, ttl: number) => boolean;
}
