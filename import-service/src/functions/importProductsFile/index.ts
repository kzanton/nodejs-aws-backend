import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: '${env:BASIC_AUTHORIZER_ARN}',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          managedExternally: false,
          type: 'token',
        }
      }
    }
  ]
}
