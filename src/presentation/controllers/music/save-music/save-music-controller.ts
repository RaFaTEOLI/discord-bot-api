import { InvalidParamError } from '@/presentation/errors';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpRequest, HttpResponse, SaveMusic } from './save-music-controller-protocols';
import { Socket } from 'socket.io-client';

export class SaveMusicController implements Controller {
  constructor(private readonly saveMusic: SaveMusic, private readonly socketClient: Socket) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!('name' in httpRequest.body)) {
        return badRequest(new InvalidParamError('name'));
      }
      if (!('duration' in httpRequest.body)) {
        return badRequest(new InvalidParamError('duration'));
      }

      const { name, duration } = httpRequest.body;
      await this.saveMusic.save({ name, duration });

      this.socketClient.emit('music', { name, duration });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
