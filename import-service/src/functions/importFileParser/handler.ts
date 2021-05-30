import 'source-map-support/register';

import csvParser from 'csv-parser';
import * as AWS from 'aws-sdk';
import type { S3Event } from "aws-lambda"
import { middyfy } from '@libs/lambda';

const UPLOADS_BUCKET_NAME = process.env.UPLOADS_BUCKET_NAME;
const CATALOG_ITEMS_QUEUE_URL = process.env.CATALOG_ITEMS_QUEUE_URL;

const s3 = new AWS.S3({
  region: 'eu-west-1'
});

const sqs = new AWS.SQS({
  region: 'eu-west-1'
});

const sendToCataligItemsQueue = (data) => {
  try {
    sqs.sendMessage({
      QueueUrl: CATALOG_ITEMS_QUEUE_URL,
      MessageBody: JSON.stringify(data)
    }, (err, data) => {
      if (err) {
        console.error('Parsed product send failed', err);
      } else {
        console.log('Parsed product sended,', data);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

const importFileParser = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const fileKey = record.s3.object.key;

      const handleRecord = async (data) => {
        console.log('csv data', data);
        sendToCataligItemsQueue(data);
      }

      const handleError = async (err) => {
        console.error('scv error', err)
      }

      const moveFile = async () => {
        try {
          await s3.copyObject({
            CopySource: `${UPLOADS_BUCKET_NAME}/${fileKey}`,
            Bucket: UPLOADS_BUCKET_NAME,
            Key: fileKey.replace('uploaded/', 'parsed/')
          }).promise();

          await s3.deleteObject({
            Bucket: UPLOADS_BUCKET_NAME,
            Key: fileKey
          }).promise();
        } catch (err) {
          console.error(err);
        }
      }

      const fileObject = s3.getObject({
        Bucket: UPLOADS_BUCKET_NAME,
        Key: fileKey
      });

      fileObject.createReadStream().pipe(csvParser({
        separator: ';',
        mapValues: ({ header, value }) => {
          switch (header) {
            case 'price':
            case 'count':
              return parseInt(value) || 0;
            default :
              return value;
          }
        }
      }))
        .on('data', handleRecord)
        .on('error', handleError)
        .on('end', moveFile);
    }
  } catch (err) {
    console.error(err);
  }
}

export const main = middyfy(importFileParser);
