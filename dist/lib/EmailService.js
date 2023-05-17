'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const nodemailer_1 = require('nodemailer');
class EmailService {
  constructor(option) {
    this.transporter = (0, nodemailer_1.createTransport)({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: '',
        pass: '',
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3',
      },
    });
    this.optionData = option;
  }
  sendMail() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.transporter.sendMail(this.optionData);
        return true;
      } catch (error) {
        return false;
        console.log(error);
      }
    });
  }
}
exports.default = EmailService;
//# sourceMappingURL=EmailService.js.map
