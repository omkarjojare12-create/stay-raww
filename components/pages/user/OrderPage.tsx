
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Order, OrderStatus } from '../../../types';
import OrderStatusTracker from '../../common/OrderStatusTracker';
import useSEO from '../../../hooks/useSEO';

const ReturnModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    orderId: string;
}> = ({ isOpen, onClose, onSubmit, orderId }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            onSubmit(reason);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Request Return for Order #{orderId}</h2>
                        <p className="text-sm text-gray-600 mb-4">Please let us know why you'd like to return this item. Your feedback is valuable.</p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., The item was damaged, wrong size, etc."
                            required
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                    <div className="bg-gray-100 p-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600" disabled={!reason.trim()}>
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const { updateOrderStatus } = useData();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const firstItem = order.items[0]?.productDetails;

    const handleReturnSubmit = (reason: string) => {
        updateOrderStatus(order.id, OrderStatus.RETURN_REQUESTED, reason);
        setIsReturnModalOpen(false);
    };

    return (
        <>
            <ReturnModal 
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                onSubmit={handleReturnSubmit}
                orderId={order.id}
            />
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-gray-800">Order ID: {order.id}</p>
                            <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p className="text-lg font-bold text-gray-900 mt-1">₹{order.total_amount.toLocaleString('en-IN')}</p>
                        </div>
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                            order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                            order.status === OrderStatus.RETURNED ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>{order.status}</span>
                    </div>
                     {firstItem && (
                        <div className="flex items-center mt-3 border-t pt-3">
                            <img src={firstItem.image} alt={firstItem.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                            <div>
                                <p className="font-semibold">{firstItem.name}</p>
                                {order.items.length > 1 && <p className="text-sm text-gray-500">+{order.items.length - 1} more items</p>}
                            </div>
                        </div>
                    )}
                     <OrderStatusTracker status={order.status} />

                    <div className="flex justify-between items-center mt-2">
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-amber-600 font-semibold text-sm">
                            {isExpanded ? 'Hide Details' : 'View Details'} <i className={`fas fa-chevron-down transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                        </button>
                        {order.status === OrderStatus.DELIVERED && (
                            <button onClick={() => setIsReturnModalOpen(true)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600">
                                Request Return
                            </button>
                        )}
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="bg-gray-50 p-4 border-t">
                        <h4 className="font-semibold mb-2">Items in this order:</h4>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium">{item.productDetails?.name || 'Product not found'}</p>
                                        <p className="text-gray-500">
                                            {item.size ? `Size: ${item.size} | ` : ''}Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold mb-1">Shipping Address</h4>
                            <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};


const OrderPage: React.FC = () => {
    useSEO(
        'My Orders | STAY RAW',
        'Track your past and current orders from STAY RAW. View order history and status.',
        'STAY RAW, my orders, order history, track order'
    );
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const { currentUser } = useAuth();
    const { getOrdersByUserId } = useData();

    const orders = useMemo(() => {
        return currentUser ? getOrdersByUserId(currentUser.id) : [];
    }, [currentUser, getOrdersByUserId]);

    const activeOrders = orders.filter(o => 
        o.status === OrderStatus.PLACED || 
        o.status === OrderStatus.DISPATCHED || 
        o.status === OrderStatus.RETURN_REQUESTED
    );
    const historyOrders = orders.filter(o => 
        o.status === OrderStatus.DELIVERED || 
        o.status === OrderStatus.CANCELLED ||
        o.status === OrderStatus.RETURNED
    );

    const ordersToShow = activeTab === 'active' ? activeOrders : historyOrders;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            <div className="flex border-b mb-4">
                <button onClick={() => setActiveTab('active')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'active' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}>
                    Active Orders
                </button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'history' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}>
                    Order History
                </button>
            </div>
            {ordersToShow.length > 0 ? (
                <div>
                    {ordersToShow.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <i className="fas fa-receipt text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">No {activeTab} orders found.</p>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
