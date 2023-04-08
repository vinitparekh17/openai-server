import { model, Schema } from 'mongoose';
import { NextFunction } from 'express'
import bcrypt from 'bcryptjs';
import { UserDocument, UserModel } from '../types/User.types';

const userSchema = new Schema<UserDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
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
        next()
    } catch (error) {
        console.log(error);
    }
})

export default model<UserDocument, UserModel>('User', userSchema);