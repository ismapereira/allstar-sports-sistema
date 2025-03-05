
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

type LoginProps = {
  setAuthStatus: (status: boolean) => void;
};

const Login = ({ setAuthStatus }: LoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação simples para os dois proprietários
      if ((email === 'proprietario1@allstar.com' && password === 'admin123') || 
          (email === 'proprietario2@allstar.com' && password === 'admin123')) {
        // Armazenando dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
        
        // Atualizando status de autenticação
        setAuthStatus(true);
        
        // Notificação de sucesso
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao AllStar Sports Hub!",
        });
        
        // Redirecionando para o dashboard
        navigate('/dashboard');
      } else {
        // Exibe erro de login
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no servidor",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white-dark">
      {/* Lado esquerdo - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center">
        <div className="max-w-md text-white p-8 animate-fade-in">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/77fe372d-aafb-4154-991b-b76d4af34cf5.png" 
              alt="AllStar Sports Logo" 
              className="h-32" 
            />
          </div>
          <p className="text-lg mb-8">
            Plataforma de administração para gerenciamento de produtos
            esportivos de futebol e basquete.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>Gestão de clientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>Controle de pedidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>Catálogo de produtos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <span>Relatórios financeiros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center mb-6 lg:hidden">
              <img 
                src="/lovable-uploads/77fe372d-aafb-4154-991b-b76d4af34cf5.png" 
                alt="AllStar Sports Logo" 
                className="h-24" 
              />
            </div>
            <h2 className="text-3xl font-bold text-secondary">Bem-vindo</h2>
            <p className="mt-2 text-gray-600">
              Faça login para acessar o painel de controle
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </span>
              ) : "Entrar"}
            </Button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                Credenciais de acesso: proprietario1@allstar.com / admin123
              </p>
              <p className="mt-1">
                ou: proprietario2@allstar.com / admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
