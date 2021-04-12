import { getProductsById } from './handler';
import productService from '@services/product';
import { products } from '@mocks/products';


describe('The getProductsById handler', () => {
    let spyServiceGetProductsById;

    beforeEach(() => {
        spyServiceGetProductsById = jest.spyOn(productService, 'getProductsById');
    });

    it('should return a product', async () => {
        const product = products[0];
        spyServiceGetProductsById.mockResolvedValue(product);
        const reponse = await getProductsById({pathParameters: {id: product.id}});

        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toBe(JSON.stringify(product));
    });

    it('should handle product not found', async () => {
        spyServiceGetProductsById.mockResolvedValue();
        const reponse = await getProductsById({pathParameters: {id: 999}});

        expect(reponse.statusCode).toBe(404);
    });

    it('should handle product service exception', async () => {
        spyServiceGetProductsById.mockRejectedValue('Exeption message');
        const reponse = await getProductsById({pathParameters: {id: 1}});

        expect(reponse.statusCode).toBe(500);
    });
});
