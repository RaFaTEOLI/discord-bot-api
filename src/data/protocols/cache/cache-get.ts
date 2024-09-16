export interface CacheGet<T = any> {
  get: (key: string) => T;
}
