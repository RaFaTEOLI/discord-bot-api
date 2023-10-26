import { mockSaveCommandParams } from '@/domain/test';
import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { CommandMongoRepository } from './command-mongo-repository';
import { describe, test, expect, beforeAll, beforeEach, afterAll } from 'vitest';

const makeSut = (): CommandMongoRepository => {
  return new CommandMongoRepository();
};

let commandCollection: Collection;

describe('Command Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__ ?? '');
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
      const commandParams = mockSaveCommandParams();
      const createdCommand = await sut.save(commandParams);
      const command = await commandCollection.findOne({
        command: createdCommand.command
      });
      expect(command).toBeTruthy();
      expect(createdCommand.command).toBe(commandParams.command);
    });

    test('should update a command on success if it already exists', async () => {
      const sut = makeSut();
      const commandParams = mockSaveCommandParams();
      const result = await commandCollection.insertOne(commandParams);
      const updateParams = mockSaveCommandParams();
      await sut.save({ id: result.insertedId.toString(), ...updateParams });
      const command = await commandCollection.findOne({
        command: updateParams.command
      });
      expect(command).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('should load all commands on success', async () => {
      const commandsToAdd = [mockSaveCommandParams(), mockSaveCommandParams({ withOptions: true })];
      await commandCollection.insertMany(commandsToAdd);
      const sut = makeSut();
      const commands = await sut.loadAll();
      expect(commands.length).toBe(2);
      expect(commands[0].id).toBeTruthy();
      expect(commands[0].command).toBe(commandsToAdd[0].command);
      expect(commands[1].id).toBeTruthy();
      expect(commands[1].command).toBe(commandsToAdd[1].command);
    });

    test('should load empty list', async () => {
      const sut = makeSut();
      const commands = await sut.loadAll();
      expect(commands.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('should load command by id on success', async () => {
      const commandToAdd = mockSaveCommandParams();
      const result = await commandCollection.insertOne(commandToAdd);
      const id = result.insertedId.toString();
      const sut = makeSut();
      const command = await sut.loadById(id);
      expect(command).toBeTruthy();
      expect(command.id).toBeTruthy();
      expect(command.command).toBe(commandToAdd.command);
    });
  });

  describe('loadByName()', () => {
    test('should load command by name on success', async () => {
      const createdCommand = mockSaveCommandParams();
      await commandCollection.insertOne(createdCommand);
      const sut = makeSut();
      const command = await sut.loadByName(createdCommand.command);
      expect(command).toBeTruthy();
      expect(command.id).toBeTruthy();
      expect(command.command).toBe(createdCommand.command);
    });
  });

  describe('deleteById()', () => {
    test('should delete command by id on success', async () => {
      const commandToAdd = mockSaveCommandParams();
      const result = await commandCollection.insertOne(commandToAdd);
      const id = result.insertedId.toString();
      const sut = makeSut();
      const deleted = await sut.deleteById(id);
      const command = await commandCollection.findOne({
        command: commandToAdd.command
      });
      expect(deleted).toBeTruthy();
      expect(command).toBeFalsy();
    });
  });
});
