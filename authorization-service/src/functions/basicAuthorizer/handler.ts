import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent) => {
  console.log('event', event);

  const encodedCreds = event.authorizationToken.split(' ')[1];

  if (!encodedCreds) {
    throw new Error('The token is incorrect');
  }

  const plainCreds = Buffer.from(encodedCreds, 'base64').toString('utf-8').split(':');
  const username = plainCreds[0];
  const password = plainCreds[1];

  if (!username) {
    throw new Error('The token is incorrect');
  }

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
}

export const main = middyfy(basicAuthorizer);
