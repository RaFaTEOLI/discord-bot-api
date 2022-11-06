import { MusicModel } from '@/domain/models/music';

export type SaveMusicParams = Omit<MusicModel, 'id'>;

export interface SaveMusic {
  save: (data: SaveMusicParams) => Promise<MusicModel>;
}
