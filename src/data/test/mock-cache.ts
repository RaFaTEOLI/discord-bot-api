import { CacheGet } from '@/data/protocols/cache/cache-get';

export class CacheGetSpy implements CacheGet {
  callsCount = 0;
  key: string;
  value: any;

  constructor(value = null) {
    this.value = value;
  }

  get(key: string): any {
    this.callsCount++;
    this.key = key;
    return this.value;
  }
}
