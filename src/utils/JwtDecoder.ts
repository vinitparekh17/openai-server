import jwt from 'jsonwebtoken';
import { Logger } from './';
import { JWT_SECRET } from '../config';
import { customPayload } from '../interface/User';

// export const decodeToken = (token: string): jwt.JwtPayload | string => {
//   try {
//     const decoded: jwt.JwtPayload | string = jwt.verify(token, JWT_SECRET!);
//     if (typeof decoded !== 'string') {
//       if (decoded.exp! < Date.now().valueOf() / 1000) {
//         return 'expired';
//       }
//       return decoded;
//     }
//     return 'invalid';
//   } catch (err) {
//     Logger.error(err);
//     return 'error';
//   }
// };

export class JwtHelper {
  static venerateToken(payload: object, expiresIn: string): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn });
  }

  static verifyToken(token: string): jwt.JwtPayload | string {
    try {
      const decoded: jwt.JwtPayload | string = jwt.verify(token, JWT_SECRET!);
      if (typeof decoded !== 'string') {
        if (decoded.exp! < Date.now().valueOf() / 1000) {
          return 'expired';
        }
        return decoded;
      }
    } catch (error: unknown) {
      if(error instanceof Error){
        Logger.error(error);
        return 'error';
      }
    }
  }

  static getUserIdFromToken(token: string): string {
    try {
      let decoded = this.verifyToken(token);
      let { data } = decoded as customPayload;
      return data.id;
    } catch (error: unknown) {
      if(error instanceof Error){
        Logger.error(error);
      }
    }
  }
}