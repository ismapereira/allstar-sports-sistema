
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from "sonner";
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import CustomerDetails from '@/pages/CustomerDetails';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import Orders from '@/pages/Orders';
import OrderDetails from '@/pages/OrderDetails';
import Finance from '@/pages/Finance';
import NotFound from '@/pages/NotFound';
import Setup from '@/pages/admin/Setup';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import './App.css';

// Componente para proteger rotas autenticadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white-dark">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gradient">AllStar Sports</h1>
          </div>
          <div className="mt-4">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Componente para proteger rotas de admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white-dark">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gradient">AllStar Sports</h1>
          </div>
          <div className="mt-4">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      </div>
    );
  }
  
  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      
      {/* Rota de setup - pode ser acessada sem login */}
      <Route path="/setup" element={<Setup />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/finance" element={<Finance />} />
        
        {/* Rotas administrativas */}
        <Route path="/admin" element={
          <AdminRoute>
            <Navigate to="/admin/setup" />
          </AdminRoute>
        } />
        <Route path="/admin/setup" element={
          <AdminRoute>
            <Setup />
          </AdminRoute>
        } />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
