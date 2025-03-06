
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
