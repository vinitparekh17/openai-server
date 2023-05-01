"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId
    }
});
exports.default = (0, mongoose_1.model)('Message', messageSchema);
//# sourceMappingURL=Message.schema.js.map