import { SaveMusicRepository } from '@/data/protocols/db/music/save-command-repository';
import { MusicModel } from '@/domain/models/music';
import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class MusicMongoRepository implements SaveMusicRepository {
  async save(data: SaveMusicParams): Promise<MusicModel> {
    const musicCollection = await MongoHelper.getCollection('music');
    const result = await musicCollection.findOneAndUpdate(
      {},
      {
        $set: {
          name: data.name,
          startedAt: data.startedAt
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );
    return MongoHelper.format(result.value);
  }
}
