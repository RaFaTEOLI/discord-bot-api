import { QueueModel } from '@/domain/models/queue';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { faker } from '@faker-js/faker';

export const mockQueueModel = (queueCount = 4): QueueModel => {
  const queue = Array.from(new Array(queueCount), () => ({
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    author: faker.name.firstName(),
    duration: faker.random.numeric(5).toString(),
    url: faker.internet.url(),
    thumbnail: faker.internet.url()
  })) as QueueModel;

  return queue;
};

export const mockSaveQueueParams = (queueCount = 4): SaveQueueParams => mockQueueModel(queueCount);
