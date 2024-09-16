export interface CacheSet {
  set: (key: string, value: any, ttl: number) => boolean;
}
