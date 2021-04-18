import 'source-map-support/register';

import { formatJSONResponse, formatServerErrorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productService from '@services/product';

export const getProductsList = async () => {
  console.log('Handler started');

  try {
    const products = await productService.getProductList();

    return formatJSONResponse(products);

  } catch (e) {
    return formatServerErrorResponse(e.message);
  }
}

export const main = middyfy(getProductsList);
