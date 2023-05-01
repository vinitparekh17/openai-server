"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("./middlewares"));
const user_1 = __importDefault(require("./routes/user"));
const chat_1 = __importDefault(require("./routes/chat"));
exports.app = (0, express_1.default)();
middlewares_1.default.init();
exports.app.use("/api/user", user_1.default);
exports.app.use("/api/chat", chat_1.default);
exports.app.use('*', (req, res) => {
    const err = Error(`Requested path: ${req.path} not found!`);
    res.status(404).json({
        success: false,
        message: err.message,
        stack: err.stack
    });
});
//# sourceMappingURL=app.js.map