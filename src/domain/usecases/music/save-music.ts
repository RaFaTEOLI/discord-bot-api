import { MusicModel } from '@/domain/models/music';

export type SaveMusicParams = {
  name: string;
  startedAt?: number;
};

export interface SaveMusic {
  save: (data: SaveMusicParams) => Promise<MusicModel>;
}
