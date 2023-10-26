import { SaveCommandParams } from '@/domain/usecases/command/save-command';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { SaveQueueParams } from '@/domain/usecases/queue/save-queue';

export interface QueueClient<R = SaveMusicParams | SaveQueueParams | SaveCommandParams> {
  send: (queue: 'music' | 'queue' | 'command', data: R) => Promise<void>;
}
