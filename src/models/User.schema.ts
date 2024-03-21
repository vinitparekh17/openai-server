import { model, Schema } from 'mongoose';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { JWT_SECRET, JWT_EXPIRY } from '../config';
import type { UserDocument, UserModel } from '../interface';

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    trim: true,
  },
  profile: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required!'],
    default: 'USER',
    enum: ['USER', 'ADMIN'],
  },
  forgotpasstoken: { type: String },
  forgotpassexpire: { type: Date },
});

userSchema.pre<UserDocument>(
  'save',
  async function (this: UserDocument, next: NextFunction) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      this.email = this.email.toLocaleLowerCase();
      next();
    } catch (error) {
      console.log(error);
    }
  },
);

userSchema.methods = {
  getForgotToken: function (): string {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    this.forgotpasstoken = forgotToken;
    this.forgotpassexpire = Date.now() + 60 * 1000;
    return forgotToken;
  },

  validatePassword: async function (
    usersAndPassward: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(usersAndPassward, this.password);
  },

  getJWT: function (): string {
    return jwt.sign({
      data: {
        id: this._id
      }
    }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  }
};

userSchema.statics = {
  findByEmail: async function (email: string): Promise<object> {
    return await this.findOne({ email });
  },
};

export default model<UserDocument, UserModel>('User', userSchema);
