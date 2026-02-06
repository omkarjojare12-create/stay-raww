
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { DiscountBanner } from '../../../types';

interface AdminBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bannerData: Omit<DiscountBanner, 'id'>) => void;
    bannerToEdit?: DiscountBanner | null;
}

const AdminBannerModal: React.FC<AdminBannerModalProps> = ({ isOpen, onClose, onSave, bannerToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [link, setLink] = useState('');
    const [uploadMethod, setUploadMethod] = useState<'url' | 'upload'>('url');

    useEffect(() => {
        if (bannerToEdit) {
            setTitle(bannerToEdit.title);
            setDescription(bannerToEdit.description);
            setImage(bannerToEdit.image);
            setLink(bannerToEdit.link || '');
            setUploadMethod(bannerToEdit.image.startsWith('data:image') ? 'upload' : 'url');
        } else {
            setTitle('');
            setDescription('');
            setImage('');
            setLink('');
            setUploadMethod('url');
        }
    }, [bannerToEdit, isOpen]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!image || !title || !description) {
            alert('Please fill out the title, description, and provide an image.');
            return;
        }
        onSave({ title, description, image, link });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {bannerToEdit ? 'Edit Banner' : 'Add New Banner'}
                        </h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Banner Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <textarea placeholder="Banner Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <input type="text" placeholder="Optional Link (e.g., /category/1)" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                                <div className="flex border border-gray-300 rounded-lg p-1 bg-gray-100">
                                    <button type="button" onClick={() => setUploadMethod('url')} className={`flex-1 py-1 rounded-md text-sm font-semibold transition-colors ${uploadMethod === 'url' ? 'bg-white shadow text-amber-600' : 'text-gray-600'}`}>
                                        Image URL
                                    </button>
                                    <button type="button" onClick={() => setUploadMethod('upload')} className={`flex-1 py-1 rounded-md text-sm font-semibold transition-colors ${uploadMethod === 'upload' ? 'bg-white shadow text-amber-600' : 'text-gray-600'}`}>
                                        Upload Photo
                                    </button>
                                </div>
                            </div>
                            
                            {uploadMethod === 'url' ? (
                                <input type="text" placeholder="Paste Image URL here" value={image.startsWith('data:image') ? '' : image} onChange={(e) => setImage(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            ) : (
                                <input type="file" accept="image/*" onChange={handleFileChange} required={!image} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                            )}
                            
                            {image && (
                                <div className="flex justify-center pt-2">
                                    <img src={image} alt="Banner Preview" className="w-full h-auto object-contain rounded-md border shadow-sm" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600">
                            Save Banner
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBannerModal;
