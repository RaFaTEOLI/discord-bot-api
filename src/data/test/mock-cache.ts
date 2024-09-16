import { CacheGet } from '@/data/protocols/cache/cache-get';
import { faker } from '@faker-js/faker';

export class CacheGetSpy implements CacheGet {
  key: string;
  value: any = faker.datatype.json();

  get(key: string): any {
    this.key = key;
    return this.value;
  }
}
