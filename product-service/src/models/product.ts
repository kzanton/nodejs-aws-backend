export type Product = {
    id: string,
    title: string,
    description?: string,
    image?: string,
    price?: number,
    count?: number
};

export type CreateProduct = {
    title: string,
    description?: string,
    image?: string,
    price?: number,
    count?: number
};