import { Model, Document, Schema } from "mongoose";

interface Message {
    prompt: string;
    answer: string;
    date: Date;
    user: Schema.Types.ObjectId;
};

export interface MessageModel extends Model<MessageDocument> {}
export interface MessageDocument extends Message, Document {
    _id: string
}