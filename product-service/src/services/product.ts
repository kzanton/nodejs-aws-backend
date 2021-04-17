import { Product } from '@models/product';
import { products } from '@mocks/products';

async function getProductList(): Promise<Product[]> {
    return Promise.resolve(products);
}

async function getProductsById(id: string): Promise<Product> {
    const product: Product = products.find(product => product.id === id);
    return Promise.resolve(product);
}

export default {
    getProductList,
    getProductsById
}