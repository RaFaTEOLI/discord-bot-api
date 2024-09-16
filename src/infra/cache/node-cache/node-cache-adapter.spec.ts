import { describe, expect, MockedFunction, test, vi } from 'vitest';
import { NodeCacheAdapter } from './node-cache-adapter';
import { faker } from '@faker-js/faker';
import NodeCache from 'node-cache';

vi.mock('node-cache');

type SutTypes = {
  sut: NodeCacheAdapter;
  cache: NodeCache;
};

const makeSut = (): SutTypes => {
  return { sut: new NodeCacheAdapter(), cache: new NodeCache() };
};

describe('NodeCacheAdapter', () => {
  test('should call get with correct key', () => {
    const { sut, cache } = makeSut();
    const key = faker.database.column();
    sut.get(key);
    expect(cache.get).toHaveBeenCalledWith(key);
  });

  test('should return value on get success', () => {
    const { sut, cache } = makeSut();
    const returnValue = faker.datatype.json();
    (cache.get as MockedFunction<any>).mockReturnValueOnce(returnValue);
    const value = sut.get(faker.database.column());
    expect(value).toEqual(returnValue);
  });
});
