import { io } from '../';
import { customPayload } from '../types';
import { decodeToken } from '../utils/';
import { Cache } from '../lib/Node-Cache';

export class SocketMiddleware {
  static init() {
    io.use((socket, next) => {
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
}
