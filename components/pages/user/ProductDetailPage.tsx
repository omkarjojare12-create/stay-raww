
import React, { useState, useEffect, FormEvent } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../common/LoadingSpinner';
import StarRating from '../../common/StarRating';
import { Review } from '../../../types';
import ProductCard from '../../common/ProductCard';
import useSEO from '../../../hooks/useSEO';

const ReviewsSection: React.FC<{ productId: number }> = ({ productId }) => {
    const { getReviewsByProductId, addReview, hasUserPurchasedProduct, hasUserReviewedProduct } = useData();
    const { currentUser } = useAuth();
    const reviews = getReviewsByProductId(productId);

    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');

    const hasPurchased = currentUser ? hasUserPurchasedProduct(currentUser.id, productId) : false;
    const hasReviewed = currentUser ? hasUserReviewedProduct(currentUser.id, productId) : false;
    const canReview = currentUser && hasPurchased && !hasReviewed;

    const handleReviewSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!canReview) {
            setError("You are not eligible to review this product.");
            return;
        }
        if (!newComment.trim()) {
            setError("Please write a comment for your review.");
            return;
        }
        
        const reviewData: Omit<Review, 'id'> = {
            productId,
            userId: currentUser!.id,
            userName: currentUser!.name,
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString(),
        };

        addReview(reviewData);
        setNewComment('');
        setNewRating(5);
        setError('');
    };
    
    const ReviewEligibilityMessage: React.FC = () => {
        if (!currentUser) {
            return (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-600">
                        <ReactRouterDOM.Link to="/login" className="text-yellow-500 font-semibold hover:underline">Log in</ReactRouterDOM.Link> to write a review.
                    </p>
                </div>
            );
        }

        if (hasReviewed) {
             return (
                <div className="mb-6 p-4 border rounded-lg bg-blue-50 text-center">
                    <p className="text-blue-700">
                        You've already reviewed this product. Thank you for your feedback!
                    </p>
                </div>
            );
        }

        if (!hasPurchased) {
             return (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 text-center">
                    <p className="text-gray-600">
                        You must purchase this product to write a review.
                    </p>
                </div>
            );
        }

        return null;
    }


    return (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ratings & Reviews</h2>
            
            {canReview ? (
                 <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">Write a Review</h3>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <div className="flex items-center mb-2">
                        <span className="mr-2">Your Rating:</span>
                        <div className="flex space-x-1 text-amber-400 text-xl">
                            {[1,2,3,4,5].map(star => (
                                <i key={star} className={`${newRating >= star ? 'fas' : 'far'} fa-star cursor-pointer`} onClick={() => setNewRating(star)}></i>
                            ))}
                        </div>
                    </div>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts..." rows={3} className="w-full p-2 border rounded-md"></textarea>
                    <button type="submit" className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-black">Submit Review</button>
                </form>
            ) : (
                <ReviewEligibilityMessage />
            )}
           
            {/* Existing Reviews */}
            <div className="space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center mb-1">
                            <StarRating rating={review.rating} size="sm" />
                            <p className="font-semibold ml-3">{review.userName}</p>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                )) : <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>}
            </div>
        </div>
    )
};

