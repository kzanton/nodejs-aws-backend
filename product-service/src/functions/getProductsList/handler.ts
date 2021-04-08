import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

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

const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  return formatJSONResponse({
    data: mockData
  });
}

export const main = middyfy(getProductsList);
