
import React, { useState, useEffect, FormEvent } from 'react';
import { DiscountCoupon } from '../../../types';

interface AdminCouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (couponData: Omit<DiscountCoupon, 'id'>) => void;
    couponToEdit?: DiscountCoupon | null;
}

const AdminCouponModal: React.FC<AdminCouponModalProps> = ({ isOpen, onClose, onSave, couponToEdit }) => {
    const [code, setCode] = useState('');
    const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (couponToEdit) {
            setCode(couponToEdit.code);
            setType(couponToEdit.type);
            setValue(couponToEdit.value.toString());
            setIsActive(couponToEdit.isActive);
        } else {
            setCode('');
            setType('percentage');
            setValue('');
            setIsActive(true);
        }
    }, [couponToEdit, isOpen]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave({ 
            code: code.toUpperCase(), 
            type, 
            value: parseFloat(value), 
            isActive 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {couponToEdit ? 'Edit Coupon' : 'Add New Coupon'}
                        </h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Coupon Code (e.g., SUMMER10)" value={code} onChange={(e) => setCode(e.target.value)} required className="w-full uppercase px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            <div className="grid grid-cols-2 gap-4">
                                <select value={type} onChange={(e) => setType(e.target.value as any)} required className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                                <input type="number" placeholder={type === 'percentage' ? 'e.g., 10 for 10%' : 'e.g., 100 for ₹100'} value={value} onChange={(e) => setValue(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            </div>
                            <div>
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500" />
                                    <span className="text-gray-700">Set as Active</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600">Save Coupon</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCouponModal;
