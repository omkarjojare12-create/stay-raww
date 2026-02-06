
import React, { useState, FormEvent } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useData } from '../../../context/DataContext';
import { LoadingModal } from '../../common/LoadingSpinner';
import useSEO from '../../../hooks/useSEO';

const CheckoutPage: React.FC = () => {
    useSEO(
        'Secure Checkout | STAY RAW',
        'Complete your purchase securely. Enter your shipping and payment details to order from STAY RAW.',
        'STAY RAW, checkout, secure payment, shipping details, place order'
    );
    const { currentUser } = useAuth();
    const { 
        cartItems, 
        subtotal, 
        gstAmount, 
        deliveryCharge, 
        grandTotal, 
        clearCart,
        applyDiscountCode,
        removeDiscount,
        discountAmount,
        appliedCode,
        discountError
    } = useCart();
    const { addOrder } = useData();
    const navigate = ReactRouterDOM.useNavigate();
    
    const [name, setName] = useState(currentUser?.name || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [loading, setLoading] = useState(false);
    const [couponInput, setCouponInput] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);

        const totals = { subtotal, gstAmount, deliveryCharge, grandTotal };
        const discountInfo = { code: appliedCode, amount: discountAmount };

        // Simulate API call
        setTimeout(() => {
            addOrder(currentUser.id, name, cartItems, totals, address, phone, discountInfo);
            clearCart();
            setLoading(false);
            navigate('/orders');
        }, 1500);
    };
    
    const handleApplyCoupon = () => {
        if (couponInput) {
            applyDiscountCode(couponInput);
        }
    };

    if (cartItems.length === 0 && !loading) { // Prevent navigation during loading
        navigate('/cart');
        return null;
    }

    return (
        <div className="p-4">
            {loading && <LoadingModal />}
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-3">1. Shipping Details</h2>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"></textarea>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-3">2. Payment Method</h2>
                            <div className="p-4 border rounded-md bg-gray-50">
                                <label className="flex items-center">
                                    <input type="radio" name="payment" value="cod" defaultChecked className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                                    <span className="ml-3 block text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                 <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-md h-fit">
                        <h2 className="text-lg font-semibold mb-3">3. Order Summary</h2>
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{item.product.name} ({item.size ? `Size: ${item.size}, ` : ''}x{item.quantity})</span>
                                    <span className="font-medium">₹{(item.product.discountPrice ?? item.product.price).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="space-y-2 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                {appliedCode && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({appliedCode})</span>
                                        <span>- ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>GST (5%)</span>
                                    <span>+ ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span>+ ₹{deliveryCharge.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="pt-2 mt-1 flex justify-between font-bold text-gray-900 text-lg border-t">
                                    <span>Total Amount</span>
                                    <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-3">Apply Discount</h2>
                        {appliedCode ? (
                            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                                <div>
                                    <p className="text-sm text-green-800">Code <span className="font-bold">{appliedCode}</span> applied!</p>
                                    <p className="text-green-700 font-semibold">You saved ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <button onClick={removeDiscount} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                                    <i className="fas fa-times-circle mr-1"></i>Remove
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder="Enter discount code" 
                                        className="w-full px-3 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                                    />
                                    <button onClick={handleApplyCoupon} className="bg-gray-800 text-white px-4 font-semibold rounded-r-md hover:bg-black">Apply</button>
                                </div>
                                {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                            </div>
                        )}
                    </div>
                 </div>
            </div>
            <div className="mt-6">
                 <button type="submit" form="checkout-form" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    Place Order (₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
