import { Express } from 'express';
import { createServer, Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import env from './env';

export default (app: Express): Server<any, any> => {
  const server = createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: env.appUrl
    }
  });

  io.on('connection', socket => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('music', payload => {
      console.log('🎵: Music Received:', payload);
      io.emit('music', payload);
    });

    socket.on('command', payload => {
      console.log('⚙️: Command Received:', payload);
      io.emit('command', payload);
    });
  });

  return server;
};
