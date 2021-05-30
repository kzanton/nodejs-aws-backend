import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import productService from '@services/product';

const CREATE_PRODUCT_TOPIC_ARN = process.env.CREATE_PRODUCT_TOPIC_ARN;

const sns = new AWS.SNS({
  region: 'eu-west-1'
});

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('Handler started,', event.Records.length);

  for (const record of event.Records) {
    try {
      const data = JSON.parse(record.body);

      console.log('Product data', data);

      await productService.createProduct(data);

      sns.publish({
        Subject: 'The product is added',
        Message: `Hello, ${data.title} is added.\n${data.description}`,
        TopicArn: CREATE_PRODUCT_TOPIC_ARN
      }, (err, data) => {
        if (err) {
          console.error('Notification send failed', err);
        } else {
          console.log('Notification sended', data);
        }
      });

    } catch (err) {
      console.error(err);
    }
  }
}

export const main = middyfy(catalogBatchProcess);
