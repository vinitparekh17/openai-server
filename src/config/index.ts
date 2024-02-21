import dotenv from 'dotenv';
dotenv.config();

export const {
  PORT,
  MONGO_URI,
  
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  REGION,

  JWT_SECRET,
  JWT_EXPIRY,

  RAZORPAY_ID,
  RAZORPAY_SECRET,

  GOOGLE_PROJECT_ID,

  STRIPE_ACCOUNT_ID,
  STRIPE_SECRET,
} = process.env;
