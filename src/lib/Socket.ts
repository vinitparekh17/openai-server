import { Server } from 'http';
import { Cache } from './Node-Cache';
import { openai } from './Openai';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketMiddleware } from '../middlewares';
import type { OpenaiResponse, ChunkObj } from '../types';
import { StramSaver } from '../utils/StreamSaver';

export class SocketServer {
  static io: SocketIOServer;
  private socket: Socket;
  private cacheKey: string;
  private toUser: string;
  private chunkData: string;
  private chunkObj: ChunkObj;
  protected completeResponse: Array<string> = [];
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
        this.completeResponse = [];
        this.chunkData = '';
        this.chunkObj = {};
        let { chunkData, chunkObj, completeResponse, cacheKey, toUser } = this;
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
          cacheKey = SocketMiddleware.getIdFromToken(
            SocketMiddleware.getCookieToken(socket)
          );
          toUser = Cache.get(cacheKey);
          res.data.on('data', (chunk: any) => {
            chunkData = chunk.toString();
            chunkData = chunkData.replace('[DONE]', 'false');
            chunkData = chunkData.replace('data:', '"data":');
            chunkData = chunkData.replace('\n\ndata:', ',"data":');

            SocketServer.io
              .to(toUser)
              .emit('response-stream', `{${chunkData}}`);
            try {
              chunkObj = JSON.parse(`{${chunkData}}`);
              if (chunkObj?.data) {
                completeResponse.push(chunkObj.data.choices[0].delta?.content);
              }
            } catch (error) {
              console.log(error);
            }
          });
          res.data.on('end', () => {
            console.log('Cleared or not?', completeResponse.join(''));
            StramSaver.saveStream(cacheKey, prompt, completeResponse.join(''));
            completeResponse = [];
            chunkObj = {};
            chunkData = '';
          });
        } catch (error) {
          console.log(error);
        }
      });
      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        this.toUser = '';
        this.chunkData = '';
        this.chunkObj = {};
        this.completeResponse = [];
        this.cacheKey = SocketMiddleware.getIdFromToken(
          SocketMiddleware.getCookieToken(this.socket)
        );
        Cache.del(this.cacheKey);
      });
    });
  }
}