const ProductDetailPage: React.FC = () => {
    const { productId } = ReactRouterDOM.useParams<{ productId: string }>();
    const { getProductById, getProductsByCategoryId } = useData();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [pinCode, setPinCode] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState('');
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState('');
    const navigate = ReactRouterDOM.useNavigate();

    const product = getProductById(Number(productId));
    
    useSEO(
        product ? `${product.name} | STAY RAW` : 'Product Details | STAY RAW',
        product ? `Buy ${product.name} at STAY RAW. ${product.description.substring(0, 150)}...` : 'Find product details, reviews, and pricing at STAY RAW.',
        product ? `STAY RAW, ${product.name}, buy online, product details, reviews, price` : 'STAY RAW, product details'
    );

    if (!product) {
        return <div className="p-4 text-center text-red-500">Product not found.</div>;
    }
    
    const relatedProducts = getProductsByCategoryId(product.cat_id)
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    const hasSizes = product.sizes && product.sizes.length > 0;

    const handleAction = (action: 'cart' | 'buy') => {
        if (hasSizes && !selectedSize) {
            setSizeError('Please select a size.');
            return;
        }
        addToCart(product, quantity, selectedSize || '');
        if (action === 'buy') {
            navigate('/checkout');
        }
    };
    
    const checkDelivery = () => {
        if(pinCode.length === 6 && !isNaN(Number(pinCode))) {
             const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            setDeliveryInfo(`Delivery by ${deliveryDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} | Free`);
        } else {
            setDeliveryInfo('Please enter a valid 6-digit pin code.');
        }
    }

    const isWishlisted = isInWishlist(product.id);
    const handleWishlistToggle = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto p-2 md:p-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Section */}
                        <div className="flex flex-col items-center">
                            <div className="border rounded-lg p-4 flex justify-center items-center h-80 w-full">
                                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex justify-center mt-4 gap-3 w-full">
                                <button 
                                    onClick={() => handleAction('cart')}
                                    disabled={product.stock === 0}
                                    className="w-full bg-amber-400 text-black py-3 rounded-sm font-semibold hover:bg-amber-500 transition-colors disabled:bg-gray-400 flex items-center justify-center text-lg"
                                >
                                    <i className="fas fa-cart-plus mr-2"></i> Add to Cart
                                </button>
                                <button 
                                    onClick={() => handleAction('buy')}
                                    disabled={product.stock === 0}
                                    className="w-full bg-zinc-800 text-white py-3 rounded-sm font-semibold hover:bg-zinc-900 transition-colors disabled:bg-gray-400 flex items-center justify-center text-lg"
                                >
                                    <i className="fas fa-bolt mr-2"></i> Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div>
                            <button onClick={handleWishlistToggle} className="float-right text-gray-400 hover:text-red-500">
                                <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart text-xl ${isWishlisted ? 'text-red-500' : ''}`}></i>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">{product.name}</h1>
                            <div className="flex items-center my-2">
                                <StarRating rating={product.rating} />
                                <span className="text-sm text-gray-500 ml-2">{product.reviewCount} Ratings</span>
                                {product.isAssured && <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="w-20 h-auto ml-4" />}
                            </div>
                            
                            {product.discountPrice && product.discountPrice > 0 ? (
                                <div className="flex items-baseline gap-2 my-2">
                                    <p className="text-3xl font-bold text-gray-900">₹{product.discountPrice.toLocaleString('en-IN')}</p>
                                    <p className="text-xl text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                                    </p>
                                </div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900 my-2">₹{product.price.toLocaleString('en-IN')}</p>
                            )}
                            
                            <p className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                            </p>
                            
                            {hasSizes && (
                                <div className="my-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Select Size:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button 
                                                key={size} 
                                                onClick={() => { setSelectedSize(size); setSizeError(''); }}
                                                className={`px-4 py-1.5 border rounded-md font-semibold text-sm transition-colors ${selectedSize === size ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {sizeError && <p className="text-red-500 text-sm mt-2">{sizeError}</p>}
                                </div>
                            )}

                            <div className="my-4">
                               <p className="text-gray-600">{product.description}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4 my-6">
                                <label htmlFor="quantity" className="font-semibold">Quantity:</label>
                                <div className="flex items-center border rounded-md">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg">-</button>
                                    <input type="number" id="quantity" value={quantity} readOnly className="w-12 text-center border-l border-r" />
                                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-1 text-lg">+</button>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4">
                                 <h3 className="font-semibold">Delivery</h3>
                                 <div className="flex items-center mt-2">
                                     <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                                     <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Enter Delivery Pincode" className="border-b-2 border-amber-500 focus:outline-none"/>
                                     <button onClick={checkDelivery} className="ml-2 text-amber-600 font-semibold">Check</button>
                                 </div>
                                 <p className="text-sm text-green-600 mt-2">{deliveryInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <ReviewsSection productId={product.id} />

                 {relatedProducts.length > 0 && (
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(relProduct => (
                                <ProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
