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
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const config_1 = require("../config");
const Responders_1 = require("../utils/Responders");
const User_schema_1 = __importDefault(require("../models/User.schema"));
const Dataprovider_1 = __importDefault(require("../utils/Dataprovider"));
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies["chatplus-token"];
        if (!token) {
            return Responders_1.Err.send(res, 401, "Unauthorized");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            if (typeof decoded !== "string") {
                if (decoded.exp < Date.now().valueOf() / 1000) {
                    let { id } = decoded;
                    let user = yield Dataprovider_1.default.getDataByID(User_schema_1.default, id);
                    if (user) {
                        req.user = user;
                    }
                    else {
                        return Responders_1.Err.send(res, 404, "User not found");
                    }
                    return Responders_1.Err.send(res, 400, "Invalid token");
                }
            }
            next();
        }
        catch (err) {
            Logger_1.default.error(err);
        }
    });
}
exports.requireAuth = requireAuth;
//# sourceMappingURL=auth.middleware.js.map