import type { JwtPayload } from 'jsonwebtoken';
import type { Model, Document } from 'mongoose';

interface User extends Document {
  name: string;
  profile: number;
  email: string;
  password: string;
  role: string;
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

declare module 'express' {
  interface Request {
    user: UserDocument;
  }
}

export interface customPayload extends JwtPayload {
  data: {
    id: string;
    name: string;
    email: string;
    profile: Number;
  };
};
