import { MusicModel } from '@/domain/models/music';

export interface LoadMusicRepository {
  load: () => Promise<MusicModel>;
}
