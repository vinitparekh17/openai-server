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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
exports.ErrorHandler = void 0;
const express_1 = __importDefault(require('express'));
const app_1 = require('../app');
const morgan_1 = __importDefault(require('morgan'));
const cors_1 = __importDefault(require('cors'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const Logger_1 = __importDefault(require('../utils/Logger'));
class ErrorHandler {}
exports.ErrorHandler = ErrorHandler;
_a = ErrorHandler;
ErrorHandler.handle = () => {
  return (err, req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).send({
        success: false,
        message: err.message,
        stack: err.stack,
      });
      next();
    });
};
exports.default = {
  init: () => {
    try {
      let stream = { write: (m) => Logger_1.default.http(m) };
      let skip = () => {
        var env = process.env.NODE_ENV || 'development';
        return env !== 'development';
      };
      app_1.app.use(
        (0, morgan_1.default)(
          ':method :url :status :res[content-length] - :response-time ms',
          { stream, skip }
        )
      );
      app_1.app.use((0, cookie_parser_1.default)());
      app_1.app.use(express_1.default.json());
      app_1.app.use(
        (0, cors_1.default)({
          origin: ['http://localhost:3000', 'https://omnisive.technetic.co.in'],
          methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
          credentials: true,
        })
      );
      app_1.app.use(ErrorHandler.handle());
    } catch (error) {
      Logger_1.default.error(error);
    }
  },
};
//# sourceMappingURL=index.js.map
