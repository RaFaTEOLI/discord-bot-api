import { SaveMusic, SaveMusicParams } from '@/domain/usecases/music/save-music';
import { SaveMusicRepository, MusicModel } from './db-save-music-protocols';

export class DbSaveMusic implements SaveMusic {
  constructor(private readonly saveMusicRepository: SaveMusicRepository) {}

  async save(data: SaveMusicParams): Promise<MusicModel> {
    const musicData = Object.assign({}, data, {
      startedAt: Math.floor(Date.now() / 1000)
    });
    const music = await this.saveMusicRepository.save(musicData);
    console.log({ musicSent: musicData, musicReceived: music });
    return music;
  }
}
