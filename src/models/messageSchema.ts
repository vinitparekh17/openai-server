import { Schema, model, Model, Document } from 'mongoose';

interface Message {
    promt: string;
    answer: string;
    date: Date;
    user: Schema.Types.ObjectId;
};

interface MessageDocument extends Message, Document {
    _id: string
}

const messageSchema = new Schema<MessageDocument>({
    promt: {
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

export default model<MessageDocument>('Message', messageSchema);