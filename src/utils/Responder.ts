import { Response } from "express";
import { ApiError } from "./ErrorHandler";

export class Responder {
  public response: Response; statusCode: number;
  constructor(res: Response, statusCode?: number) {
    this.response = res;
    this.statusCode = statusCode;
  }
}

export class SuccessRes extends Responder {
  public data: any;
  constructor(res: Response, statusCode: number, data: any) {
    super(res, statusCode)
    this.data = data
    this.statusCode = statusCode | 200
  }
  success() {
    return this.response.status(this.statusCode).json({ success: true, data: this.data || null });
  }
}

export class ErrorRes extends Responder {
  public message: string;
  constructor(res: Response, statusCode: number, message: string) {
    super(res, statusCode)
    this.message = message
    this.statusCode = statusCode | 404
  }
  success() {
    return this.response.status(this.statusCode).json({ success: false, message: this.message});
  }
}