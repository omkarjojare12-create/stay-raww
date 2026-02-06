
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoadingModal } from '../../common/LoadingSpinner';
import useSEO from '../../../hooks/useSEO';

const LoginPage: React.FC = () => {
    useSEO(
        'Login or Sign Up | STAY RAW',
        'Login to your STAY RAW account or sign up to start shopping for the best apparel and accessories.',
        'STAY RAW, login, sign up, my account, create account'
    );
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password.');
        }
    };
    
    const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        const success = await signup(name, phone, email, password);
        setLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('User with this email already exists.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {loading && <LoadingModal />}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">STAY RAW</h1>
                <div className="flex border-b mb-6">
                    <button onClick={() => setActiveTab('login')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'login' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}>
                        Login
                    </button>
                    <button onClick={() => setActiveTab('signup')} className={`flex-1 py-2 text-center font-semibold transition-colors ${activeTab === 'signup' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500'}`}>
                        Sign Up
                    </button>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <button type="submit" className="w-full bg-zinc-800 text-white py-3 rounded-lg font-semibold hover:bg-zinc-900 transition-colors">Login</button>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <input name="name" type="text" placeholder="Full Name" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <input name="phone" type="tel" placeholder="Phone Number" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <button type="submit" className="w-full bg-zinc-800 text-white py-3 rounded-lg font-semibold hover:bg-zinc-900 transition-colors">Sign Up</button>
                    </form>
                )}
                 <p className="text-center mt-4 text-sm text-gray-600">
                    Admin? <Link to="/admin/login" className="text-amber-600 hover:underline">Admin Login</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
