import { MusicModel } from '@/domain/models/music';

export type SaveMusicParams = {
  name: string | null;
  startedAt?: number | null;
  duration: string | null;
};

export interface SaveMusic {
  save: (data: SaveMusicParams) => Promise<MusicModel>;
}
