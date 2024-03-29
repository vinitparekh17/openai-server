import { Response, Request } from 'express';
import { UserDocument } from '../interface/User';
import { GoogleUserDocument } from '../interface';

export class Success {
  static send(res: Response, statusCode: number, data: object | string): Response {
    return res.status(statusCode).json({ success: true, data: data || null });
  }
}

export class Err {
  static send(res: Response, statusCode: number, message: string): Response {
    return res.status(statusCode).json({ success: false, message });
  }
}

export class Cookie {
  static send(
    res: Response,
    _: Request,
    user: UserDocument | GoogleUserDocument,
    statusCode: number,
  ): Response {
    let token = user.getJWT();
    return res
      .status(statusCode)
      .cookie('chatplus-token', token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .json({ success: true, data: user });
  }
}
