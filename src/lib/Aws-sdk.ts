import * as AWS from 'aws-sdk';
import Logger from '../utils/Logger';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../config';

AWS.config.update({ region: 'ap-south-1' })
new AWS.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

export const AWS3 = () => {
    try {
        return new AWS.S3({
            apiVersion: '2006-03-01'
        })
    } catch (error) {
        Logger.error("s3 error "+error)
    }
}