
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

export async function getCurrentUser() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao obter sessão:', sessionError);
      return null;
    }
    
    if (!sessionData.session?.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
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
  
  // Inserir dados na tabela users
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        email: userData.email,
        name: userData.name || '',
        role: userData.role || 'staff',
        is_active: true
      }
    ])
    .select();
  
  if (error) {
    console.error('Erro ao inserir dados do usuário:', error);
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
