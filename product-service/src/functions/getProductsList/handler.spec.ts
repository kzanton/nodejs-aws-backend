import { getProductsList } from './handler';
import productService from '@services/product';
import { products } from '@mocks/products';


describe('The getProductList handler', () => {
    let spyServiceGetProductsList;

    beforeEach(() => {
        spyServiceGetProductsList = jest.spyOn(productService, 'getProductList');
    });

    it('should return all products', async () => {
        spyServiceGetProductsList.mockResolvedValue(products);
        const reponse = await getProductsList();

        expect(reponse.statusCode).toBe(200);
        expect(reponse.body).toBe(JSON.stringify(products));
    });

    it('should handle product service exception', async () => {
        spyServiceGetProductsList.mockRejectedValue('Exeption message');
        const reponse = await getProductsList();

        expect(reponse.statusCode).toBe(500);
    });
});
