import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '../config';

// openai initialization
const configOpenai = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: 'https://api.openai.com/v1',
});

export const openai = new OpenAIApi(configOpenai);
