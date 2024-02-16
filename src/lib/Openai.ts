import { OpenAI, ClientOptions } from 'openai';
import { OPENAI_API_KEY } from '../config';

// openai initialization
const configOpenai: ClientOptions = {
  apiKey: OPENAI_API_KEY,
};

export const openai = new OpenAI(configOpenai);
