import { mockAddAccountParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';
import { faker } from '@faker-js/faker';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add(mockAddAccountParams());
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(mockAddAccountParams());
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne(mockAddAccountParams());
      await sut.updateAccessToken(result.insertedId.toString(), 'any_token');
      const account = await accountCollection.findOne({
        _id: result.insertedId
      });
      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    test('should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token'
        })
      );
      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    test('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
          role: 'admin'
        })
      );
      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    test('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token'
        })
      );
      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeFalsy();
    });

    test('should return an account on loadByToken if user admin and no role is provided', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
          role: 'admin'
        })
      );
      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');
      expect(account).toBeNull();
    });
  });

  describe('save()', () => {
    test('should update the name on save success', async () => {
      const sut = makeSut();
      const accountParams = mockAddAccountParams();
      const result = await accountCollection.insertOne(accountParams);
      const newName = faker.name.firstName();
      const id = result.insertedId.toString();
      await sut.save(id, { name: newName });
      const account = await accountCollection.findOne({
        _id: result.insertedId
      });
      expect(account).toBeTruthy();
      expect(account.name).toBe(newName);
    });
  });
});
