
import React, { useState } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Chatbot from '../common/Chatbot';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { cartCount } = useCart();
    const { currentUser } = useAuth();
    const navigate = ReactRouterDOM.useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSearch = searchTerm.trim();
        if (trimmedSearch) {
            navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
            setSearchTerm('');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-zinc-900 text-white h-16 flex items-center justify-between px-4 z-40 shadow-md">
            <div className="flex items-center space-x-4">
                <button onClick={onMenuClick} className="text-white md:hidden">
                    <i className="fas fa-bars text-xl"></i>
                </button>
                <ReactRouterDOM.Link to="/" className="text-2xl font-extrabold tracking-wider">
                    STAY RAW
                </ReactRouterDOM.Link>
            </div>
            
            <div className="hidden md:flex flex-grow max-w-2xl mx-4">
                <form onSubmit={handleSearch} className="relative w-full">
                    <input 
                        type="text" 
                        placeholder="Search for products, brands and more" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 pr-12 rounded-sm text-black focus:outline-none"
                    />
                    <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-gray-800 hover:text-amber-400">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>

            <div className="flex items-center space-x-6">
                {currentUser ? (
                     <ReactRouterDOM.Link to="/profile" className="hidden md:flex flex-col items-center hover:text-gray-200">
                        <i className="fas fa-user-circle text-xl"></i>
                        <span className="text-xs">{currentUser.name.split(' ')[0]}</span>
                    </ReactRouterDOM.Link>
                ) : (
                    <ReactRouterDOM.Link to="/login" className="bg-amber-400 text-gray-900 px-6 py-1.5 text-sm font-semibold rounded-sm hover:bg-amber-500">
                        Login
                    </ReactRouterDOM.Link>
                )}
               
                <ReactRouterDOM.Link to="/cart" className="relative text-white flex items-center space-x-1">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    <span className="hidden md:inline">Cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </ReactRouterDOM.Link>
            </div>
        </header>
    );
};


const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.1)] h-16 flex items-center justify-around z-40 md:hidden">
            <ReactRouterDOM.Link to="/" className="flex flex-col items-center text-gray-600 hover:text-amber-500">
                <i className="fas fa-home text-xl"></i>
                <span className="text-xs">Home</span>
            </ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/wishlist" className="flex flex-col items-center text-gray-600 hover:text-amber-500">
                <i className="fas fa-heart text-xl"></i>
                <span className="text-xs">Wishlist</span>
            </ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-amber-500">
                <i className="fas fa-shopping-bag text-xl"></i>
                <span className="text-xs">Cart</span>
            </ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/orders" className="flex flex-col items-center text-gray-600 hover:text-amber-500">
                <i className="fas fa-box text-xl"></i>
                <span className="text-xs">Orders</span>
            </ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-amber-500">
                <i className="fas fa-user text-xl"></i>
                <span className="text-xs">Profile</span>
            </ReactRouterDOM.Link>
        </nav>
    );
};

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const navigate = ReactRouterDOM.useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Menu</h2>
                    <nav className="flex flex-col space-y-4">
                        <ReactRouterDOM.Link to="/" onClick={onClose} className="text-gray-700 hover:text-amber-500"><i className="fas fa-home w-6 mr-2"></i>Home</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/profile" onClick={onClose} className="text-gray-700 hover:text-amber-500"><i className="fas fa-user-circle w-6 mr-2"></i>Profile</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/wishlist" onClick={onClose} className="text-gray-700 hover:text-amber-500"><i className="fas fa-heart w-6 mr-2"></i>My Wishlist</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/orders" onClick={onClose} className="text-gray-700 hover:text-amber-500"><i className="fas fa-receipt w-6 mr-2"></i>My Orders</ReactRouterDOM.Link>
                        
                        {currentUser && currentUser.isAdmin && (
                            <ReactRouterDOM.Link to="/admin" onClick={onClose} className="text-amber-600 font-bold hover:text-amber-700"><i className="fas fa-tachometer-alt w-6 mr-2"></i>Admin Panel</ReactRouterDOM.Link>
                        )}

                        <hr />
                        {currentUser ? (
                            <button onClick={handleLogout} className="text-left text-red-500 hover:text-red-700"><i className="fas fa-sign-out-alt w-6 mr-2"></i>Logout</button>
                        ) : (
                            <ReactRouterDOM.Link to="/login" onClick={onClose} className="text-gray-700 hover:text-amber-500"><i className="fas fa-sign-in-alt w-6 mr-2"></i>Login</ReactRouterDOM.Link>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
};

const UserLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = ReactRouterDOM.useNavigate();

    const handleMobileSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchTerm = (formData.get('q') as string || '').trim();
        if (searchTerm) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            e.currentTarget.reset();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="pt-16 pb-16 md:pb-0">
                <div className="md:hidden p-2 bg-white shadow-sm">
                     <form onSubmit={handleMobileSearch} className="relative w-full">
                        <input name="q" type="text" placeholder="Search for products..." className="w-full h-10 px-4 pr-12 rounded-md bg-gray-100 text-black focus:outline-none"/>
                        <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-gray-500">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                <ReactRouterDOM.Outlet />
            </main>
            <BottomNav />
            <Chatbot />
        </div>
    );
};

export default UserLayout;
