"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const Server_1 = require("../utils/Server");
const socket_io_1 = require("socket.io");
const Logger_1 = __importDefault(require("../utils/Logger"));
exports.io = new socket_io_1.Server(Server_1.server);
exports.io.on("connect", () =>
  Logger_1.default.debug("socket server started!")
);
//# sourceMappingURL=Socket.js.map
