import { QueueDeleteCommandParams } from '@/domain/usecases/command/delete-command-by-id';
import { QueueSaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';

export enum Queue {
  MUSIC = 'music',
  QUEUE = 'queue',
  COMMAND = 'command',
  DELETE_COMMAND = 'delete-command'
}

export interface QueueClient<
  DataParams = SaveMusicParams | SaveQueueParams | QueueSaveCommandParams | QueueDeleteCommandParams
> {
  send: (queue: Queue, data: DataParams) => Promise<void>;
}
