
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { DiscountCoupon } from '../../../types';
import AdminCouponModal from './AdminCouponModal';

const StatusToggle: React.FC<{ coupon: DiscountCoupon; onToggle: (coupon: DiscountCoupon) => void; }> = ({ coupon, onToggle }) => (
    <button onClick={() => onToggle(coupon)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${coupon.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${coupon.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const AdminCouponsPage: React.FC = () => {
    const { coupons, addCoupon, updateCoupon, deleteCoupon } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [couponToEdit, setCouponToEdit] = useState<DiscountCoupon | null>(null);

    const handleOpenAddModal = () => {
        setCouponToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (coupon: DiscountCoupon) => {
        setCouponToEdit(coupon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCouponToEdit(null);
    };

    const handleSaveCoupon = (couponData: Omit<DiscountCoupon, 'id'>) => {
        if (couponToEdit) {
            updateCoupon(couponToEdit.id, couponData);
        } else {
            addCoupon(couponData);
        }
        handleCloseModal();
    };

    const handleDelete = (couponId: number, couponCode: string) => {
        if (window.confirm(`Are you sure you want to delete the coupon "${couponCode}"? This action cannot be undone.`)) {
            deleteCoupon(couponId);
        }
    };
    
    const handleStatusToggle = (coupon: DiscountCoupon) => {
        updateCoupon(coupon.id, { isActive: !coupon.isActive });
    };

    return (
        <>
            <AdminCouponModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCoupon}
                couponToEdit={couponToEdit}
            />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Manage Coupons</h1>
                    <button onClick={handleOpenAddModal} className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                        <i className="fas fa-plus mr-2"></i>Add Coupon
                    </button>
                </div>

                {coupons.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Code</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Value</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map(coupon => (
                                    <tr key={coupon.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono font-bold text-gray-900">{coupon.code}</td>
                                        <td className="px-6 py-4 capitalize">{coupon.type}</td>
                                        <td className="px-6 py-4 font-semibold">
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusToggle coupon={coupon} onToggle={handleStatusToggle} />
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button onClick={() => handleOpenEditModal(coupon)} className="text-blue-500 hover:text-blue-700" title="Edit Coupon">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button onClick={() => handleDelete(coupon.id, coupon.code)} className="text-red-500 hover:text-red-700" title="Delete Coupon">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <i className="fas fa-ticket-alt text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700">No coupons found</h3>
                        <p className="text-gray-500 mt-1">Boost your sales by creating your first discount coupon.</p>
                        <button onClick={handleOpenAddModal} className="mt-4 bg-amber-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                            Add First Coupon
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminCouponsPage;
