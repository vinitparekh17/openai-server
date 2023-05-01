"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const app_1 = require("../app");
const Database_1 = __importDefault(require("./Database"));
const Logger_1 = __importDefault(require("./Logger"));
const config_1 = require("../config");
require('../lib/Socket');
exports.server = require('http').createServer(app_1.app);
exports.default = {
    start: () => {
        try {
            Database_1.default.init();
            exports.server.listen(config_1.PORT, () => {
                Logger_1.default.debug(`Server started on port ${process.env.PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
};
//# sourceMappingURL=Server.js.map