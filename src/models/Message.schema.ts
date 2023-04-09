import { Schema, model } from 'mongoose';
import { MessageDocument, MessageModel } from '../types/Message.types';

const messageSchema = new Schema<MessageDocument>({
    prompt: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true
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