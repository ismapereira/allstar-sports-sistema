
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Definição do esquema de validação
const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export interface RegisterProps {
  setAuthStatus: (status: boolean) => void;
}

const Register = ({ setAuthStatus }: RegisterProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Inicialização do formulário
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Função de submissão do formulário
  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    try {
      // Em uma app real, aqui faria uma chamada à API
      // Simulando um delay para o registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando sucesso do registro
      localStorage.setItem('user', JSON.stringify({ 
        name: data.name,
        email: data.email,
        role: 'admin',
      }));
      
      // Atualizar status de autenticação
      setAuthStatus(true);
      
      // Notificação de sucesso
      toast({
        title: "Registro concluído",
        description: "Sua conta foi criada com sucesso.",
      });
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
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
          <h1 className="text-4xl font-bold mb-6">AllStar Sports</h1>
          <p className="text-lg mb-8">
            Plataforma de administração para gerenciamento de dropshipping internacional
            de artigos esportivos.
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

      {/* Lado direito - Formulário de registro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary">Criar Conta</h2>
            <p className="mt-2 text-gray-600">
              Preencha o formulário para criar sua conta
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                ) : "Criar Conta"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <p>
              Já possui uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
