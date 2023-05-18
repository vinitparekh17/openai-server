import type { Server } from 'node:http';
import { app } from './app';
import Logger from './utils/Logger';
import { SocketServer } from './lib/Socket';
import { PORT } from './config';

export const server: Server = app.listen(PORT);
export const socketServer = new SocketServer(server);

export default class NodeServer {
  static start() {
    try {
      Logger.debug('Starting server...');
      server.on('listening', () => {
        Logger.debug(`Server started on port ${PORT}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}

NodeServer.start();
