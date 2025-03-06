
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
  
  const newUser = {
    id: authData.user.id,
    email: userData.email,
    name: userData.name || '',
    role: userData.role || 'staff',
    created_at: new Date().toISOString(),
    is_active: true,
  };
  
  const { data, error } = await supabase
    .from('users')
    .insert([newUser])
    .select();
    
  if (error) {
    console.error('Erro ao adicionar dados do usuário na tabela personalizada:', error);
    throw error;
  }
  
  return data?.[0];
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
