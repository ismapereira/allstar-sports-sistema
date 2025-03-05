
import { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

type NavbarProps = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Novo pedido recebido', time: '5 min atrás' },
    { id: 2, text: 'Atualização de preço pendente', time: '1 hora atrás' },
    { id: 3, text: 'Lembrete: reunião às 15h', time: '2 horas atrás' },
  ]);

  const hasUnreadNotifications = notifications.length > 0;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Menu para mobile */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md md:hidden hover:bg-gray-100"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6 text-secondary" />
        </button>

        {/* Logo e título da página atual (visível em diferentes dispositivos) */}
        <div className="flex items-center">
          <div className="md:hidden">
            <img 
              src="/lovable-uploads/77fe372d-aafb-4154-991b-b76d4af34cf5.png" 
              alt="AllStar Sports Logo" 
              className="h-8" 
            />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-secondary">AllStar Sports</h1>
          </div>
        </div>

        {/* Ações da direita */}
        <div className="flex items-center space-x-3">
          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">{notification.text}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary">
                    Ver todas
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  Sem notificações
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white">AS</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">Administrador</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" className="cursor-pointer text-red-500">
                  Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
