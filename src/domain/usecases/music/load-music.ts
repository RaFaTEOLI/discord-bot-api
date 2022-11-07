import { MusicModel } from '@/domain/models/music';

export interface LoadMusic {
  load: () => Promise<MusicModel>;
}
