import 'source-map-support/register';

import { ValidatedEventAPIGatewayProxyEvent, formatServerErrorResponse } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productService from '@services/product';

import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Handler started, body =', event.body);

  try {
    const product = await productService.createProduct(event.body);

    return formatJSONResponse(product);

  } catch (e) {
    return formatServerErrorResponse(e.message);
  }
}

export const main = middyfy(createProduct);
