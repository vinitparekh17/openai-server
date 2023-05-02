"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.generateResponse = void 0;
const Openai_1 = require("../lib/Openai");
const handlers_1 = require("../handlers");
const Dataprovider_1 = __importDefault(require("../utils/Dataprovider"));
const Message_schema_1 = __importDefault(require("../models/Message.schema"));
const Responders_1 = require("../utils/Responders");
const Logger_1 = __importDefault(require("../utils/Logger"));
const Socket_1 = require("../lib/Socket");
exports.generateResponse = (0, handlers_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { prompt } = req.body;
    let { id } = req.params;
    const completionPromise = Openai_1.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 200,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
        n: 1,
        user: id,
        stream: true,
    });
    Socket_1.io.on("connect", () => {
        Logger_1.default.debug("connected to socket!");
        completionPromise
            .then((completion) => Socket_1.io.emit("create_completion", completion))
            .catch((err) => Logger_1.default.error(err));
        Socket_1.io.on("data", (data) => Socket_1.io.emit("completion", data.choices[0].text));
        Socket_1.io.on("error", (e) => Logger_1.default.error(e));
        Socket_1.io.on("disconnect", () => Logger_1.default.debug("Disconnected from socket!"));
    });
}));
exports.getConversation = (0, handlers_1.AsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Dataprovider_1.default.getData(Message_schema_1.default);
    if (!data)
        return Responders_1.Err.send(res, 404, "Data not found!");
    return Responders_1.Success.send(res, 200, data);
}));
//# sourceMappingURL=messageController.js.map