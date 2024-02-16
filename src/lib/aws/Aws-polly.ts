import { PollyClient } from '@aws-sdk/client-polly';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION } from '../../config';

export const pollyClient = new PollyClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
