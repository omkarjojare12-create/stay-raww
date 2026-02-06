
import { User, Admin, Category, Product, Order, OrderStatus, OrderItem, Review, DiscountBanner, DiscountCoupon } from '../types';

export const users: User[] = [
    { id: 1, name: 'John Doe', phone: '1234567890', email: 'john@example.com', password: 'password123', address: '123 Tech Street, Silicon Valley, CA', created_at: '2023-10-26T10:00:00Z' },
];

export const admin: Admin = { id: 1, username: 'admin', password: 'password' };

export const categories: Category[] = [];

export const banners: DiscountBanner[] = [];

export const products: Product[] = [];

export const reviews: Review[] = [];

const orderItems1: OrderItem[] = [{ id: 101, order_id: 'SR-DELIVERED-1', product_id: 1, quantity: 1, price: 799, size: 'M' }];
const orderItems2: OrderItem[] = [{ id: 201, order_id: 'SR-DELIVERED-2', product_id: 3, quantity: 2, price: 499, size: 'One Size' }];

export const orders: Order[] = [
    {
        id: 'SR-DELIVERED-1', // For Product 1
        user_id: 1,
        total_amount: 883.95,
        subtotal: 799,
        gst_amount: 39.95,
        delivery_charge: 50,
        status: OrderStatus.DELIVERED,
        created_at: '2023-10-15T12:00:00Z',
        address: '123 Tech Street, Silicon Valley, CA',
        phone: '1234567890',
        userName: 'John Doe',
        items: orderItems1,
    },
    {
        id: 'SR-DELIVERED-2', // For Product 3
        user_id: 1,
        total_amount: 1087.9,
        subtotal: 998,
        gst_amount: 49.9,
        delivery_charge: 50,
        status: OrderStatus.DELIVERED,
        created_at: '2023-10-20T12:00:00Z',
        address: '123 Tech Street, Silicon Valley, CA',
        phone: '1234567890',
        userName: 'John Doe',
        items: orderItems2,
    },
];

export const discountCoupons: DiscountCoupon[] = [
    { id: 1, code: 'STAYRAW10', type: 'percentage', value: 10, isActive: true },
    { id: 2, code: 'SAVE50', type: 'fixed', value: 50, isActive: true },
    { id: 3, code: 'FREESHIP', type: 'fixed', value: 50, isActive: false },
];
