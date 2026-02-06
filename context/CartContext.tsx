
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useData } from './DataContext';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number, size: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    subtotal: number;
    gstAmount: number;
    deliveryCharge: number;
    grandTotal: number;
    cartCount: number;
    applyDiscountCode: (code: string) => boolean;
    removeDiscount: () => void;
    discountAmount: number;
    appliedCode: string | null;
    discountError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { coupons } = useData();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountError, setDiscountError] = useState<string | null>(null);

    const subtotal = cartItems.reduce((total, item) => {
        const price = item.product.discountPrice ?? item.product.price;
        return total + price * item.quantity;
    }, 0);

    const applyDiscountCode = (code: string): boolean => {
        const upperCaseCode = code.toUpperCase();
        setDiscountError(null);
        
        const validCoupon = coupons.find(c => c.code.toUpperCase() === upperCaseCode && c.isActive);

        if (validCoupon) {
            let calculatedDiscount = 0;
            if (validCoupon.type === 'percentage') {
                calculatedDiscount = subtotal * (validCoupon.value / 100);
            } else {
                calculatedDiscount = validCoupon.value;
            }
            
            calculatedDiscount = Math.min(calculatedDiscount, subtotal);

            setDiscountAmount(calculatedDiscount);
            setAppliedCode(upperCaseCode);
            return true;
        } else {
            setDiscountError('Invalid or expired discount code.');
            setDiscountAmount(0);
            setAppliedCode(null);
            return false;
        }
    };

    const removeDiscount = () => {
        setAppliedCode(null);
        setDiscountAmount(0);
        setDiscountError(null);
    };

    const addToCart = (product: Product, quantity: number, size: string) => {
        const cartItemId = `${product.id}-${size}`;
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === cartItemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { id: cartItemId, product, quantity, size }];
        });
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity } : item
                )
            );
        }
    };

    const removeFromCart = (cartItemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    };

    const clearCart = () => {
        setCartItems([]);
        removeDiscount();
    };

    const gstAmount = subtotal * 0.05;
    const deliveryCharge = subtotal > 0 ? 50 : 0;
    const grandTotal = subtotal + gstAmount + deliveryCharge - discountAmount;
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            clearCart, 
            subtotal,
            gstAmount,
            deliveryCharge,
            grandTotal,
            cartCount,
            applyDiscountCode,
            removeDiscount,
            discountAmount,
            appliedCode,
            discountError
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
