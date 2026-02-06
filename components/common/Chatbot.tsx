
import React, { useState, useEffect } from 'react';
// FIX: Changed to namespace import for react-router-dom to resolve module issues.
import * as ReactRouterDOM from 'react-router-dom';

// Import Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Import Layouts
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Import Common Components
import SplashScreen from './components/common/SplashScreen';

// Import User Pages
import LoginPage from './components/pages/user/LoginPage';
import HomePage from './components/pages/user/HomePage';
import ProductListPage from './components/pages/user/ProductListPage';
import ProductDetailPage from './components/pages/user/ProductDetailPage';
import CartPage from './components/pages/user/CartPage';
import CheckoutPage from './components/pages/user/CheckoutPage';
import OrderPage from './components/pages/user/OrderPage';
import ProfilePage from './components/pages/user/ProfilePage';
import WishlistPage from './components/pages/user/WishlistPage';
import SearchResultsPage from './components/pages/user/SearchResultsPage';

// Import Admin Pages
import AdminLoginPage from './components/pages/admin/AdminLoginPage';
import AdminHomePage from './components/pages/admin/AdminHomePage';
import AdminDashboardPage from './components/pages/admin/AdminDashboardPage';
import AdminCategoriesPage from './components/pages/admin/AdminCategoriesPage';
import AdminProductsPage from './components/pages/admin/AdminProductsPage';
import AdminOrdersPage from './components/pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './components/pages/admin/AdminOrderDetailPage';
import AdminUsersPage from './components/pages/admin/AdminUsersPage';
import AdminSettingsPage from './components/pages/admin/AdminSettingsPage';
import AdminBannersPage from './components/pages/admin/AdminBannersPage';
import AdminCouponsPage from './components/pages/admin/AdminCouponsPage';

const UserProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser && !currentUser.isAdmin ? <>{children}</> : <ReactRouterDOM.Navigate to="/login" />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser && currentUser.isAdmin ? <>{children}</> : <ReactRouterDOM.Navigate to="/admin/login" />;
};

const AppContent: React.FC = () => {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextmenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextmenu);

        // Disable text selection
        document.body.style.userSelect = 'none';

        return () => {
            document.removeEventListener('contextmenu', handleContextmenu);
            document.body.style.userSelect = 'auto';
        };
    }, []);

    return (
        <ReactRouterDOM.HashRouter>
            <ReactRouterDOM.Routes>
                {/* User Routes */}
                <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
                <ReactRouterDOM.Route path="/" element={<UserLayout />}>
                    <ReactRouterDOM.Route index element={<HomePage />} />
                    <ReactRouterDOM.Route path="category/:categoryId" element={<ProductListPage />} />
                    <ReactRouterDOM.Route path="product/:productId" element={<ProductDetailPage />} />
                    <ReactRouterDOM.Route path="search" element={<SearchResultsPage />} />
                    <ReactRouterDOM.Route path="cart" element={<UserProtectedRoute><CartPage /></UserProtectedRoute>} />
                    <ReactRouterDOM.Route path="checkout" element={<UserProtectedRoute><CheckoutPage /></UserProtectedRoute>} />
                    <ReactRouterDOM.Route path="orders" element={<UserProtectedRoute><OrderPage /></UserProtectedRoute>} />
                    <ReactRouterDOM.Route path="profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
                    <ReactRouterDOM.Route path="wishlist" element={<UserProtectedRoute><WishlistPage /></UserProtectedRoute>} />
                </ReactRouterDOM.Route>

                {/* Admin Routes */}
                <ReactRouterDOM.Route path="/admin/login" element={<AdminLoginPage />} />
                <ReactRouterDOM.Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <ReactRouterDOM.Route index element={<AdminHomePage />} />
                    <ReactRouterDOM.Route path="dashboard" element={<AdminDashboardPage />} />
                    <ReactRouterDOM.Route path="categories" element={<AdminCategoriesPage />} />
                    <ReactRouterDOM.Route path="products" element={<AdminProductsPage />} />
                    <ReactRouterDOM.Route path="orders" element={<AdminOrdersPage />} />
                    <ReactRouterDOM.Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
                    <ReactRouterDOM.Route path="users" element={<AdminUsersPage />} />
                    <ReactRouterDOM.Route path="settings" element={<AdminSettingsPage />} />
                    <ReactRouterDOM.Route path="banners" element={<AdminBannersPage />} />
                    <ReactRouterDOM.Route path="coupons" element={<AdminCouponsPage />} />
                </ReactRouterDOM.Route>

                {/* Fallback Route */}
                <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to="/" />} />
            </ReactRouterDOM.Routes>
        </ReactRouterDOM.HashRouter>
    );
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for the splash screen
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }
    
    return (
        <AuthProvider>
            <DataProvider>
                <WishlistProvider>
                    <CartProvider>
                        <AppContent />
                    </CartProvider>
                </WishlistProvider>
            </DataProvider>
        </AuthProvider>
    );
};

export default App;
