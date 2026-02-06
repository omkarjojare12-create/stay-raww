
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category, Product, Order, User, OrderStatus, CartItem, Review, DiscountBanner, DiscountCoupon } from '../types';
import { 
    categories as mockCategories, 
    products as mockProducts, 
    orders as mockOrders, 
    users as mockUsers,
    reviews as mockReviews,
    banners as mockBanners,
    discountCoupons as mockCoupons
} from '../services/mockData';
import * as emailService from '../services/emailService';

interface DataContextType {
    categories: Category[];
    products: Product[];
    orders: Order[];
    users: User[];
    reviews: Review[];
    banners: DiscountBanner[];
    coupons: DiscountCoupon[];
    getProductsByCategoryId: (categoryId: number) => Product[];
    getProductById: (productId: number) => Product | undefined;
    addOrder: (userId: number, userName: string, cartItems: CartItem[], totals: { subtotal: number; gstAmount: number; deliveryCharge: number; grandTotal: number }, address: string, phone: string, discountInfo: { code: string | null; amount: number }) => Order;
    updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
    getOrdersByUserId: (userId: number) => Order[];
    addProduct: (productData: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviewCount' | 'isAssured'>) => void;
    deleteProduct: (productId: number) => void;
    updateProduct: (productId: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>) => void;
    addCategory: (categoryData: Omit<Category, 'id'>) => void;
    updateCategory: (categoryId: number, categoryData: Omit<Category, 'id'>) => void;
    deleteCategory: (categoryId: number) => void;
    getReviewsByProductId: (productId: number) => Review[];
    addReview: (reviewData: Omit<Review, 'id'>) => void;
    hasUserPurchasedProduct: (userId: number, productId: number) => boolean;
    hasUserReviewedProduct: (userId: number, productId: number) => boolean;
    addBanner: (bannerData: Omit<DiscountBanner, 'id'>) => void;
    updateBanner: (bannerId: number, bannerData: Omit<DiscountBanner, 'id'>) => void;
    deleteBanner: (bannerId: number) => void;
    addCoupon: (couponData: Omit<DiscountCoupon, 'id'>) => void;
    updateCoupon: (couponId: number, couponData: Partial<Omit<DiscountCoupon, 'id'>>) => void;
    deleteCoupon: (couponId: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [banners, setBanners] = useState<DiscountBanner[]>(mockBanners);
    const [coupons, setCoupons] = useState<DiscountCoupon[]>(mockCoupons);

    const getProductsByCategoryId = (categoryId: number) => {
        return products.filter(p => p.cat_id === categoryId);
    };

    const getProductById = (productId: number) => {
        return products.find(p => p.id === productId);
    };
    
    const getOrdersByUserId = (userId: number) => {
        return orders
            .filter(o => o.user_id === userId)
            .map(order => ({
                ...order,
                items: order.items.map(item => ({
                    ...item,
                    productDetails: getProductById(item.product_id)
                }))
            }))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };

    const addOrder = (userId: number, userName: string, cartItems: CartItem[], totals: { subtotal: number; gstAmount: number; deliveryCharge: number; grandTotal: number }, address: string, phone: string, discountInfo: { code: string | null; amount: number }): Order => {
        const newOrder: Order = {
            id: `SR-${Date.now()}`,
            user_id: userId,
            userName: userName,
            total_amount: totals.grandTotal,
            subtotal: totals.subtotal,
            gst_amount: totals.gstAmount,
            delivery_charge: totals.deliveryCharge,
            discount_code: discountInfo.code ?? undefined,
            discount_amount: discountInfo.amount,
            status: OrderStatus.PLACED,
            created_at: new Date().toISOString(),
            address,
            phone,
            items: cartItems.map((item, index) => ({
                id: Date.now() + index,
                order_id: `SR-${Date.now()}`,
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.discountPrice ?? item.product.price,
                size: item.size,
            })),
        };
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        
        const user = users.find(u => u.id === userId);
        if (user) {
            emailService.sendOrderConfirmationEmail(user, newOrder);
        }
        
        return newOrder;
    };
    
    const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
        let updatedOrder: Order | undefined;
        setOrders(prevOrders => prevOrders.map(o => {
            if (o.id === orderId) {
                updatedOrder = { ...o, status };
                if (status === OrderStatus.RETURN_REQUESTED && reason) {
                    updatedOrder.return_reason = reason;
                }
                return updatedOrder;
            }
            return o;
        }));

        if (updatedOrder) {
            const user = users.find(u => u.id === updatedOrder!.user_id);
            if (user) {
                if (status === OrderStatus.RETURN_REQUESTED) {
                    emailService.sendReturnRequestConfirmationEmail(user, updatedOrder);
                } else {
                    emailService.sendShippingUpdateEmail(user, updatedOrder);
                }
            }
        }
    };

    const addProduct = (productData: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviewCount' | 'isAssured'>) => {
        const newProduct: Product = {
            ...productData,
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            created_at: new Date().toISOString(),
            rating: 0,
            reviewCount: 0,
            isAssured: false,
        };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
    };

    const deleteProduct = (productId: number) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    };
    
