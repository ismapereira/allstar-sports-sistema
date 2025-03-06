
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

// Tipo para o usuário autenticado
type User = {
  id: string;
  email: string;
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
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há um usuário na sessão do Supabase
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar informações adicionais do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: userData?.role || 'user',
          });
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
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email, role')
              .eq('id', session.user.id)
              .single();

            if (userError) throw userError;

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: userData?.role || 'user',
            });
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
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: userData?.role || 'user',
        });

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao AllStar Sports Hub!",
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos. Tente novamente.",
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
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
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
