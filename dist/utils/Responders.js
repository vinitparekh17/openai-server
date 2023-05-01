"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = exports.Err = exports.Success = void 0;
class Success {
    static send(res, statusCode, data) {
        return res.status(statusCode).json({ success: true, data: data || null });
    }
}
exports.Success = Success;
class Err {
    static send(res, statusCode, message) {
        return res.status(statusCode).json({ success: false, message });
    }
}
exports.Err = Err;
class Cookie {
    static send(res, user, statusCode) {
        let token = user.getJWT();
        return res.status(statusCode).cookie('chatplus-token', token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            path: '/', httpOnly: true, sameSite: 'none', secure: true
        }).json({ success: true, token });
    }
}
exports.Cookie = Cookie;
//# sourceMappingURL=Responders.js.map