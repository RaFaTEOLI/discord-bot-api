import { MusicModel } from '@/domain/models/music';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';

export interface SaveMusicRepository {
  save: (data: SaveMusicParams) => Promise<MusicModel>;
}
