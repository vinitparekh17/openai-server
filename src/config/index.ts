import dotenv from 'dotenv';
dotenv.config();

export const { PORT, MONGO_URI, OPENAI_API_KEY } = process.env;