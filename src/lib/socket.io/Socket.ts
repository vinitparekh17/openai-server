import { Server } from 'http';
import { Cache } from '../node-cache';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SocketMiddleware } from '../../middlewares';
import { GenerativeModel } from '../google/vertex';
import { StramSaver } from '../../utils/StreamSaver';
import { JwtHelper, Logger } from '../../utils';
import { speechClient } from '../google/speech';
import { AiResponder } from '../../utils/AiResponder';
import { StreamType } from '../../interface/Stream';
import { pollyClient, pollyCommand } from '../aws/polly';

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
        credentials: true,
      },
    });
    this.setupSocket();
  }

  private setupSocket() {
    let { io } = SocketServer;
    io.on('connect', (socket: Socket) => {
      this.socket = socket;
      Logger.debug(`Client ${socket.id} connected`);

      socket.on('request-stream', async (prompt: string) => {

        try {

          this.completeResponse = await AiResponder(prompt);
          this.EmitResponse(prompt, this.completeResponse, StreamType.TEXT);

          // Save the response stream to the database...
        } catch (error: unknown) {
          error instanceof Error && console.error(error.message);
        }
      });

      socket.on('audio-stream', async (data: { audio: Int16Array, sampleRateHertz: number }) => {

        speechClient.recognize({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: data.sampleRateHertz || 16000,
            languageCode: 'en-US',
          },
          audio: {
            content: new Uint8Array(data.audio),
          }
        })
          .then(([response]) => {
            const prompt = response.results
              .map(prompt => prompt.alternatives[0].transcript)
              .join('\n');

            AiResponder(prompt)
              .then(completeResponse => {
                this.EmitResponse(prompt, completeResponse, StreamType.AUDIO);
              })
              .catch(error => {
                console.error('Error:', error);
              });

          })
          .catch(error => {
            console.error('Error:', error);
          })

      });

      socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        this.toUser = null;
        this.completeResponse = "";
        this.cacheKey = JwtHelper.getUserIdFromToken(
          SocketMiddleware.getCookieToken(this.socket)
        );
        Cache.del(this.cacheKey);
        this.cacheKey = '';
      });
    });
  }

  private async EmitResponse(prompt: string, completeResponse: string, streamType: StreamType) {
    let { toUser, cacheKey, socket } = this;

    cacheKey = JwtHelper.getUserIdFromToken(
      SocketMiddleware.getCookieToken(socket)
    );

    // Get socket id from cache...
    toUser = Cache.get(cacheKey);

    if (toUser) {

      if (completeResponse !== "" && completeResponse !== 'SAFETY') {

        switch (streamType) {
          case StreamType.TEXT:
            SocketServer.io
              .to(toUser)
              .emit("response-stream", {
                type: streamType,
                answer: completeResponse
              });
            break;

          case StreamType.AUDIO:

            pollyClient.send(pollyCommand(completeResponse))
              .then(response => {
                const audioStream = response.AudioStream.transformToByteArray();
                audioStream.then(audioStream => {
                  SocketServer.io
                    .to(toUser)
                    .emit("response-stream", {
                      type: streamType,
                      answer: completeResponse,
                      prompt,
                      audioStream
                    })
                })
              }).catch(error => {
                console.error(error.message);
              })
            break;
        }

        StramSaver.saveStream(cacheKey, prompt, completeResponse);

      } else {

        SocketServer.io
          .to(toUser)
          .emit("response-stream", { data: `I'm sorry, I cannot respond to that` });

      }

    }
  }
}
