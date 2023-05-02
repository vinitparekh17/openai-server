"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const app_1 = require("../app");
const Logger_1 = __importDefault(require("./Logger"));
const config_1 = require("../config");
require("../lib/Socket");
exports.server = require("http").createServer(app_1.app);
class NodeServer {
    static start() {
        try {
            exports.server.listen(config_1.PORT, () => {
                Logger_1.default.debug(`Server started on port ${process.env.PORT}`);
            });
        }
        catch (error) {
            Logger_1.default.error(error);
        }
    }
}
exports.default = NodeServer;
//# sourceMappingURL=Server.js.map