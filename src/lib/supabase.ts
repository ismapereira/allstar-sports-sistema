import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e chave anônima são necessárias');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  created_at: string;
  last_purchase_date?: string;
  total_purchases: number;
}

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  created_at: string;
  is_active: boolean;
}

export type Order = {
  id: string;
  customer_id: string;
  status: 'Pendente' | 'Em processamento' | 'Enviado' | 'Entregue' | 'Cancelado';
  created_at: string;
  total: number;
  shipping_method: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  payment_method: string;
  notes?: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export type User = {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'manager' | 'staff';
  created_at: string;
  last_sign_in?: string;
  avatar_url?: string;
  is_active: boolean;
}

export const generateUniqueId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
};

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
  
  return data;
}

export async function fetchCustomerById(id: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'total_purchases'>) {
  const newCustomer = {
    ...customer,
    total_purchases: 0,
    created_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('customers')
    .insert([newCustomer])
    .select();
    
  if (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
  
  return data?.[0];
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Erro ao excluir cliente ${id}:`, error);
    throw error;
  }
  
  return true;
}

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
