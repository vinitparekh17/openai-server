import { Schema, model } from 'mongoose';

type Message = {
    promt: string;
    answer: string;
    date: Date;
    user: Schema.Types.ObjectId;
};

const messageSchema = new Schema<Message>({
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

export default model<Message>('Message', messageSchema);