import { model, Schema } from 'mongoose';
import { NextFunction } from 'express'
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { UserDocument, UserModel } from '../types/User.types';

const userSchema = new Schema<UserDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    forgotpasstoken: { type: String },
    forgotpassexpire: { type: Date },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    hobbies: { type: [String], required: true }
});

userSchema.pre<UserDocument>('save', async function (this: UserDocument, next: NextFunction) {
    if(!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash;
        this.email = this.email.toLocaleLowerCase()
        next()
    } catch (error) {
        console.log(error);
    }
})

// genarates token and expiry and saves it
userSchema.methods.getForgotToken = function (): string {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    this.forgotpasstoken = forgotToken;
    this.forgotpassexpire = Date.now() + 60 * 1000
    return forgotToken;
}

export default model<UserDocument, UserModel>('User', userSchema);