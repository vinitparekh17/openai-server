import type { Model, Document } from "mongoose";

export interface User {
    userName: string;
    email: string;
    password: string;
    forgotpasstoken: string;
    forgotpassexpire: Date;
}

export interface UserModel extends Model<UserDocument> {}
export interface UserDocument extends User, Document {
    _id: string
}