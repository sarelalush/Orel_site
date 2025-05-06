import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import Orders from './pages/account/Orders';
import History from './pages/account/History';
import Settings from './pages/account/Settings';
import Cart from './pages/Cart';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductEdit from './pages/admin/ProductEdit';
import Categories from './pages/admin/Categories';
import Coupons from './pages/admin/Coupons';
import Users from './pages/admin/Users';
import FixRLSPolicies from './pages/admin/FixRLSPolicies';
import ProductImagesManager from './pages/admin/ProductImagesManager';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Auth Routes */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
        <Route path="wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="account/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="account/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="account/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>}>
        <Route index element={<div>לוח בקרה</div>} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductEdit />} />
        <Route path="products/edit/:id" element={<ProductEdit />} />
        <Route path="product-images/:id" element={<ProductImagesManager />} />
        <Route path="categories" element={<Categories />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="users" element={<Users />} />
        <Route path="fix-rls" element={<FixRLSPolicies />} />
        <Route path="orders" element={<div>ניהול הזמנות</div>} />
        <Route path="customers" element={<div>לקוחות</div>} />
        <Route path="settings" element={<div>הגדרות</div>} />
      </Route>
    </Routes>
  );
}