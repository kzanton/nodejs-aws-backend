import 'source-map-support/register';

// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse, formatNotFoundResponse, formatServerErrorResponse} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productService from '@services/product';

export const getProductsById = async (event) => {
  try {
    const { id: productId } = event.pathParameters;
    const product = await productService.getProductsById(productId);

    if (!product) {
      return formatNotFoundResponse(`Product (id=${productId}) not found`);
    }

    return formatJSONResponse(product);

  } catch (e) {
    return formatServerErrorResponse(e.message);
  }
}

export const main = middyfy(getProductsById);
