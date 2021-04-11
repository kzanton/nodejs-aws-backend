import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatServerErrorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productService from '@services/product';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<null> = async () => {
  try {
    const products = await productService.getProductList();

    return formatJSONResponse(products);

  } catch (e) {
    return formatServerErrorResponse(e.message);
  }
}

export const main = middyfy(getProductsList);
