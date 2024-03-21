import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config';
import type { GoogleUserDocument } from '../interface';

const GoogleUserSchema = new Schema<GoogleUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    trim: true,
  },
  profile: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    trim: true,
  }
});

GoogleUserSchema.methods = {
  getJWT: function (): string {
    return jwt.sign({
      data: { id: this._id },
    }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  },
};

export default model<GoogleUserDocument>('Google-user', GoogleUserSchema);
