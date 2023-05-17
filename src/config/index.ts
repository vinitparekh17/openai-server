import dotenv from 'dotenv';
dotenv.config();

export const {
  PORT,
  MONGO_URI,
  OPENAI_API_KEY,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  REGION,
  JWT_SECRET,
  JWT_EXPIRY,
} = process.env;
