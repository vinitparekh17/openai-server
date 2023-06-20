import type { CreateChatCompletionResponse } from 'openai';

type event = 'data' | 'end' | 'error';

export type OpenaiResponse = CreateChatCompletionResponse & {
  data: {
    on: (event: event, listener: (chunk: any) => void) => void;
  };
};
