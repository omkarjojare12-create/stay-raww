
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../../../context/DataContext';
import { OrderStatus } from '../../../types';

const AdminOrdersPage: React.FC = () => {
    const { orders } = useData();
    const navigate = ReactRouterDOM.useNavigate();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">All Orders</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4">{order.userName}</td>
                                <td className="px-6 py-4">₹{order.total_amount.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                                        order.status === OrderStatus.DISPATCHED ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>{order.status}</span>
                                </td>
                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => navigate(`/admin/orders/${order.id}`)} className="text-yellow-600 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ex
