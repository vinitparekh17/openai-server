import { model, Schema } from 'mongoose';

interface IUser {
    userName: string;
    email: string;
    age: number;
    qualification: string;
    hobbies: string[];
}

const userSchema = new Schema<IUser>({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    qualification: { type: String, required: true },
    hobbies: { type: [String], required: true }
});

export default model<IUser>('User', userSchema);