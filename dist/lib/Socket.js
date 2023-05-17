'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require('socket.io');
class SocketServer {
  constructor(server) {
    this.io = new socket_io_1.Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
    this.setupSocket();
  }
  setupSocket() {
    this.io.on('connection', (socket) => {
      console.log(`Client ${socket.id} connected`);
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=Socket.js.map
