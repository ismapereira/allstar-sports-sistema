
// Este arquivo deve ser usado apenas em ambiente seguro (backend ou em ambiente de desenvolvimento)
// Não use em produção no frontend, pois expõe chaves de administrador

import { supabase } from './client';
import type { User } from './types';

// Função para inserir usuário diretamente na tabela users
// Esta função simula o que seria feito em um contexto seguro (backend)
export async function insertUserRow(userData: {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
}) {
  const newUser = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    created_at: new Date().toISOString(),
    is_active: true,
  };
  
  console.log('Tentando inserir usuário na tabela users:', newUser);
  
  try {
    // Esta operação provavelmente falhará devido às políticas de RLS
    // Em um ambiente real, isso seria feito através de um backend seguro
    // ou com uma chave service_role do Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select();
      
    if (error) {
      console.error('Erro ao inserir usuário na tabela:', error);
      
      console.log(`
      Para inserir manualmente este usuário, execute o seguinte SQL no Supabase:
      
      INSERT INTO public.users (id, email, name, role, created_at, is_active) 
      VALUES (
        '${newUser.id}', 
        '${newUser.email}', 
        '${newUser.name}', 
        '${newUser.role}', 
        '${newUser.created_at}', 
        ${newUser.is_active}
      );
      `);
      
      throw error;
    }
    
    return data?.[0];
  } catch (error) {
    console.error('Exceção ao inserir usuário:', error);
    throw error;
  }
}

// Guia para configurar RLS corretamente para permitir inserções
export function generateRLSPolicies() {
  const policies = `
  -- Política para permitir que usuários autenticados leiam a tabela users
  CREATE POLICY "Permitir leitura para usuários autenticados" 
  ON public.users 
  FOR SELECT 
  TO authenticated 
  USING (true);
  
  -- Política para permitir que um usuário veja apenas seu próprio registro
  CREATE POLICY "Permitir leitura de próprio registro" 
  ON public.users 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);
  
  -- Política para permitir que admins criem novos usuários
  CREATE POLICY "Permitir admins criarem usuários" 
  ON public.users 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
  
  -- Política para permitir que admins atualizem usuários
  CREATE POLICY "Permitir admins atualizarem usuários" 
  ON public.users 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
  `;
  
  console.log('Políticas RLS sugeridas:');
  console.log(policies);
  
  return policies;
}
