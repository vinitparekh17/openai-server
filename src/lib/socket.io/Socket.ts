import { Server } from 'http';
import { Cache } from '../common/Node-Cache';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketMiddleware } from '../../middlewares';
import { GenerativeModel } from '../google/Vertex';
import { StramSaver } from '../../utils/StreamSaver';

export class SocketServer {
  static io: SocketIOServer;
  private socket: Socket;
  private cacheKey: string;
  private toUser: string;
  protected completeResponse: string;
  constructor(server: Server) {
    SocketServer.io = new SocketIOServer(server, {
      cors: {
        origin: ['https://omnisive.technetic.co.in', 'http://localhost:*'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.setupSocket();
  }

  private setupSocket() {
    let { io } = SocketServer;
    io.on('connect', (socket: Socket) => {
      this.socket = socket;
      console.log(`Client ${socket.id} connected`);
      socket.on('request-stream', async (prompt) => {

        // declare variables for socket...
        let { completeResponse, cacheKey, toUser } = this;
        completeResponse = "";

        try {
          // Get user's id which is the cache key (from cookie)...
          cacheKey = SocketMiddleware.getIdFromToken(
            SocketMiddleware.getCookieToken(socket)
          );

          // Get socket id from cache...
          toUser = Cache.get(cacheKey);

          if (toUser) {
            // Create a response stream...
            const responseStream = await GenerativeModel.generateContentStream({
              contents: [{
                role: "user",
                parts: [{ text: prompt }]
              }]
            })
            // Transmit the response stream to the user...
            for await (const chunks of responseStream.stream) {
              // Emit the response to the user if socket id is found...
              if (chunks.candidates[0].finishReason === 'SAFETY') {
                SocketServer.io
                  .to(toUser)
                  .emit("response-stream", { data: 'Content has been terminated for safety reasons!' });
              } else {
                completeResponse += chunks.candidates[0].content.parts[0].text;
              }
            }

            // Emit the response to the user...
            if (completeResponse !== "") {
              SocketServer.io
                .to(toUser)
                .emit("response-stream", { success: true, data: completeResponse })
            }
          }

          // Save the response stream to the database...
          StramSaver.saveStream(cacheKey, prompt, completeResponse);
        } catch (error: unknown) {
          error instanceof Error && console.error(error.message);
        }
      });
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        this.toUser = null;
        this.completeResponse = "";
        this.cacheKey = SocketMiddleware.getIdFromToken(
          SocketMiddleware.getCookieToken(this.socket)
        );
        Cache.del(this.cacheKey);
        this.cacheKey = '';
      });
    });
  }
}
