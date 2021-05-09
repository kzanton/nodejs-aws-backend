import { importProductsFile } from './handler';
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk";


describe('The importProductsFile handler', () => {

    it('should return url with given file name', async () => {
        const fileName = 'testfilename';

        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrlPromise', async (_operation, params) => {
            return `https://bucket.s3.amazonaws.com/${params.Key}`;
        });

        const reponse = await importProductsFile({
            queryStringParameters: {
                name: fileName
            }
        });

        expect(reponse.statusCode).toBe(200);
        expect(JSON.parse(reponse.body).url).toEqual(expect.stringContaining(fileName));

        AWSMock.restore('DynamoDB');
    });

    it('should handle exception', async () => {
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('S3', 'getSignedUrlPromise', async () => {
            return Promise.reject(new Error());
        });

        const reponse = await importProductsFile({
            queryStringParameters: {
                name: 'testfilename'
            }
        });

        expect(reponse.statusCode).toBe(500);

        AWSMock.restore('S3');
    });
});
