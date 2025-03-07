
import { supabase } from './client';
import type { User } from './types';

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
  
  return data;
}

export async function fetchUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function fetchUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error(`Erro ao buscar usuário com email ${email}:`, error);
    throw error;
  }
  
  return data;
}

export async function createUser(userData: {
  email: string;
  password: string;
  name?: string;
  role?: 'admin' | 'manager' | 'staff';
}) {
  // Primeiro, criar o usuário no Auth do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });
    
  if (authError) {
    console.error('Erro ao criar usuário na autenticação:', authError);
    throw authError;
  }
  
  if (!authData.user) {
    throw new Error('Erro ao criar usuário: dados do usuário não retornados');
  }
  
  // Depois, inserir os dados complementares na tabela users
  // Para inserir na tabela users, precisamos usar o service_role key no backend
  // ou configurar RLS policies adequadas. Aqui, vamos apenas simular o processo:
  console.log(`Usuário ${userData.email} criado com sucesso no Auth!`);
  console.log(`ID do usuário: ${authData.user.id}`);
  console.log(`Para completar o cadastro, insira manualmente no banco de dados ou configure RLS adequadamente:`);
  console.log({
    id: authData.user.id,
    email: userData.email,
    name: userData.name || '',
    role: userData.role || 'staff',
    created_at: new Date().toISOString(),
    is_active: true,
  });
  
  return authData.user;
}

export async function updateUser(id: string, userData: Partial<User>) {
  const { id: _, email: __, ...updateData } = userData;
  
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

export async function resetUserPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
    
  if (error) {
    console.error(`Erro ao enviar redefinição de senha para ${email}:`, error);
    throw error;
  }
  
  return true;
}

export async function deactivateUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao desativar usuário ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

// Função auxiliar para criar usuário diretamente através do console
export async function createAdminUser() {
  const adminData = {
    email: 'admin@allstar.com',
    password: 'Admin@123',
    name: 'Administrador',
    role: 'admin' as const,
  };
  
  try {
    const user = await createUser(adminData);
    console.log('Usuário admin criado com sucesso:', user);
    return user;
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    throw error;
  }
}

// Outras funções úteis para gerenciamento de usuários
export async function createTestUsers() {
  const users = [
    {
      email: 'gerente@allstar.com',
      password: 'Gerente@123',
      name: 'Gerente Teste',
      role: 'manager' as const,
    },
    {
      email: 'vendedor@allstar.com',
      password: 'Vendedor@123',
      name: 'Vendedor Teste',
      role: 'staff' as const,
    }
  ];
  
  const results = [];
  
  for (const userData of users) {
    try {
      const user = await createUser(userData);
      console.log(`Usuário ${userData.email} criado com sucesso:`, user);
      results.push({ success: true, user });
    } catch (error) {
      console.error(`Erro ao criar usuário ${userData.email}:`, error);
      results.push({ success: false, error });
    }
  }
  
  return results;
}
