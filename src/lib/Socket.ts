import { server } from "../utils/Server";
import { Server as SocketServer } from "socket.io";
import Logger from "../utils/Logger";

export const io = new SocketServer(server);

io.on("connect", () => Logger.debug("socket server started!"));
