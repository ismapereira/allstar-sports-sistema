
import { supabase, generateUniqueId } from './client';
import type { Order, OrderItem } from './types';

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }
  
  return data;
}

export async function fetchOrderById(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Erro ao buscar pedido ${id}:`, error);
    throw error;
  }
  
  return data;
}

export async function fetchOrdersWithDetails() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (id, name, email, phone)
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar pedidos com detalhes:', error);
    throw error;
  }
  
  return data;
}

export async function fetchOrderWithItems(id: string) {
  // Buscar o pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      customers:customer_id (id, name, email, phone)
    `)
    .eq('id', id)
    .single();
    
  if (orderError) {
    console.error(`Erro ao buscar pedido ${id}:`, orderError);
    throw orderError;
  }
  
  // Buscar os itens do pedido
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      products:product_id (id, name, price, category, image_url)
    `)
    .eq('order_id', id);
    
  if (itemsError) {
    console.error(`Erro ao buscar itens do pedido ${id}:`, itemsError);
    throw itemsError;
  }
  
  return { ...order, items: orderItems };
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) {
  // Gerar ID único para o pedido
  const orderId = generateUniqueId('ord_');
  
  // Iniciar uma transação
  const { error: orderError } = await supabase
    .from('orders')
    .insert([{
      id: orderId,
      ...orderData,
      created_at: new Date().toISOString()
    }]);
    
  if (orderError) {
    console.error('Erro ao criar pedido:', orderError);
    throw orderError;
  }
  
  // Preparar itens do pedido com o ID do pedido
  const orderItems = items.map(item => ({
    id: generateUniqueId('itm_'),
    order_id: orderId,
    ...item
  }));
  
  // Inserir itens do pedido
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) {
    console.error('Erro ao adicionar itens do pedido:', itemsError);
    throw itemsError;
  }
  
  // Atualizar estoque dos produtos
  for (const item of items) {
    const { error: stockError } = await supabase.rpc('update_product_stock', {
      product_id: item.product_id,
      quantity: -item.quantity
    });
    
    if (stockError) {
      console.error(`Erro ao atualizar estoque do produto ${item.product_id}:`, stockError);
      // Continuar mesmo com erro para não interromper a transação
    }
  }
  
  return { orderId };
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
    
  if (error) {
    console.error(`Erro ao atualizar status do pedido ${id}:`, error);
    throw error;
  }
  
  return data?.[0];
}

export async function deleteOrder(id: string) {
  // Primeiro excluir os itens do pedido
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', id);
    
  if (itemsError) {
    console.error(`Erro ao excluir itens do pedido ${id}:`, itemsError);
    throw itemsError;
  }
  
  // Depois excluir o pedido
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Erro ao excluir pedido ${id}:`, error);
    throw error;
  }
  
  return true;
}
