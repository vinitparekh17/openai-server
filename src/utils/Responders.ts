import { Response } from "express";
import { UserDocument } from "../types/User";

export class Success {
  static send(res: Response, statusCode: number, data: object | string) {
    return res.status(statusCode).json({ success: true, data: data || null });
  }
}

export class Err {
  static send(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({ success: false, message });
  }
}

export class Cookie {
  static send(res: Response, user: UserDocument, statusCode: number) {
    let token = user.getJWT();
    return res
      .status(statusCode)
      .cookie("chatplus-token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ success: true, token });
  }
}
