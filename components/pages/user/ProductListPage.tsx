
import React, { useState, useMemo, ChangeEvent } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { Product } from '../../../types';
import StarRating from '../../common/StarRating';
import ProductCard from '../../common/ProductCard';
import useSEO from '../../../hooks/useSEO';

const FilterSidebar: React.FC<{ filters: any, setFilters: any }> = ({ filters, setFilters }) => {
    
    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, priceRange: { ...filters.priceRange, [e.target.name]: e.target.value } });
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.checked });
    };

    const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, rating: Number(e.target.value) });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-64">
            <h2 className="text-lg font-bold border-b pb-2">Filters</h2>
            <div className="py-4 border-b">
                <h3 className="font-semibold mb-2">PRICE</h3>
                <div className="flex items-center space-x-2">
                    <input type="number" name="min" value={filters.priceRange.min} onChange={handlePriceChange} placeholder="Min" className="w-full border p-1 rounded-md" />
                    <span>to</span>
                    <input type="number" name="max" value={filters.priceRange.max} onChange={handlePriceChange} placeholder="Max" className="w-full border p-1 rounded-md" />
                </div>
            </div>
            <div className="py-4 border-b">
                 <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isAssured" checked={filters.isAssured} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-amber-500"/>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="w-16 h-auto" />
                </label>
            </div>
            <div className="py-4">
                <h3 className="font-semibold mb-2">CUSTOMER RATINGS</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map(star => (
                         <label key={star} className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="rating" value={star} checked={filters.rating === star} onChange={handleRatingChange} className="h-4 w-4"/>
                            <span>{star}★ & above</span>
                        </label>
                    ))}
                </div>
            </div>
            <button onClick={() => setFilters({ priceRange: { min: '', max: '' }, isAssured: false, rating: 0 })} className="w-full text-center text-sm font-semibold text-amber-600 mt-2">
                Clear Filters
            </button>
        </div>
    );
};

const ProductListPage: React.FC = () => {
    const { categoryId } = ReactRouterDOM.useParams<{ categoryId: string }>();
    const { categories, getProductsByCategoryId } = useData();
    const [sort, setSort] = useState<'new' | 'price_asc' | 'price_desc'>('new');
    const [filters, setFilters] = useState({
        priceRange: { min: '', max: '' },
        isAssured: false,
        rating: 0,
    });
    
    const category = categories.find(c => c.id === Number(categoryId));
    
    useSEO(
        category ? `Shop ${category.name} | STAY RAW` : 'Products | STAY RAW',
        category ? `Explore our collection of ${category.name}. Find the best deals on high-quality ${category.name} at STAY RAW.` : 'Browse all products at STAY RAW.',
        category ? `STAY RAW, ${category.name}, online shopping, buy ${category.name}` : 'STAY RAW, products, all products'
    );
    
    const products = getProductsByCategoryId(Number(categoryId));

    const processedProducts = useMemo(() => {
        let filtered = [...products];
        
        // Apply filters
        if (filters.priceRange.min) {
            filtered = filtered.filter(p => (p.discountPrice ?? p.price) >= Number(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter(p => (p.discountPrice ?? p.price) <= Number(filters.priceRange.max));
        }
        if (filters.isAssured) {
            filtered = filtered.filter(p => p.isAssured);
        }
        if (filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= filters.rating);
        }

        // Apply sorting
        switch (sort) {
            case 'price_asc':
                filtered.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
                break;
            case 'price_desc':
                filtered.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
                break;
            case 'new':
            default:
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }
        return processedProducts;
    }, [products, sort, filters]);

    if (!category) {
        return <div className="p-4 text-center text-red-500">Category not found.</div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4">
            <FilterSidebar filters={filters} setFilters={setFilters} />
            <div className="flex-1">
                <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold">{category.name} <span className="text-sm font-normal text-gray-500">({processedProducts.length} products)</span></h1>
                        <select 
                            value={sort}
                            onChange={(e) => setSort(e.target.value as any)}
                            className="p-2 border rounded-md bg-gray-50 text-sm focus:outline-none"
                        >
                            <option value="new">Newest First</option>
                            <option value="price_asc">Price -- Low to High</option>
                            <option value="price_desc">Price -- High to Low</option>
                        </select>
                    </div>
                </div>
                {processedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {processedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No products match your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
