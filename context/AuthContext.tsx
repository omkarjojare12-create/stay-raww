
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { users as mockUsers, admin as mockAdmin } from '../services/mockData';

interface AuthContextType {
    currentUser: (User & { isAdmin?: boolean }) | null;
    login: (email: string, pass: string) => Promise<boolean>;
    adminLogin: (user: string, pass: string) => Promise<boolean>;
    signup: (name: string, phone: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<(User & { isAdmin?: boolean }) | null>(null);

    const login = async (email: string, pass: string): Promise<boolean> => {
        const user = mockUsers.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser({ ...user, isAdmin: false });
            return true;
        }
        return false;
    };
    
    const adminLogin = async (user: string, pass: string): Promise<boolean> => {
        if (user === mockAdmin.username && pass === mockAdmin.password) {
            const adminUser: User = { 
                id: mockAdmin.id, 
                name: 'Admin',
                email: 'admin@stayraw.com',
                phone: '0000000000',
                created_at: new Date().toISOString(),
                isAdmin: true 
            };
            setCurrentUser(adminUser);
            return true;
        }
        return false;
    };

    const signup = async (name: string, phone: string, email: string, pass: string): Promise<boolean> => {
        if (mockUsers.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser: User = {
            id: mockUsers.length + 1,
            name,
            phone,
            email,
            password: pass,
            created_at: new Date().toISOString(),
        };
        mockUsers.push(newUser); // In a real app, this would be an API call
        setCurrentUser({ ...newUser, isAdmin: false });
        return true;
    };
    
    const updateProfile = (updatedUser: Partial<User>) => {
        setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : null);
        // In a real app, update the mockUsers array as well
        const userIndex = mockUsers.findIndex(u => u.id === currentUser?.id);
        if(userIndex > -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, adminLogin, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
