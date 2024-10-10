import { cartItemSchema, shippingAddressSchema } from "@/lib/validator";
import { z } from "zod";

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

export type CartItem = z.infer<typeof cartItemSchema>

export type Cart = {
    id: string;
    userId: string;
    sessionCartId: string;
    items: CartItem[];
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    createdAt: Date;        
}

export type ShippingAddress = z.infer<typeof shippingAddressSchema>