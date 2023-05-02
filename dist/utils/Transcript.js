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
const Handlebars_1 = __importDefault(require("../lib/Handlebars"));
const Logger_1 = __importDefault(require("./Logger"));
const Message_schema_1 = __importDefault(require("../models/Message.schema"));
const Dataprovider_1 = __importDefault(require("./Dataprovider"));
class Transcript {
    static ganerate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield Dataprovider_1.default.getDataBySearch(Message_schema_1.default, "user", id);
                if (data.length == 0) {
                    return null;
                }
                return (0, Handlebars_1.default)(data);
            }
            catch (error) {
                Logger_1.default.error(error);
            }
        });
    }
}
exports.default = Transcript;
//# sourceMappingURL=Transcript.js.map