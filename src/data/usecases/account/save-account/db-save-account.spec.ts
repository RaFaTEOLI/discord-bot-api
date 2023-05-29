import { SaveAccountRepository } from './db-save-account-protocols';
import { DbSaveAccount } from './db-save-account';
import MockDate from 'mockdate';
import { mockSaveAccountRepository } from '@/data/test';
import { mockAccountModelWithSpotifyAndDiscord } from '@/domain/test';
import { faker } from '@faker-js/faker';

interface SutTypes {
  sut: DbSaveAccount;
  saveAccountRepositoryStub: SaveAccountRepository;
}

const makeSut = (): SutTypes => {
  const saveAccountRepositoryStub = mockSaveAccountRepository();
  const sut = new DbSaveAccount(saveAccountRepositoryStub);
  return {
    sut,
    saveAccountRepositoryStub
  };
};

describe('DdSaveAccount Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call SaveAccountRepository with correct values', async () => {
    const { sut, saveAccountRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveAccountRepositoryStub, 'save');
    const id = faker.datatype.uuid();
    const data = mockAccountModelWithSpotifyAndDiscord();
    await sut.save(id, data);
    expect(saveSpy).toHaveBeenCalledWith(id, data);
  });
});
