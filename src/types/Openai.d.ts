import type { CreateChatCompletionResponse } from 'openai';

export type OpenaiResponse = CreateChatCompletionResponse & {
  data: {
    on: (event: 'data', listener: (chunk: any) => void) => void;
  };
};
