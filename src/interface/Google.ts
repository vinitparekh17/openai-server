import type { JwtPayload } from 'jsonwebtoken';
import { UserDocument } from './User';
import type { Document } from 'mongoose';

interface GoogleUser extends Document {
  name: string;
  email: string;
  profile: string;
  expire: number;
}

export interface GoogleUserDocument extends GoogleUser, Document {
  getJWT(): string;
}

declare module 'express' {
  interface Request {
    guser: UserDocument | GoogleUserDocument;
  }
}

export type customPayload = JwtPayload & {
  data: {
    id: string;
    name: string;
    email: string;
    profile: Number;
  };
};
