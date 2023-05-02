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
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_1 = require("../config");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    forgotpasstoken: { type: String },
    forgotpassexpire: { type: Date },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        try {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hash = yield bcryptjs_1.default.hash(this.password, salt);
            this.password = hash;
            this.email = this.email.toLocaleLowerCase();
            next();
        }
        catch (error) {
            console.log(error);
        }
    });
});
userSchema.methods = {
    getForgotToken: function () {
        const forgotToken = node_crypto_1.default.randomBytes(20).toString("hex");
        this.forgotpasstoken = forgotToken;
        this.forgotpassexpire = Date.now() + 60 * 1000;
        return forgotToken;
    },
    validatePassword: function (usersAndPassward) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(usersAndPassward, this.password);
        });
    },
    getJWT: function () {
        return jsonwebtoken_1.default.sign({
            data: {
                id: this._id,
                userName: this.userName,
                email: this.email,
            },
        }, config_1.JWT_SECRET, {
            expiresIn: config_1.JWT_EXPIRY,
        });
    },
};
userSchema.statics = {
    findByEmail: function (email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    },
};
exports.default = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.schema.js.map