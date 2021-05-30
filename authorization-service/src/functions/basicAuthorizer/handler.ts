import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log('event', event);

  if (event.type !== 'TOKEN') {
    throw new Error('Unauthorized');
  }

  try {
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const plainCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];
    const accessPassword = process.env[username];
    const effect = accessPassword && accessPassword === password ? 'Allow' : 'Deny';

    console.log(`username=${username} password=${password} effect=${effect}`);

    return {
      principalId: encodedCreds,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: event.methodArn
          }
        ],
      },
    };

  } catch (e) {
    console.error(e.message);
    throw new Error(`Unauthorized. ${e.message}`);
  }
}

export const main = middyfy(basicAuthorizer);
