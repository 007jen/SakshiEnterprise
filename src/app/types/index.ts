export interface ProductVariant {
    id: string;
    productId: string;
    size: string;
    price: number;
    mrp?: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    mrp?: number;
    image: string;
    inStock: boolean;
    variants?: ProductVariant[];
    categoryId: string;
    tags?: string[];
}

export interface Category {
    id: string;
    name: string;
    logo?: string;
    products?: Product[];
}
