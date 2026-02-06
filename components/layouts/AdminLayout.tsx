
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navItems = [
        { path: '/admin', icon: 'fa-home', label: 'Admin Home' },
        { path: '/admin/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { path: '/admin/orders', icon: 'fa-box-open', label: 'Orders' },
        { path: '/admin/products', icon: 'fa-shopping-basket', label: 'Products' },
        { path: '/admin/categories', icon: 'fa-tags', label: 'Categories' },
        { path: '/admin/banners', icon: 'fa-percent', label: 'Banners' },
        { path: '/admin/coupons', icon: 'fa-ticket-alt', label: 'Coupons' },
        { path: '/admin/users', icon: 'fa-users', label: 'Users' },
        { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
    ];
    return (
        <>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
        <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-slate-800 text-white transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <div className="h-16 flex items-center justify-center font-bold text-2xl border-b border-slate-700 flex-shrink-0">
                STAY RAW
            </div>
            <nav className="flex flex-col p-4 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors ${location.pathname === item.path ? 'bg-amber-500' : ''}`}
                    >
                        <i className={`fas ${item.icon} w-6 mr-3`}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto p-4">
                <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-center p-3 rounded-lg bg-slate-700 hover:bg-amber-500 transition-colors"
                >
                    <i className="fas fa-external-link-alt mr-3"></i>
                    <span className="font-semibold">STAY RAW Store</span>
                </Link>
            </div>
        </aside>
        </>
    );
};

const AdminHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSearch = searchTerm.trim();
        if (trimmedSearch) {
            navigate(`/admin/products?search=${encodeURIComponent(trimmedSearch)}`);
        } else {
            navigate('/admin/products');
        }
    };

    return (
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-4 z-20 gap-4">
             <button onClick={onMenuClick} className="text-gray-600 md:hidden">
                <i className="fas fa-bars text-xl"></i>
            </button>
             <div className="hidden md:flex flex-1 max-w-xl">
                 <form onSubmit={handleSearch} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                    />
                    <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-amber-600">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
                <span>Welcome, {currentUser?.name}</span>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                    <i className="fas fa-sign-out-alt text-xl"></i>
                </button>
            </div>
        </header>
    );
};

const AdminBanner: React.FC<{ adminName: string }> = ({ adminName }) => (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold">STAY RAW Admin Panel</h2>
            <p className="mt-1 opacity-90">Welcome back, {adminName}!</p>
        </div>
        <i className="fas fa-shield-alt text-5xl opacity-50 hidden sm:block"></i>
    </div>
);

const AdminPromotionBanner: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="relative bg-gradient-to-r from-blue-500 to-teal-400 text-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
        <div>
            <h3 className="font-bold"><i className="fas fa-bullhorn mr-2"></i>Boost Sales!</h3>
            <p className="text-sm opacity-90">Consider running a promotional campaign. <Link to="/admin/products" className="underline hover:text-amber-200">Manage products for your next sale.</Link></p>
        </div>
        <button
            onClick={onClose}
            className="text-white hover:bg-white/25 rounded-full w-7 h-7 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
            aria-label="Dismiss banner"
        >
            <i className="fas fa-times"></i>
        </button>
    </div>
);


const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser } = useAuth();
    const [isPromoBannerVisible, setIsPromoBannerVisible] = useState(true);
    const navigate = useNavigate();

    const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchTerm = (formData.get('search') as string || '').trim();
        if (searchTerm) {
            navigate(`/admin/products?search=${encodeURIComponent(searchTerm)}`);
        } else {
            navigate('/admin/products');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col md:ml-64">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6">
                    <div className="md:hidden mb-4">
                         <form onSubmit={handleMobileSearch} className="relative">
                            <input
                                name="search"
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-10 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>
                    <AdminBanner adminName={currentUser?.name || 'Admin'} />
                    {isPromoBannerVisible && <AdminPromotionBanner onClose={() => setIsPromoBannerVisible(false)} />}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
