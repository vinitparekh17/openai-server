import { Model, Document } from "mongoose";

interface User {
    userName: string;
    email: string;
    age: number;
    qualification: string;
    hobbies: string[];
}

export interface UserModel extends Model<UserDocument> {}
export interface UserDocument extends User, Document {
    _id: string
}