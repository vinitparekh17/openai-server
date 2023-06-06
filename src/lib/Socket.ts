import { Server } from 'http';
import { Cache } from './Node-Cache';
import { openai } from './Openai';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketMiddleware } from '../middlewares';
import { OpenaiResponse } from '../types';

export class SocketServer {
  static io: SocketIOServer;
  private socket: Socket;
  private cacheKey: string;
  private toUser: string;
  private chunkData: string;
  constructor(server: Server) {
    SocketServer.io = new SocketIOServer(server, {
      cors: {
        origin: ['https://omnisive.technetic.co.in:*', 'http://localhost:*'],
        methods: ['GET', 'POST'],
      },
    });
    this.setupSocket();
  }

  private setupSocket() {
    let { io } = SocketServer;
    io.on('connection', (socket: Socket) => {
      this.socket = socket;
      console.log(`Client ${socket.id} connected`);
      socket.on('request-stream', async (prompt) => {
        try {
          const res = (await openai.createChatCompletion(
            {
              model: 'gpt-3.5-turbo',
              max_tokens: 200,
              temperature: 0.7,
              messages: [{ role: 'user', content: prompt }],
              n: 1,
              stream: true,
            },
            {
              responseType: 'stream',
            }
          )) as unknown as OpenaiResponse;
          this.cacheKey = SocketMiddleware.getIdFromToken(
            SocketMiddleware.getCookieToken(socket)
          );
          this.toUser = Cache.get(this.cacheKey);
          res.data.on('data', (chunk: any) => {
            let { chunkData } = this;
            chunkData = chunk.toString();
            chunkData = chunkData.replace('[DONE]', '"done"');
            chunkData = chunkData.replace('data:', '"data":');
            chunkData = chunkData.replace('\n\ndata:', ',"data":');
            console.log(chunkData);
            SocketServer.io
              .to(this.toUser)
              .emit('response-stream', `{${chunkData}}`);
          });
        } catch (error) {
          console.log(error);
        }
      });
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        this.cacheKey = SocketMiddleware.getIdFromToken(
          SocketMiddleware.getCookieToken(this.socket)
        );
        Cache.del(this.cacheKey);
      });
    });
  }
}
