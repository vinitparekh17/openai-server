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
exports.signOut = exports.Protected = exports.passwardReset = exports.forgotPassword = exports.getUser = exports.signIn = exports.signUp = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Dataprovider_1 = __importDefault(require("../utils/Dataprovider"));
const Responders_1 = require("../utils/Responders");
const EmailService_1 = __importDefault(require("../lib/EmailService"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const User_schema_1 = __importDefault(require("../models/User.schema"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        let savedUser = yield User_schema_1.default.findOne({ email });
        if (!savedUser) {
            let newUser = yield User_schema_1.default.create({
                userName: `${firstName} ${lastName}`,
                email,
                password
            });
            return Responders_1.Cookie.send(res, newUser, 201);
        }
        else {
            return Responders_1.Err.send(res, 409, "User with this email already exists! ");
        }
    }
    catch (error) {
        Logger_1.default.error(error);
        Responders_1.Err.send(res, 500, "Internal server error!");
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existUser = yield User_schema_1.default.findOne({ email });
    if (existUser) {
        let matchPass = yield bcryptjs_1.default.compare(password, existUser.password);
        if (matchPass) {
            return Responders_1.Cookie.send(res, existUser, 200);
        }
        return Responders_1.Err.send(res, 400, "Invalid credentials");
    }
    return Responders_1.Err.send(res, 400, "Invalid credentials");
});
exports.signIn = signIn;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let user = yield Dataprovider_1.default.getDataByID(User_schema_1.default, id);
        Responders_1.Success.send(res, 200, user);
    }
    catch (error) {
        Logger_1.default.error(error);
        Responders_1.Err.send(res, 500, "Internal server error");
    }
});
exports.getUser = getUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email } = req.body;
        let existUser = yield Dataprovider_1.default.getByEmail(User_schema_1.default, email);
        if (!existUser) {
            return Responders_1.Err.send(res, 404, 'User with this email does not exists!');
        }
        let token = existUser.getForgotToken();
        yield existUser.save({ validateBeforeSave: false });
        let url = `${req.protocol}://${req.get("host")}/api/passward/reset/${token}`;
        let options = {
            to: email,
            suject: 'Forgot password token',
            content: '',
            html: `Click here to change your password! \n\n<center><a href="${url}" ><button>FORGOT PASSWORD</button></a><center>`
        };
        let emailStatus = new EmailService_1.default(options).sendMail();
        return emailStatus ? Responders_1.Success.send(res, 201, 'Email has been sent to you') : Responders_1.Err.send(res, 401, 'Unable to send email!');
    }
    catch (error) {
        console.log(error);
        return Responders_1.Err.send(res, 500, 'Internal server error!');
    }
});
exports.forgotPassword = forgotPassword;
const passwardReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const encryptedToken = node_crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        // $gt is the classic mongodb query with refers to greater then 
        const foundUser = yield User_schema_1.default.findOne({
            encryptedToken,
            forgotPasswordExpiry: {
                $gt: Date.now()
            }
        });
        if (!foundUser)
            return Responders_1.Err.send(res, 404, 'Token is expired!');
        const { password } = req.body;
        foundUser.password = password;
        foundUser.forgotpasstoken = undefined;
        foundUser.forgotpassexpire = undefined;
        yield foundUser.save();
    }
    catch (error) {
        console.log(error);
    }
});
exports.passwardReset = passwardReset;
const Protected = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_1.default.debug("Protected route triggered");
        return res.status(200).json({ success: true, message: "Protected route triggered" });
    }
    catch (error) {
        Logger_1.default.error(error);
    }
});
exports.Protected = Protected;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        Logger_1.default.debug("Signout route triggered");
        res.clearCookie('chatplus-token');
        return res.status(200).json({ success: true, message: "Signout successfully" });
    }
    catch (error) {
        Logger_1.default.error(error);
    }
});
exports.signOut = signOut;
//# sourceMappingURL=userController.js.map