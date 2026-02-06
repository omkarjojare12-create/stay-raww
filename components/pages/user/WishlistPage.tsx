
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../../context/CartContext';
import { Product } from '../../../types';
import useSEO from '../../../hooks/useSEO';

const WishlistItemCard: React.FC<{ product: Product }> = ({ product }) => {
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // FIX: Added the third argument (size) to `addToCart` as required by its definition.
        // Passing an empty string as a default since size selection isn't available here.
        addToCart(product, 1, '');
        removeFromWishlist(product.id); // Optional: remove from wishlist on adding to cart
    };

    return (
        <div className="flex items-center bg-white p-3 rounded-lg shadow-md">
            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
            <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-800 font-bold">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 ml-2">
                 <button onClick={handleAddToCart} className="text-green-500 hover:text-green-700" title="Add to Cart">
                    <i className="fas fa-cart-plus text-2xl"></i>
                </button>
                <button onClick={() => removeFromWishlist(product.id)} className="text-red-500 hover:text-red-700" title="Remove from Wishlist">
                    <i className="fas fa-trash-alt text-xl"></i>
                </button>
            </div>
        </div>
    );
};

const WishlistPage: React.FC = () => {
    useSEO(
        'My Wishlist | STAY RAW',
        'View and manage your wishlist at STAY RAW. Save your favorite items for later.',
        'STAY RAW, wishlist, saved items, favorite products'
    );
    const { wishlistItems } = useWishlist();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <div className="text-center py-16">
                    <i className="fas fa-heart-broken text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Your wishlist is empty.</p>
                    <ReactRouterDOM.Link to="/" className="mt-4 inline-block bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black">
                        Discover Products
                    </ReactRouterDOM.Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlistItems.map(product => (
                        <WishlistItemCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
