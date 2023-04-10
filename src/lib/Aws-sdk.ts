import * as AWS from 'aws-sdk';
import * as async from 'async';

const S3: AWS.S3 = new AWS.S3({
    apiVersion: ''
})

AWS.config.update({
    region: ''
})