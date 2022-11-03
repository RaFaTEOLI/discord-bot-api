import { mockSaveCommandParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { CommandMongoRepository } from './command-mongo-repository';

const makeSut = (): CommandMongoRepository => {
  return new CommandMongoRepository();
};

let commandCollection: Collection;

describe('Command Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '');
  });

  beforeEach(async () => {
    commandCollection = await MongoHelper.getCollection('commands');
    await commandCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    test('should create a command on success if it does not exist already', async () => {
      const sut = makeSut();
      await sut.save(mockSaveCommandParams());
      const command = await commandCollection.findOne({
        command: 'any_command'
      });
      expect(command).toBeTruthy();
    });

    test('should update a command on success if it already exists', async () => {
      const sut = makeSut();
      const result = await commandCollection.insertOne(mockSaveCommandParams());
      await sut.save({ id: result.insertedId.toString(), ...mockSaveCommandParams() });
      const command = await commandCollection.findOne({
        command: 'any_command'
      });
      expect(command).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('should load all commands on success', async () => {
      await commandCollection.insertMany([
        {
          command: 'any_command',
          dispatcher: 'any_dispatcher',
          type: 'any_type',
          description: 'any_description',
          response: 'any_response',
          message: 'any_message'
        },
        {
          command: 'other_command',
          dispatcher: 'other_dispatcher',
          type: 'other_type',
          description: 'other_description',
          response: 'other_response',
          message: 'other_message'
        }
      ]);
      const sut = makeSut();
      const commands = await sut.loadAll();
      expect(commands.length).toBe(2);
      expect(commands[0].id).toBeTruthy();
      expect(commands[0].command).toBe('any_command');
      expect(commands[1].id).toBeTruthy();
      expect(commands[1].command).toBe('other_command');
    });

    test('should load empty list', async () => {
      const sut = makeSut();
      const commands = await sut.loadAll();
      expect(commands.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('should load command by id on success', async () => {
      const result = await commandCollection.insertOne(mockSaveCommandParams());
      const id = result.insertedId.toString();
      const sut = makeSut();
      const command = await sut.loadById(id);
      expect(command).toBeTruthy();
      expect(command.id).toBeTruthy();
      expect(command.command).toBe('any_command');
    });
  });
});
