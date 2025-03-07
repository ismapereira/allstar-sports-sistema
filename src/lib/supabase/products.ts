
import { supabase } from './client';
import type { Product } from './types';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
  
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function fetchProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Erro ao buscar produtos da categoria ${category}:`, error);
    throw error;
  }
  
  return data;
}

export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      created_at: new Date().toISOString()
    }])
    .select();
    
  if (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
  
  return data?.[0];
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

export async function updateProductStock(id: string, quantity: number) {
  // Primeiro buscar o estoque atual
  const { data: currentProduct, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    console.error(`Erro ao buscar estoque do produto ${id}:`, fetchError);
    throw fetchError;
  }
  
  const newStock = (currentProduct?.stock || 0) + quantity;
  
  // Atualizar o estoque
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao atualizar estoque do produto ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Erro ao excluir produto ${id}:`, error);
    throw error;
  }
  
  return true;
}
