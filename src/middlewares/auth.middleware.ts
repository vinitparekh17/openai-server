import jwt from 'jsonwebtoken';
import Logger from '../utils/Logger';
import { JWT_SECRET } from '../config';
import { Err } from '../utils/Responders';
import UserSchema from '../models/User.schema';
import DataProvider from '../utils/Dataprovider';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest, customPayload } from '../types/index.type';

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.cookies['chatplus-token'];
    if (!token) {
        return Err.send(res, 401, 'Unauthorized');
    }
    try {
        const decoded: jwt.JwtPayload | string = jwt.verify(token, JWT_SECRET!);
        if (typeof decoded !== 'string') {
            if (decoded.exp! < Date.now().valueOf() / 1000) {
                let { id } = (decoded as customPayload)!;
                let user = await DataProvider.getDataByID(UserSchema, id);
                if (user) {
                    req.user = user;
                } else {
                    return Err.send(res, 404, 'User not found');
                }
                return Err.send(res, 400, 'Invalid token');
            }
        }
        next();
    } catch (err) {
        Logger.error(err);
    }
}