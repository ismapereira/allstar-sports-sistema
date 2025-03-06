
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

// Função auxiliar para geração de IDs
export const generateUniqueId = (prefix: string) => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
};

// Funções auxiliares para o banco de dados

// Customers
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

// Funções similares para Products e Orders podem ser implementadas da mesma forma
