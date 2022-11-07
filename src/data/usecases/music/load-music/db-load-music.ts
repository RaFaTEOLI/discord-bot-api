import { LoadMusic, LoadMusicRepository, MusicModel } from './db-load-music-protocols';

export class DbLoadMusic implements LoadMusic {
  constructor(private readonly loadMusicRepository: LoadMusicRepository) {}

  async load(): Promise<MusicModel> {
    const music = await this.loadMusicRepository.load();
    return music;
  }
}
