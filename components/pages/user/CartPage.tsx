
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { CartItem } from '../../../types';
import useSEO from '../../../hooks/useSEO';

const CartPage: React.FC = () => {
    useSEO(
        'Shopping Cart | STAY RAW',
        'Review and manage items in your shopping cart at STAY RAW. Proceed to secure checkout.',
        'STAY RAW, shopping cart, checkout, my cart'
    );
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart, 
        subtotal, 
        gstAmount, 
        deliveryCharge, 
        grandTotal 
    } = useCart();
    const { addToWishlist } = useWishlist();
    const navigate = ReactRouterDOM.useNavigate();

    const handleMoveToWishlist = (item: CartItem) => {
        addToWishlist(item.product);
        removeFromCart(item.id);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                    <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Your cart is empty.</p>
                    <ReactRouterDOM.Link to="/" className="mt-4 inline-block bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black">
                        Start Shopping
                    </ReactRouterDOM.Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-start">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain rounded-md mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                                        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <p className="text-gray-800 font-bold">₹{(item.product.discountPrice ?? item.product.price).toLocaleString('en-IN')}</p>
                                            {item.product.discountPrice && (
                                                <p className="text-gray-500 line-through text-sm">₹{item.product.price.toLocaleString('en-IN')}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">In Stock: {item.product.stock}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                    <div className="flex items-center">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded-l-md font-semibold">-</button>
                                        <input
                                            type="number"
                                            className="w-12 h-8 text-center border-t border-b focus:outline-none"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                let newQuantity = parseInt(e.target.value) || 1;
                                                if (newQuantity < 1) newQuantity = 1;
                                                if (newQuantity > item.product.stock) newQuantity = item.product.stock;
                                                updateQuantity(item.id, newQuantity);
                                            }}
                                            min="1"
                                            max={item.product.stock}
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="w-8 h-8 border rounded-r-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleMoveToWishlist(item)} className="text-sm font-semibold text-gray-600 hover:text-yellow-500">
                                            MOVE TO WISHLIST
                                        </button>
                                        <button onClick={() => removeFromCart(item.id)} className="text-sm font-semibold text-gray-600 hover:text-red-500">
                                            REMOVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="sticky top-20">
                            <div className="p-4 bg-white rounded-lg shadow-lg">
                                <h2 className="text-lg font-bold border-b pb-2 mb-3">Price Details</h2>
                                <div className="space-y-2 text-gray-700">
                                     <div className="flex justify-between">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>GST (5%)</span>
                                        <span>+ ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                     <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span>+ ₹{deliveryCharge.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t pt-3 mt-2 flex justify-between font-bold text-gray-900 text-lg">
                                        <span>Total Amount</span>
                                        <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
