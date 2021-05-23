import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{'Fn::GetAtt': ['catalogItemsQueue', 'Arn']}]
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {Ref: 'createProductTopic'}
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ENV_STAGE: '${opt:stage, dev}',
      CREATE_PRODUCT_TOPIC_ARN: {
        Ref: 'createProductTopic'
      },
      PGHOST: '${env:PGHOST}',
      PGUSER: '${env:PGUSER}',
      PGDATABASE: '${env:PGDATABASE}',
      PGPASSWORD: '${env:PGPASSWORD}',
      PGPORT: '${env:PGPORT}'
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      'catalogItemsQueue': {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      'createProductTopic': {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      'createPricedProductSubscription': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:NOTIFICATION_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            price: [{numeric: ['>', 0]}]
          }
        }
      },
      'createNotPricedProductSubscription': {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:ADDITIONAL_NOTIFICATION_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            price: [{exists: false}, {numeric: ['<=', 0]}]
          }
        }
      }
    }
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
   },
};

module.exports = serverlessConfiguration;
