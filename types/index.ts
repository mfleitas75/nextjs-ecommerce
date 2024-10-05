export type Product = {
    id?: string;
    name: string;
    slug: string;
    category: string;
    images?: [string];         
    brand: string;
    description: string;
    stock: number;
    price: number;   
    rating: number;
    numReviews: number; 
    isFeatured: boolean;
    banner?: string;
    createdAt: Date;  
}
