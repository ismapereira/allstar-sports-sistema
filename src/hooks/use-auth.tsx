
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { fetchUserByEmail } from '@/lib/supabase/users';
import { toast } from "sonner";

// Tipo para o usuário autenticado
type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

// Tipo para o contexto de autenticação
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider para o contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um usuário na sessão do Supabase
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar informações adicionais do usuário
          const userData = await fetchUserByEmail(session.user.email || '');

          if (userData) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: userData.name,
              role: userData?.role || 'user',
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Buscar informações adicionais do usuário
            const userData = await fetchUserByEmail(session.user.email || '');

            if (userData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: userData.name,
                role: userData?.role || 'user',
              });
            }
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Buscar informações adicionais do usuário
        const userData = await fetchUserByEmail(data.user.email || '');

        if (userData) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: userData.name,
            role: userData?.role || 'user',
          });

          toast.success("Login realizado com sucesso", {
            description: "Bem-vindo ao AllStar Sports Hub!",
          });

          navigate('/dashboard');
        } else {
          // O usuário existe na auth mas não na tabela users
          console.error('Usuário autenticado, mas não encontrado na tabela users');
          toast.error("Erro ao fazer login", {
            description: "Conta de usuário incompleta. Contate o administrador.",
          });
          
          // Fazer logout
          await supabase.auth.signOut();
          throw new Error('Usuário não encontrado na tabela users');
        }
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error("Erro ao fazer login", {
        description: error.message || "Email ou senha incorretos. Tente novamente.",
      });
      throw error;
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success("Logout realizado com sucesso");
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error("Erro ao sair", {
        description: "Ocorreu um erro ao tentar sair da sua conta.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar a autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
