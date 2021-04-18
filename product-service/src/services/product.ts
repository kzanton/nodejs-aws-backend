import { Product, CreateProduct } from '@models/product';
import { Client } from 'pg';

async function getProductList(): Promise<Product[]> {
    const client = new Client();

    await client.connect();

    try {
        const result = await client.query(
            'select * from products p left join stocks s on s.product_id = p.id'
        );

        return result.rows;

    } finally {
        client.end();
    }
}

async function getProductsById(productId: string): Promise<Product> {
    const client = new Client();

    await client.connect();

    try {
        const result = await client.query(
            'select * from products p left join stocks s on s.product_id = p.id where p.id = $1',
            [productId]
        );

        return result.rows[0];

    } finally {
        client.end();
    }
}

async function createProduct(data: CreateProduct): Promise<Product> {
    const client = new Client();

    await client.connect();

    try {
        await client.query('BEGIN');

        const productResult = await client.query(
            'INSERT INTO public.products (title, description, image, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [data.title, data.description, data.image, data.price]
        );

        const product = productResult.rows[0];
        product.count = data.count || 0;

        await client.query(
            'INSERT INTO public.stocks (product_id, count) VALUES ($1, $2)',
            [product.id, product.count]
        );

        await client.query('COMMIT');

        return product;

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.end();
    }
}

export default {
    getProductList,
    getProductsById,
    createProduct
}