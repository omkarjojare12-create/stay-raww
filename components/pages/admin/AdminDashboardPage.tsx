
import React from 'react';
import { useData } from '../../../context/DataContext';
import { OrderStatus } from '../../../types';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';

interface StatCardProps {
    icon: string;
    label: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <i className={`fas ${icon} text-white text-xl`}></i>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const { users, orders, products } = useData();

    const totalRevenue = orders
        .filter(o => o.status === OrderStatus.DELIVERED)
        .reduce((sum, order) => sum + order.total_amount, 0);
        
    const stats = [
        { icon: 'fa-users', label: 'Total Users', value: users.length, color: 'bg-blue-500' },
        { icon: 'fa-box-open', label: 'Total Orders', value: orders.length, color: 'bg-yellow-500' },
        { icon: 'fa-indian-rupee-sign', label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'bg-green-500' },
        { icon: 'fa-shopping-basket', label: 'Active Products', value: products.length, color: 'bg-purple-500' },
        { icon: 'fa-times-circle', label: 'Cancellations', value: orders.filter(o => o.status === OrderStatus.CANCELLED).length, color: 'bg-red-500' },
        { icon: 'fa-truck', label: 'Shipments', value: orders.filter(o => o.status === OrderStatus.DISPATCHED).length, color: 'bg-teal-500' },
    ];
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <ReactRouterDOM.Link to="/admin/products" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                        <i className="fas fa-plus-circle mr-2"></i>Add Product
                    </ReactRouterDOM.Link>
                    <ReactRouterDOM.Link to="/admin/users" className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        <i className="fas fa-user-edit mr-2"></i>Manage Users
                    </ReactRouterDOM.Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
