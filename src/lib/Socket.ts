import { Server } from 'http';
import { customPayload } from '../types';
import { decodeToken } from '../utils/JwtDecoder';
import { Cache } from './Node-Cache';
import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketServer {
  private io: SocketIOServer;
  private dbId: string = '';
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
          let { data } = decoded as customPayload;
          if (data !== undefined) {
            this.dbId = data.id;
            const suc = Cache.set(data.id, socket.id);
            if (suc) {
              socket.to(data.id).emit('online', true);
            }
          }
        }
      }
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }

  public streamData(data: any) {
    let socketId: string | undefined = Cache.get(this.dbId);
    if (socketId !== undefined) {
      this.io.to(socketId).emit('data', data);
    }
  }
}
