import { CacheGet } from '@/data/protocols/cache/cache-get';
import { CacheSet } from '@/data/protocols/cache/cache-set';

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

export class CacheSetSpy implements CacheSet {
  callsCount = 0;
  key: string;
  value: any;
  ttl: number;

  set(key: string, value: any, ttl: number): boolean {
    this.callsCount++;
    this.key = key;
    this.value = value;
    this.ttl = ttl;
    return true;
  }
}
