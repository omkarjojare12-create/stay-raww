
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { Product } from '../../../types';
import AdminAddProductModal from './AdminAddProductModal';
import AdminEditProductModal from './AdminEditProductModal';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';

const AdminProductsPage: React.FC = () => {
    const { products, categories, addProduct, deleteProduct, updateProduct } = useData();
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('date_desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [searchParams] = ReactRouterDOM.useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    const getCategoryName = (catId: number) => {
        return categories.find(c => c.id === catId)?.name || 'N/A';
    };

    const handleAddProduct = (productData: Omit<Product, 'id' | 'created_at' | 'rating' | 'reviewCount' | 'isAssured'>) => {
        addProduct(productData);
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };
    
    const handleUpdateProduct = (productId: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>) => {
        updateProduct(productId, productData);
        setIsEditModalOpen(false);
    };

    const handleDeleteProduct = (productId: number, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            deleteProduct(productId);
        }
    };

    const filteredAndSortedProducts = useMemo(() => {
        let processedProducts = [...products];

        // Apply search filter
        if (searchTerm) {
            processedProducts = processedProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            processedProducts = processedProducts.filter(
                p => p.cat_id === Number(categoryFilter)
            );
        }

        // Apply sorting
        switch (sortOption) {
            case 'price_asc':
                processedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                processedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'date_asc':
                 processedProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'date_desc':
            default:
                processedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        return processedProducts;
    }, [products, categoryFilter, sortOption, searchTerm]);

    return (
        <>
            <AdminAddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductAdd={handleAddProduct}
            />
            {productToEdit && (
                 <AdminEditProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onProductUpdate={handleUpdateProduct}
                    product={productToEdit}
                />
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h1 className="text-xl font-bold">Manage Products</h1>
                    <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 w-full sm:w-auto">
                        <i className="fas fa-plus mr-2"></i>Add Product
                    </button>
                </div>

                {searchTerm && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-lg flex justify-between items-center">
                        <p className="text-sm text-amber-800">
                            Showing results for: <span className="font-semibold">"{searchTerm}"</span>
                        </p>
                        <ReactRouterDOM.Link to="/admin/products" className="text-amber-600 hover:underline text-xs font-semibold">
                            Clear Search
                        </ReactRouterDOM.Link>
                    </div>
                )}

                {/* Filters and Sorting */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <option value="date_desc">Sort by Date: Newest</option>
                        <option value="date_asc">Sort by Date: Oldest</option>
                        <option value="price_asc">Sort by Price: Low to High</option>
                        <option value="price_desc">Sort by Price: High to Low</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Discounted Price</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4">{getCategoryName(product.cat_id)}</td>
                                    <td className="px-6 py-4">₹{product.price.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        {product.discountPrice ? (
                                            <span className="font-semibold text-green-600">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock < 10 ? (
                                            <span className="text-red-500 font-semibold flex items-center">
                                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                                {product.stock}
                                            </span>
                                        ) : (
                                            <span>{product.stock}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => handleOpenEditModal(product)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredAndSortedProducts.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No products found.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminProductsPage;
