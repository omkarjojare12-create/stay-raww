
import React, { useState, FormEvent } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoadingModal } from '../../common/LoadingSpinner';

const AdminLoginPage: React.FC = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = ReactRouterDOM.useNavigate();
    const { adminLogin } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        const success = await adminLogin(username, password);
        setLoading(false);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-800 p-4">
            {loading && <LoadingModal />}
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-2">Admin Panel</h1>
                <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Username</label>
                        <input name="username" type="text" defaultValue="admin" required className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input name="password" type="password" defaultValue="password" required className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-gray-900 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors">Login</button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-600">
                    Not an admin? <ReactRouterDOM.Link to="/login" className="text-amber-600 hover:underline">Go to User Login</ReactRouterDOM.Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
