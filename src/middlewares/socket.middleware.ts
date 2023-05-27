import { io } from '../';
import type { Socket } from 'socket.io';
import { customPayload } from '../types';
import { decodeToken } from '../utils/';
import { Cache } from '../lib/Node-Cache';

export class SocketMiddleware {
  static init() {
    io.use((socket: Socket, next) => {
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
    });
  }

  static getCookieToken(socket: Socket): string {
    let cookieString = socket.request.headers.cookie;
    const cookieObj: { [key: string]: string } = {};
    if (cookieString !== undefined) {
      cookieString.split(';').forEach((cookie: string) => {
        const [name, value] = cookie.trim().split('=');
        cookieObj[name] = value;
      });
      return cookieObj['chatplus-token'];
    }
  }

  static getIdFromToken(CookieToken: string): string {
    let decoded = decodeToken(CookieToken);
    let { data } = decoded as customPayload;
    return data.id;
  }
}
