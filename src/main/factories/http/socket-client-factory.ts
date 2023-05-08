import { io, Socket } from 'socket.io-client';
import env from '@/main/config/env';

const url = `http://localhost:${env.port}/`;

export const makeSocketClient = (): Socket => io(url);
