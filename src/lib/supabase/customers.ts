
import { supabase } from './client';
import type { Customer } from './types';

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
