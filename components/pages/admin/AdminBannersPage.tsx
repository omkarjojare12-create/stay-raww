
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { DiscountBanner } from '../../../types';
import AdminBannerModal from './AdminBannerModal';

const AdminBannersPage: React.FC = () => {
    const { banners, addBanner, updateBanner, deleteBanner } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bannerToEdit, setBannerToEdit] = useState<DiscountBanner | null>(null);

    const handleOpenAddModal = () => {
        setBannerToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (banner: DiscountBanner) => {
        setBannerToEdit(banner);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBannerToEdit(null);
    };

    const handleSaveBanner = (bannerData: Omit<DiscountBanner, 'id'>) => {
        if (bannerToEdit) {
            updateBanner(bannerToEdit.id, bannerData);
        } else {
            addBanner(bannerData);
        }
        handleCloseModal();
    };

    const handleDelete = (bannerId: number, bannerTitle: string) => {
        if (window.confirm(`Are you sure you want to delete the "${bannerTitle}" banner? This action cannot be undone.`)) {
            deleteBanner(bannerId);
        }
    };

    return (
        <>
            <AdminBannerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBanner}
                bannerToEdit={bannerToEdit}
            />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Manage Discount Banners</h1>
                    <button onClick={handleOpenAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                        <i className="fas fa-plus mr-2"></i>Add Banner
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Link</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map(banner => (
                                <tr key={banner.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={banner.image} alt={banner.title} className="w-24 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{banner.title}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{banner.link || 'N/A'}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button onClick={() => handleOpenEditModal(banner)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(banner.id, banner.title)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminBannersPage;
