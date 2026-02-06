
import React, { useState, FormEvent } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoadingModal } from '../../common/LoadingSpinner';
import useSEO from '../../../hooks/useSEO';

const ProfilePage: React.FC = () => {
    useSEO(
        'My Profile | STAY RAW',
        'Manage your profile, shipping addresses, and password at STAY RAW.',
        'STAY RAW, my account, profile, user settings'
    );
    const { currentUser, updateProfile, logout } = useAuth();
    const navigate = ReactRouterDOM.useNavigate();
    
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    const handleProfileUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        // Simulate API Call
        setTimeout(() => {
            updateProfile({ name, email, phone, address });
            setLoading(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }, 1000);
    };
    
    const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // In a real app, you would have logic to change password.
        setTimeout(() => {
            setLoading(false);
            setMessage('Password changed successfully!');
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setMessage(''), 3000);
        }, 1000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="p-4 space-y-6">
            {loading && <LoadingModal />}
            <h1 className="text-2xl font-bold">My Profile</h1>
            {message && <div className="p-3 bg-green-100 text-green-800 rounded-md">{message}</div>}

            <ReactRouterDOM.Link to="/wishlist" className="block w-full bg-white p-4 rounded-lg shadow-md text-lg font-semibold text-gray-700 hover:bg-gray-50 flex justify-between items-center">
                <span><i className="fas fa-heart text-red-500 mr-3"></i>My Wishlist</span>
                <i className="fas fa-chevron-right text-gray-400"></i>
            </ReactRouterDOM.Link>

            {/* Profile Info Form */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full mt-1 px-3 py-2 border rounded-md"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-black">Save Changes</button>
                </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-gray-600">Current Password</label>
                        <input type="password" required className="w-full mt-1 px-3 py-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-600">New Password</label>
                        <input type="password" required className="w-full mt-1 px-3 py-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Update Password</button>
                </form>
            </div>

            <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600">
                Logout
            </button>
        </div>
    );
};

export default ProfilePage;
