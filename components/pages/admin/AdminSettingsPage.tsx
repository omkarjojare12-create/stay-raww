
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LoadingModal } from '../../common/LoadingSpinner';

const AdminSettingsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call to update admin password
        setTimeout(() => {
            setMessage('Admin password updated successfully!');
            setLoading(false);
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setMessage(''), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {loading && <LoadingModal />}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>
            {message && <div className="p-3 bg-green-100 text-green-800 rounded-md mb-4">{message}</div>}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Change Admin Password</h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Admin Username</label>
                        <input type="text" value={currentUser?.isAdmin ? 'admin' : ''} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
