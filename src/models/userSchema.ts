import { model, Schema } from 'mongoose';
import { UserDocument, UserModel } from '../types/User.types';

const userSchema = new Schema<UserDocument>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    hobbies: { type: [String], required: true }
});

export default model<UserDocument, UserModel>('User', userSchema);