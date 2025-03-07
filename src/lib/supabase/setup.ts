
import { supabase } from './client';

// Este arquivo contém instruções para configurar o banco de dados Supabase

// Função para criar a tabela users se não existir
export async function setupDatabase() {
  console.log('Executando script de configuração do banco de dados...');
  
  const createUsersTable = `
  -- Tabela de usuários personalizada
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
  );
  
  -- Índices para melhorar performance
  CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);
  CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);
  
  -- Enable Row Level Security
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  `;
  
  console.log('Instruções SQL para criar a tabela users:');
  console.log(createUsersTable);
  
  const createRLSPolicies = `
  -- Política para permitir leitura para todos usuários autenticados
  CREATE POLICY IF NOT EXISTS "Permitir leitura para usuários autenticados"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);
  
  -- Política para permitir que usuários vejam seus próprios dados
  CREATE POLICY IF NOT EXISTS "Permitir leitura de próprio registro"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
  
  -- Política para permitir atualização do próprio registro
  CREATE POLICY IF NOT EXISTS "Permitir atualização de próprio registro"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
  
  -- Política especial para inserção inicial (pode precisar ser ajustada)
  CREATE POLICY IF NOT EXISTS "Permitir inserção inicial"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
  `;
  
  console.log('Instruções SQL para criar políticas RLS:');
  console.log(createRLSPolicies);
  
  // Instruções para criar usuário admin manualmente no Supabase
  console.log(`
  Para criar o primeiro usuário admin:
  
  1. No dashboard do Supabase, vá para Authentication > Users
  2. Clique em "Add User" e crie um usuário com e-mail e senha
  3. Copie o UUID gerado para o usuário
  4. Vá para SQL Editor e execute:
  
  INSERT INTO public.users (id, email, name, role, created_at, is_active)
  VALUES (
    'UUID-COPIADO-AQUI',
    'email-do-usuario@exemplo.com',
    'Nome do Administrador',
    'admin',
    NOW(),
    true
  );
  
  Depois disso, você poderá fazer login com este usuário admin.
  `);

  return {
    createUsersTable,
    createRLSPolicies
  };
}

// Função para criar usuário admin diretamente (isso só funcionará com uma service_role key)
export async function createInitialAdmin() {
  console.log(`
  Para criar o usuário admin inicial com service_role key (backend):
  
  1. Criar usuário no auth:
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@exemplo.com',
    password: 'senha-segura',
    email_confirm: true
  });
  
  2. Inserir na tabela users:
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{
      id: authData.user.id,
      email: 'admin@exemplo.com',
      name: 'Administrador',
      role: 'admin',
      created_at: new Date().toISOString(),
      is_active: true
    }])
    .select();
  `);
}

// Função para verificar se a tabela users existe
export async function checkUsersTable() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erro ao verificar tabela users:', error);
      console.log('É possível que a tabela não exista ou as permissões estejam incorretas.');
      return false;
    }
    
    console.log('Tabela users verificada com sucesso!');
    return true;
  } catch (e) {
    console.error('Exceção ao verificar tabela users:', e);
    return false;
  }
}
