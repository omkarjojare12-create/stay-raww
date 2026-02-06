
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

interface WishlistContextType {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    const addToWishlist = (product: Product) => {
        setWishlistItems(prevItems => {
            if (prevItems.find(item => item.id === product.id)) {
                return prevItems; // Already in wishlist
            }
            return [...prevItems, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId: number): boolean => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
