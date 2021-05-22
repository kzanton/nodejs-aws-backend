import 'source-map-support/register';

import { formatJSONResponse, formatServerErrorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';

const UPLOADS_BUCKET_NAME = process.env.UPLOADS_BUCKET_NAME;

export const importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({region: 'eu-west-1'});
    const { name } = event.queryStringParameters;

    const putUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: UPLOADS_BUCKET_NAME,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    });

    return formatJSONResponse({
      url: putUrl
    });
  } catch (err) {
    console.error(err);
    return formatServerErrorResponse(err.message);
  }
}

export const main = middyfy(importProductsFile);
