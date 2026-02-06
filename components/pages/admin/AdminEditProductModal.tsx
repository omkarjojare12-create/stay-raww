
import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useData } from '../../../context/DataContext';
import { generateProductImage } from '../../../services/geminiService';
import { Product } from '../../../types';
import LoadingSpinner from '../../common/LoadingSpinner';

interface AdminEditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductUpdate: (productId: number, productData: Partial<Omit<Product, 'id' | 'created_at'>>) => void;
    product: Product;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const AdminEditProductModal: React.FC<AdminEditProductModalProps> = ({ isOpen, onClose, onProductUpdate, product }) => {
    const { categories } = useData();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [stock, setStock] = useState('');
    const [catId, setCatId] = useState('');
    const [image, setImage] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price.toString());
            setDiscountPrice(product.discountPrice?.toString() || '');
            setStock(product.stock.toString());
            setCatId(product.cat_id.toString());
            setImage(product.image);
            setSelectedSizes(product.sizes || []);
        }
    }, [product]);

    const handleImageGeneration = async () => {
        if (!name) {
            alert('Please enter a product name first to generate an image.');
            return;
        }
        setIsGenerating(true);
        try {
            const generatedImage = await generateProductImage(name);
            setImage(generatedImage);
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Sorry, we couldn't generate an image. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setIsGenerating(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setSelectedSizes(prev => 
            checked ? [...prev, value] : prev.filter(size => size !== value)
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!image) {
            alert('A product image is required.');
            return;
        }
        onProductUpdate(product.id, {
            name,
            description,
            price: parseFloat(price),
            discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
            stock: parseInt(stock, 10),
            cat_id: parseInt(catId, 10),
            image,
            sizes: selectedSizes,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Product</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                <input type="number" placeholder="Discount Price (Optional)" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            </div>
                             <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <select value={catId} onChange={(e) => setCatId(e.target.value)} required className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {SIZES.map(size => (
                                        <label key={size} className="flex items-center space-x-2 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                onChange={handleSizeChange}
                                                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <span>{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <h3 className="font-semibold mb-2">Product Image</h3>
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {isGenerating ? <LoadingSpinner /> : image ? <img src={image} alt="Product" className="w-full h-full object-cover" /> : <i className="fas fa-image text-4xl text-gray-400"></i>}
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <p className="text-sm text-gray-500 mb-2">Regenerate the image with AI or upload a new one.</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button type="button" onClick={handleImageGeneration} disabled={isGenerating || !name} className="flex-1 bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                                {isGenerating ? 'Generating...' : 'Generate ✨'}
                                            </button>
                                            <label htmlFor="edit-image-upload" className="flex-1 cursor-pointer bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center inline-block">
                                                Upload
                                            </label>
                                            <input id="edit-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-black">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditProductModal;
