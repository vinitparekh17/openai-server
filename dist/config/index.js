'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
exports.JWT_EXPIRY =
  exports.JWT_SECRET =
  exports.REGION =
  exports.AWS_SECRET_ACCESS_KEY =
  exports.AWS_ACCESS_KEY_ID =
  exports.OPENAI_API_KEY =
  exports.MONGO_URI =
  exports.PORT =
    void 0;
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
(_a = process.env),
  (exports.PORT = _a.PORT),
  (exports.MONGO_URI = _a.MONGO_URI),
  (exports.OPENAI_API_KEY = _a.OPENAI_API_KEY),
  (exports.AWS_ACCESS_KEY_ID = _a.AWS_ACCESS_KEY_ID),
  (exports.AWS_SECRET_ACCESS_KEY = _a.AWS_SECRET_ACCESS_KEY),
  (exports.REGION = _a.REGION),
  (exports.JWT_SECRET = _a.JWT_SECRET),
  (exports.JWT_EXPIRY = _a.JWT_EXPIRY);
//# sourceMappingURL=index.js.map
