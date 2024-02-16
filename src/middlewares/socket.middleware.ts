import { io } from '../index';
import type { Socket } from 'socket.io';
import { customPayload } from '../interface';
import { decodeToken } from '../utils/';
import { Cache } from '../lib/common/Node-Cache';

export class SocketMiddleware {
  static init() {
    io.use((socket: Socket, next: any) => {
      try {
        let token: string = SocketMiddleware.getCookieToken(socket);
        if (!token) {
          new Error('Unauthorized');
        } else {
          let decoded = decodeToken(token);
          if (decoded === 'expired') {
            next(new Error('Token expired'));
          } else if (decoded === 'error') {
            next(new Error('Invalid token'));
          } else if (decoded === 'invalid') {
            next(new Error('Invalid token'));
          } else {
            let { data } = decoded as customPayload;
            if (data !== undefined) {
              Cache.set(data.id, socket.id)
                ? next()
                : next(new Error('Cache error'));
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  static getCookieToken(socket: Socket): string {
    try {
      let cookieString = socket.request.headers.cookie;
      const cookieObj: { [key: string]: string } = {};
      if (cookieString !== undefined) {
        cookieString.split(';').forEach((cookie: string) => {
          const [name, value] = cookie.trim().split('=');
          cookieObj[name] = value;
        });
        return cookieObj['chatplus-token'];
      }
    } catch (error) {
      console.log(error);
    }
  }

  static getIdFromToken(CookieToken: string): string {
    try {
      let decoded = decodeToken(CookieToken);
      let { data } = decoded as customPayload;
      return data.id;
    } catch (error) {
      console.log(error);
    }
  }
}
