
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fechar sidebar automaticamente em dispositivos móveis ao mudar de rota
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  if (isLoading) {
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white-dark p-4 md:p-6 transition-all duration-300">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
