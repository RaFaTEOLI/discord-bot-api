import { SaveMusicParams } from '@/domain/usecases/music/save-music';
import { Socket } from 'socket.io-client';

export interface SocketClient {
  emit: (data: SaveMusicParams) => void;
}

export const mockSocketClient = (): Socket => {
  class SocketClientStub implements SocketClient {
    emit(data: SaveMusicParams): void {}
  }
  return new SocketClientStub() as Socket;
};
