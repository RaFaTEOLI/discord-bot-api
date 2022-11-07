import { SaveQueue, SaveQueueParams } from '@/domain/usecases/queue/save-queue';
import { SaveQueueRepository } from './db-save-queue-protocols';

export class DbSaveQueue implements SaveQueue {
  constructor(private readonly saveQueueRepository: SaveQueueRepository) {}

  async save(songs: SaveQueueParams): Promise<void> {
    await this.saveQueueRepository.save(songs);
  }
}
