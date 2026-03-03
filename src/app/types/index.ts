export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    inStock: boolean;
    categoryId: string;
    tags?: string[];
}

export interface Category {
    id: string;
    name: string;
    logo?: string;
    products?: Product[];
}
