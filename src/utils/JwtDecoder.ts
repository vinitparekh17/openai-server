import jwt from 'jsonwebtoken';
import { Logger } from './';
import { JWT_SECRET } from '../config';

export const decodeToken = (token: string): jwt.JwtPayload | string => {
  try {
    const decoded: jwt.JwtPayload | string = jwt.verify(token, JWT_SECRET!);
    if (typeof decoded !== 'string') {
      if (decoded.exp! < Date.now().valueOf() / 1000) {
        return 'expired';
      }
      return decoded;
    }
    return 'invalid';
  } catch (err) {
    Logger.error(err);
    return 'error';
  }
};
