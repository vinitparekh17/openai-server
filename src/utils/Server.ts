import type { Server } from "node:http";
import { app } from "../app";
import Logger from "./Logger";
import { PORT } from "../config";
require("../lib/Socket");

export const server: Server = require("http").createServer(app);

export default class NodeServer {
  static start() {
    try {
      server.listen(PORT, () => {
        Logger.debug(`Server started on port ${process.env.PORT}`);
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
