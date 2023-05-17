'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.server = void 0;
const app_1 = require('../app');
const Logger_1 = __importDefault(require('./Logger'));
const Socket_1 = require('../lib/Socket');
const config_1 = require('../config');
exports.server = app_1.app.listen(config_1.PORT);
const socketServer = new Socket_1.SocketServer(exports.server);
class NodeServer {
  static start() {
    try {
      Logger_1.default.debug('Starting server...');
      exports.server.on('listening', () => {
        Logger_1.default.debug(`Server started on port ${config_1.PORT}`);
      });
    } catch (error) {
      Logger_1.default.error(error);
    }
  }
}
exports.default = NodeServer;
//# sourceMappingURL=Server.js.map
