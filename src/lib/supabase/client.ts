
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e chave anônima são necessárias. Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const generateUniqueId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
};

// Função para ajudar no debug durante o desenvolvimento
export const testConnection = async () => {
  try {
    // Testar se conseguimos fazer uma consulta básica
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      return { success: false, error };
    }
    
    console.log('Conexão com o Supabase estabelecida com sucesso!');
    return { success: true, data };
  } catch (e) {
    console.error('Erro ao testar conexão:', e);
    return { success: false, error: e };
  }
};
