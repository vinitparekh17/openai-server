import * as AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION } from '../config';

AWS.config.update({ region: REGION });
new AWS.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

export const AWS3 = new AWS.S3({ apiVersion: '2006-03-01' });
