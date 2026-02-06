
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { Product } from '../../types';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <ReactRouterDOM.Link to={`/product/${product.id}`} className="block h-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col group transition-shadow duration-300 hover:shadow-xl">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                </div>

                {/* Details Container */}
                <div className="p-3 flex-grow flex flex-col">
                    <h3 className="text-sm font-semibold text-zinc-800 truncate" title={product.name}>
                        {product.name}
                    </h3>
                    
                    {/* Rating and Assured Badge */}
                    <div className="flex items-center my-1.5 gap-2">
                        <StarRating rating={product.rating} size="sm" />
                        {product.isAssured && <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-4" />}
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto pt-2">
                        {product.discountPrice && product.discountPrice > 0 ? (
                            <div className="flex items-baseline gap-2">
                                <p className="text-base font-bold text-zinc-900">
                                    ₹{product.discountPrice.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-slate-500 line-through">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs font-semibold text-green-600">
                                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                                </p>
                            </div>
                        ) : (
                            <p className="text-base font-bold text-zinc-900">
                                ₹{product.price.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </ReactRouterDOM.Link>
    );
};

export default ProductCard;
