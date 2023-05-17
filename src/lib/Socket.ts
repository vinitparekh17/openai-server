import { Server } from 'http';
import { customPayload } from '../types/index.type';
import { decodeToken } from '../utils/JwtDecoder';
import { Cache } from './Node-Cache';
import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketServer {
  private io: SocketIOServer;

  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ['https://omnisive.technetic.co.in:*', 'http://localhost:*'],
        methods: ['GET', 'POST'],
      },
    });

    this.setupSocket();
  }

  private setupSocket() {
    this.io.on('connection', (socket: Socket) => {
      let token: string | null = null;
      let cookieString = socket.request.headers.cookie;
      const cookieObj: { [key: string]: string } = {};
      if (cookieString !== undefined) {
        cookieString.split(';').forEach((cookie) => {
          const [name, value] = cookie.trim().split('=');
          cookieObj[name] = value;
        });
        token = cookieObj['chatplus-token'];
      }
      if (!token) {
        socket.disconnect();
      } else {
        let decoded = decodeToken(token);
        if (decoded === 'expired') {
          socket.disconnect();
        } else if (decoded === 'error') {
          socket.disconnect();
        } else if (decoded === 'invalid') {
          socket.disconnect();
        } else {
          let { id } = decoded as customPayload;
          Cache.set(id, socket.id);
          console.log(Cache.get(id));
        }
      }
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }

  public streamData(data: any, toId: string) {
    this.io.to(toId).emit('data', data);
  }
}
