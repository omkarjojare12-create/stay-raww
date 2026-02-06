
import React, { useState, useEffect } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { Product } from '../../../types';
import ProductCard from '../../common/ProductCard';
import useSEO from '../../../hooks/useSEO';

const HeroCarousel: React.FC = () => {
    const { banners } = useData();
    const [current, setCurrent] = useState(0);
    const navigate = ReactRouterDOM.useNavigate();

    useEffect(() => {
        if (banners.length === 0) return;
        const timer = setTimeout(() => {
            setCurrent(current === banners.length - 1 ? 0 : current + 1);
        }, 4000);
        return () => clearTimeout(timer);
    }, [current, banners.length]);

    const handleBannerClick = (link?: string) => {
        if (link) {
            navigate(link);
        }
    };

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full overflow-hidden shadow-lg rounded-md">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner) => (
                    <div key={banner.id} className="w-full flex-shrink-0" onClick={() => handleBannerClick(banner.link)} style={{ cursor: banner.link ? 'pointer' : 'default' }}>
                         <img src={banner.image} alt={banner.title} className="w-full flex-shrink-0" />
                    </div>
                ))}
            </div>
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {banners.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${current === i ? 'bg-white' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </div>
    );
};

const ProductRow: React.FC<{ title: string; products: Product[] }> = ({ title, products }) => {
    if (products.length === 0) return null;
    return (
        <section className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-3 -mx-4 px-4">
                 {products.map(product => (
                    <div key={product.id} className="w-40 md:w-52 flex-shrink-0">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
    useSEO(
        'STAY RAW - Unleash Your Potential',
        'Shop the latest apparel and accessories from STAY RAW. High-quality gear for your active lifestyle. Unleash your potential.',
        'STAY RAW, e-commerce, apparel, accessories, gym wear, activewear, fashion'
    );
    const { categories, products } = useData();
    
    const hasContent = categories.length > 0 || products.length > 0;

    if (!hasContent) {
        return (
            <div className="p-4 text-center">
                <div className="bg-white p-10 rounded-lg shadow-sm mt-4">
                    <i className="fas fa-store-alt-slash text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800">Our Store is Getting Ready!</h2>
                    <p className="text-gray-500 mt-2">We're busy stocking up our shelves. New products and categories are coming soon. Stay tuned!</p>
                </div>
            </div>
        );
    }

    const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
    const topTshirts = products.filter(p => p.name.toLowerCase().includes('shirt')).slice(0, 8);
    const bestOfFashion = products.filter(p => p.cat_id === 2).slice(0, 8);
    const homeAndKitchen = products.filter(p => p.cat_id === 3).slice(0, 8);

    return (
        <div className="p-2 md:p-4 space-y-4">
             <section>
                <div className="flex justify-around bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                    {categories.map(category => (
                        <ReactRouterDOM.Link to={`/category/${category.id}`} key={category.id} className="flex-shrink-0 flex flex-col items-center space-y-2 text-center w-24 hover:text-yellow-400">
                            <img src={category.image} alt={category.name} className="w-16 h-16 object-contain"/>
                            <span className="text-sm text-gray-800 font-semibold">{category.name}</span>
                        </ReactRouterDOM.Link>
                    ))}
                </div>
            </section>
            
            <HeroCarousel />
            
            <ProductRow title="Best Sellers" products={bestSellers} />
            <ProductRow title="Top T-Shirts" products={topTshirts} />
            <ProductRow title="Best of Fashion" products={bestOfFashion} />
            <ProductRow title="Home & Kitchen Essentials" products={homeAndKitchen} />
        </div>
    );
};

export default HomePage;
