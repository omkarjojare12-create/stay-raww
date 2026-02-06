
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import ProductCard from '../../common/ProductCard';
import useSEO from '../../../hooks/useSEO';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = ReactRouterDOM.useSearchParams();
    const query = searchParams.get('q') || '';
    
    useSEO(
        `Search results for "${query}" | STAY RAW`,
        `Find the best products for "${query}" at STAY RAW. Explore our collection of apparel and accessories.`,
        `STAY RAW, search, results, ${query}`
    );
    
    const { products } = useData();

    const searchResults = React.useMemo(() => {
        if (!query) return [];
        return products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );
    }, [products, query]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="text-xl font-bold">Search Results</h1>
                {query ? (
                    <p className="text-gray-600">
                        Showing results for <span className="font-semibold text-gray-800">"{query}"</span> ({searchResults.length} found)
                    </p>
                ) : (
                    <p className="text-gray-600">Please enter a search term.</p>
                )}
            </div>

            {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {searchResults.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                query && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                         <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-700 font-semibold">No products found for "{query}".</p>
                        <p className="text-gray-500 mt-2">Try checking your spelling or using more general terms.</p>
                        <ReactRouterDOM.Link to="/" className="mt-4 inline-block bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-black">
                            Continue Shopping
                        </ReactRouterDOM.Link>
                    </div>
                )
            )}
        </div>
    );
};

export default SearchResultsPage;
