
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';

const AdminHomePage: React.FC = () => {
    const adminLinks = [
        { path: '/admin/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', description: 'View store analytics and stats.' },
        { path: '/admin/orders', icon: 'fa-box-open', label: 'Manage Orders', description: 'Process, view, and track all orders.' },
        { path: '/admin/products', icon: 'fa-shopping-basket', label: 'Manage Products', description: 'Add, edit, and remove products.' },
        { path: '/admin/users', icon: 'fa-users', label: 'Manage Users', description: 'View and manage customer accounts.' },
        { path: '/admin/categories', icon: 'fa-tags', label: 'Manage Categories', description: 'Organize your products into categories.' },
        { path: '/admin/settings', icon: 'fa-cog', label: 'Settings', description: 'Configure your admin account.' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminLinks.map(link => (
                    <ReactRouterDOM.Link
                        key={link.path}
                        to={link.path}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start space-x-4"
                    >
                        <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className={`fas ${link.icon} text-xl`}></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{link.label}</h2>
                            <p className="text-gray-500 text-sm mt-1">{link.description}</p>
                        </div>
                    </ReactRouterDOM.Link>
                ))}
            </div>
        </div>
    );
};

export default AdminHomePage;
