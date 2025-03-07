
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase URL and API key
const supabaseUrl = 'https://vopncubbnimkvnfaruvy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcG5jdWJibmlta3ZuZmFydXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjY3ODksImV4cCI6MjA1NjgwMjc4OX0.IPQQorgNiZF7GHCHRAXy1bsyBbYfJtecw0MQOzU9kk8';

// Create the Supabase client
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
