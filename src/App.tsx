
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Finance from "./pages/Finance";
import NotFound from "./pages/NotFound";

// Exemplos de autenticação rudimentar
// Em uma aplicação real, use um sistema mais robusto de autenticação
const fakeAuth = {
  isAuthenticated: false,
  signin(callback: () => void) {
    fakeAuth.isAuthenticated = true;
    setTimeout(callback, 100);
  },
  signout(callback: () => void) {
    fakeAuth.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const [authStatus, setAuthStatus] = useState<boolean>(() => {
    // Verifique se há um usuário autenticado no localStorage
    const user = localStorage.getItem('user');
    return !!user;
  });

  // Aqui poderia verificar um token JWT, mas por simplicidade apenas verificamos
  // se existe um registro no localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    setAuthStatus(!!user);
  }, []);

  // Protege as rotas que requerem autenticação
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authStatus) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redireciona a raiz para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rotas de autenticação */}
            <Route path="/login" element={<Login setAuthStatus={setAuthStatus} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="finance" element={<Finance />} />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
