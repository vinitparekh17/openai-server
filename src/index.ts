import type { Server } from 'node:http';
import { Cache } from './lib/common/Node-Cache';
import { app } from './app';
import { Logger } from './utils/';
import { SocketServer } from './lib/socket.io/Socket';
import { PORT } from './config';

export const server: Server = app.listen(PORT);
export const socketServer = new SocketServer(server);
export const { io } = SocketServer;
class NodeServer {
  static start() {
    try {
      Logger.debug('Starting server...');
      Cache.flushAll();
      setInterval(() => {
        Cache.flushAll();
      }, 1000 * 60 * 60 * 24);
      server.on('listening', () => {
        Logger.debug(`Server started on port ${PORT}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}

NodeServer.start();
