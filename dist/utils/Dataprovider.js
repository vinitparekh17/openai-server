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
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
const Logger_1 = __importDefault(require('./Logger'));
class DataProvider {
  static getData(model) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield model.find();
        if (!data) return [];
        return data;
      } catch (e) {
        Logger_1.default.error(e);
      }
    });
  }
  static getDataBySearch(model, k, v) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield model.find({ k: v });
        if (!data) return [];
        return data;
      } catch (e) {
        Logger_1.default.error(e);
      }
    });
  }
  static getDataByID(model, id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
          return null;
        }
        let data = yield model.findById(id);
        return data;
      } catch (e) {
        Logger_1.default.error(e);
      }
    });
  }
  static getByEmail(model, email) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let data = yield model.findOne({ email });
        return data || null;
      } catch (error) {}
    });
  }
}
exports.default = DataProvider;
//# sourceMappingURL=Dataprovider.js.map
