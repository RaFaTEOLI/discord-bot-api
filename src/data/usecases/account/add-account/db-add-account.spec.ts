/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/indent */
import { DbAddAccount } from './db-add-account';
import { Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/test';
import { describe, test, expect, vi } from 'vitest';

type SutTypes = {
  hasherStub: Hasher;
  sut: DbAddAccount;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null);

  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  };
};

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const encryptSpy = vi.spyOn(hasherStub, 'hash');
    const accountData = mockAddAccountParams();
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('any_password');
  });

  test('should throw exception if Hasher throws exception', async () => {
    const { sut, hasherStub } = makeSut();
    vi.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error());
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add');
    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    });
  });

  test('should throw exception if AddAccountRepository throws exception', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    vi.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error());
    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel());
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
