import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import type { Model, Document } from 'mongoose';

interface User extends Document {
  userName: string;
  email: string;
  password: string;
  forgotpasstoken: string;
  forgotpassexpire: Date;
}

export interface UserDocument extends User, Document {
  getForgotToken(): string;
  validatePassword(): Promise<boolean>;
  getJWT(): string;
}

export interface UserModel extends Model<UserDocument> {
  // static methods goes here like find by email etc.
  findByEmail(): Promise<object>;
}

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

export type customPayload = JwtPayload & {
  _id?: string;
};
