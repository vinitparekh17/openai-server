import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketServer {
    private io: SocketIOServer;

    constructor(server: Server) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: 'http://localhost:3000', // replace with your frontend URL
                methods: ['GET', 'POST'],
            },
        });

        this.setupSocket();
    }

    private setupSocket() {
        this.io.on('connection', (socket: Socket) => {
            console.log(`Client ${socket.id} connected`);

            socket.on('disconnect', () => {
                console.log(`Client ${socket.id} disconnected`);
            });
        });
    }

    public streamData(data: any, toId: string) {
        this.io.to(toId).emit('data', data);
    }
}
