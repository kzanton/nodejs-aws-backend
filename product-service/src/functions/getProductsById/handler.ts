import 'source-map-support/register';

const mockData: Array<any> = [
  {
    id: 1,
    name: "Product 1"
  },
  {
    id: 2,
    name: "Product 2"
  },
  {
    id: 3,
    name: "Product 3"
  },
  {
    id: 4,
    name: "Product 4"
  }
];

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const hello: ValidatedEventAPIGatewayProxyEvent<null> = async (event) => {
  const { id } = event.pathParameters;
  const product = mockData.find(product => product.id == id);

  return formatJSONResponse({
    data: product,
    error: product ? undefined : 'Product not found'
  });
}

export const main = middyfy(hello);