    const updateProduct = (productId: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, ...productData, id: p.id, created_at: p.created_at } : p
            )
        );
    };

    const addCategory = (categoryData: Omit<Category, 'id'>) => {
        const newCategory: Category = {
            ...categoryData,
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        };
        setCategories(prevCategories => [newCategory, ...prevCategories]);
    };

    const updateCategory = (categoryId: number, categoryData: Omit<Category, 'id'>) => {
        setCategories(prevCategories =>
            prevCategories.map(c =>
                c.id === categoryId ? { ...c, ...categoryData, id: c.id } : c
            )
        );
    };
    
    const deleteCategory = (categoryId: number) => {
        setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
    };

    const getReviewsByProductId = (productId: number) => {
        return reviews.filter(r => r.productId === productId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const addReview = (reviewData: Omit<Review, 'id'>) => {
        const newReview: Review = {
            ...reviewData,
            id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        };
        setReviews(prev => [newReview, ...prev]);
        setProducts(prevProducts => prevProducts.map(p => {
            if(p.id === reviewData.productId) {
                const productReviews = [newReview, ...getReviewsByProductId(p.id)];
                const newRating = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
                return { ...p, rating: parseFloat(newRating.toFixed(1)), reviewCount: productReviews.length };
            }
            return p;
        }));
    };
    
    const hasUserPurchasedProduct = (userId: number, productId: number): boolean => {
        const userOrders = orders.filter(o => o.user_id === userId && o.status === OrderStatus.DELIVERED);
        for (const order of userOrders) {
            if (order.items.some(item => item.product_id === productId)) {
                return true;
            }
        }
        return false;
    };

    const hasUserReviewedProduct = (userId: number, productId: number): boolean => {
        return reviews.some(review => review.userId === userId && review.productId === productId);
    };

    const addBanner = (bannerData: Omit<DiscountBanner, 'id'>) => {
        const newBanner: DiscountBanner = {
            ...bannerData,
            id: banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1,
        };
        setBanners(prevBanners => [newBanner, ...prevBanners]);
    };

    const updateBanner = (bannerId: number, bannerData: Omit<DiscountBanner, 'id'>) => {
        setBanners(prevBanners =>
            prevBanners.map(b =>
                b.id === bannerId ? { ...b, ...bannerData, id: b.id } : b
            )
        );
    };

    const deleteBanner = (bannerId: number) => {
        setBanners(prevBanners => prevBanners.filter(b => b.id !== bannerId));
    };

    const addCoupon = (couponData: Omit<DiscountCoupon, 'id'>) => {
        const newCoupon: DiscountCoupon = {
            ...couponData,
            id: coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1,
        };
        setCoupons(prev => [newCoupon, ...prev]);
    };

    const updateCoupon = (couponId: number, couponData: Partial<Omit<DiscountCoupon, 'id'>>) => {
        setCoupons(prev =>
            prev.map(c => (c.id === couponId ? { ...c, ...couponData } : c))
        );
    };

    const deleteCoupon = (couponId: number) => {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
    };

    return (
        <DataContext.Provider value={{ 
            categories, products, orders, users, reviews, banners, coupons,
            getProductsByCategoryId, getProductById, 
            addOrder, updateOrderStatus, getOrdersByUserId, 
            addProduct, deleteProduct, updateProduct, 
            addCategory, updateCategory, deleteCategory,
            getReviewsByProductId, addReview,
            hasUserPurchasedProduct, hasUserReviewedProduct,
            addBanner, updateBanner, deleteBanner,
            addCoupon, updateCoupon, deleteCoupon
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
