
export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    password?: string; // Should not be sent to client, but useful for creation
    address?: string;
    isAdmin?: boolean;
    created_at: string;
}

export interface Admin {
    id: number;
    username: string;
    password?: string;
}

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface DiscountBanner {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string;
}

export interface Product {
    id: number;
    cat_id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number; // Optional discount price
    stock: number;
    image: string;
    created_at: string;
    rating: number;
    reviewCount: number;
    isAssured: boolean;
    sizes?: string[];
}

export interface CartItem {
    id: string; // Unique identifier for cart item, e.g., 'productId-size'
    product: Product;
    quantity: number;
    size: string;
}

export enum OrderStatus {
    PLACED = 'Placed',
    DISPATCHED = 'Dispatched',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
    RETURN_REQUESTED = 'Return Requested',
    RETURNED = 'Returned'
}

export interface Order {
    id: string; // Using string for more realistic order IDs like 'SR-12345'
    user_id: number;
    total_amount: number; // This will be the grand total
    subtotal: number;
    gst_amount: number;
    delivery_charge: number;
    status: OrderStatus;
    created_at: string;
    address: string;
    phone: string;
    userName: string;
    items: OrderItem[];
    discount_code?: string;
    discount_amount?: number;
    return_reason?: string;
}

export interface OrderItem {
    id: number;
    order_id: string;
    product_id: number;
    quantity: number;
    price: number;
    size: string;
    productDetails?: Product; // Populated for display
}

export interface Review {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    isLoading?: boolean;
}

export interface DiscountCoupon {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
}
