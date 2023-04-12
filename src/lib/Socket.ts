import { server } from "../utils/Server";
import { Server as SocketServer } from "socket.io";

export const io: SocketServer =require('socket.io')(server);

io.on('connection', () => {
    io.emit('message', 'Connected to server!')
})