
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
