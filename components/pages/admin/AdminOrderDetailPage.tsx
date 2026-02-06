
import React, { useState } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { OrderStatus } from '../../../types';
import { LoadingModal } from '../../common/LoadingSpinner';

const AdminOrderDetailPage: React.FC = () => {
    const { orderId } = ReactRouterDOM.useParams<{ orderId: string }>();
    const { orders, getProductById, updateOrderStatus } = useData();
    const [loading, setLoading] = useState(false);

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return <div className="p-4 text-center text-red-500">Order not found.</div>;
    }

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        setLoading(true);
        setTimeout(() => { // Simulate API call
            updateOrderStatus(order.id, newStatus);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {loading && <LoadingModal />}
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
            
            {order.return_reason && (
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                    <h3 className="font-semibold text-orange-800 flex items-center">
                        <i className="fas fa-undo-alt mr-2"></i>Return Request Details
                    </h3>
                    <p className="text-orange-700 mt-2 pl-1 italic">
                        "{order.return_reason}"
                    </p>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>User:</strong> {order.userName}</p>
                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                        <p><strong>Total:</strong> <span className="font-bold text-gray-800">₹{order.total_amount.toLocaleString('en-IN')}</span></p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p className="text-gray-600">{order.address}</p>
                        <p className="text-gray-600"><strong>Phone:</strong> {order.phone}</p>
                    </div>
                </div>
                 <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Update Status</h3>
                    <div className="flex items-center space-x-2">
                        <select 
                            defaultValue={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                            className="p-2 border rounded-md"
                        >
                            {Object.values(OrderStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                         <p>Current Status: <span className="font-bold">{order.status}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
                <div className="space-y-4">
                    {order.items.map(item => {
                        const product = getProductById(item.product_id);
                        return (
                            <div key={item.id} className="flex items-center border-b pb-4">
                                <img src={product?.image} alt={product?.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{product?.name || 'Product Deleted'}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;
