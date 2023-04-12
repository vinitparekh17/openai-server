import { Schema, model } from 'mongoose';
import { MessageDocument, MessageModel } from '../types/Message.types';

const messageSchema = new Schema<MessageDocument>({
    prompt: {
        content: { type: String, required: true },
        timeStamp: { type: Date, default: Date.now() }
    },
    answer: {
        content: { type: String, required: true },
        timeStamp: { type: Date, default: Date.now() }
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        ref: 'User',
        type: Schema.Types.ObjectId
    }
});

export default model<MessageDocument, MessageModel>('Message', messageSchema);