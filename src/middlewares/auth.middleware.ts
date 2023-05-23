import { Logger } from '../utils/';
import { decodeToken } from '../utils/JwtDecoder';
import { Err } from '../utils/Responders';
import UserSchema from '../models/User.schema';
import { DataProvider } from '../utils/';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest, customPayload } from '../types';

// can i turn above into a class?
export class AuthMiddleware {
  static async requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.cookies['chatplus-token'];
    if (!token) {
      return Err.send(res, 401, 'Unauthorized');
    }
    try {
      const decoded = decodeToken(token);
      if (decoded === 'expired') {
        return Err.send(res, 406, 'Token expired');
      } else if (decoded === 'error') {
        return Err.send(res, 400, 'Invalid token');
      } else if (decoded === 'invalid') {
        return Err.send(res, 400, 'Invalid token');
      } else {
        let { id } = decoded as customPayload;
        let user = await DataProvider.getDataByID(UserSchema, id);
        if (user) {
          req.user = user;
        } else {
          return Err.send(res, 404, 'User not found');
        }
      }
      next();
    } catch (err) {
      Logger.error(err);
    }
  }
}
