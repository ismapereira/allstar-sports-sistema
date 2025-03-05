
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart4, 
  LogOut, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Clientes', 
      path: '/customers', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Pedidos', 
      path: '/orders', 
      icon: <ShoppingCart className="w-5 h-5" /> 
    },
    { 
      name: 'Produtos', 
      path: '/products', 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      name: 'Financeiro', 
      path: '/finance', 
      icon: <BarChart4 className="w-5 h-5" /> 
    },
  ];

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed z-50 h-full w-64 transform bg-secondary text-white transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:relative md:z-0"
        )}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-light">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold">AllStar Sports</span>
          </Link>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-full hover:bg-secondary-light md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Links de navegação */}
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-lg nav-item",
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-white-dark hover:bg-secondary-light"
              )}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* Rodapé com informações sobre os esportes */}
        <div className="mt-6 px-6">
          <div className="bg-secondary-light rounded-lg p-4 text-sm">
            <h4 className="font-medium mb-2">AllStar Sports</h4>
            <p className="text-white-dark mb-2">Especialista em produtos para:</p>
            <ul className="list-disc pl-4 text-white-dark">
              <li>Futebol</li>
              <li>Basquete</li>
            </ul>
          </div>
        </div>
        
        {/* Botão de saída */}
        <div className="absolute bottom-0 w-full p-4 border-t border-secondary-light">
          <Link
            to="/login"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-white-dark hover:bg-secondary-light"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Sair</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
