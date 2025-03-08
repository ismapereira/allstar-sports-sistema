
export type User = {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'manager' | 'staff';
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  created_at?: string;
  updated_at?: string;
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
  status?: 'active' | 'inactive';
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost_price?: number;
  category: 'futebol' | 'basquete' | 'acessorios';
  subcategory?: string;
  sku: string;
  stock_quantity: number;
  min_stock_quantity?: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  discount_percent?: number;
  brand?: string;
  size?: string;
  color?: string;
  weight?: number;
  dimensions?: string;
};

export type Order = {
  id: string;
  customer_id: string;
  customer?: Customer;
  order_date: string;
  status: 'pendente' | 'aprovado' | 'enviado' | 'entregue' | 'cancelado';
  payment_status: 'pendente' | 'pago' | 'reembolsado';
  payment_method?: 'credito' | 'debito' | 'pix' | 'boleto' | 'dinheiro';
  shipping_method?: string;
  shipping_cost?: number;
  tracking_code?: string;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount?: number;
  notes?: string;
};
