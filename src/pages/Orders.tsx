
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';

// Tipos para os pedidos
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  date: string;
  items: OrderItem[];
  total: number;
  shippingMethod: string;
}

// Mock data - Em uma aplicação real, isso viria de uma API
const mockOrders: Order[] = [
  {
    id: '1001',
    customerId: '1',
    customerName: 'João Silva',
    status: 'Entregue',
    date: '2023-06-15T10:30:00',
    items: [
      { id: '1', productId: 'p1', productName: 'Camisa Oficial Barcelona', quantity: 1, price: 249.90 },
      { id: '2', productId: 'p5', productName: 'Meião Profissional', quantity: 2, price: 39.90 }
    ],
    total: 329.70,
    shippingMethod: 'Sedex'
  },
  {
    id: '1002',
    customerId: '2',
    customerName: 'Maria Oliveira',
    status: 'Em processamento',
    date: '2023-06-18T14:45:00',
    items: [
      { id: '3', productId: 'p3', productName: 'Bola de Futebol Profissional', quantity: 1, price: 179.90 }
    ],
    total: 179.90,
    shippingMethod: 'PAC'
  },
  {
    id: '1003',
    customerId: '3',
    customerName: 'Carlos Ferreira',
    status: 'Enviado',
    date: '2023-06-17T09:15:00',
    items: [
      { id: '4', productId: 'p8', productName: 'Chuteira Campo Adidas', quantity: 1, price: 399.90 },
      { id: '5', productId: 'p12', productName: 'Protetor de Canela', quantity: 1, price: 59.90 }
    ],
    total: 459.80,
    shippingMethod: 'Sedex'
  },
  {
    id: '1004',
    customerId: '4',
    customerName: 'Ana Santos',
    status: 'Pendente',
    date: '2023-06-19T16:20:00',
    items: [
      { id: '6', productId: 'p15', productName: 'Kit de Treinamento', quantity: 1, price: 299.90 }
    ],
    total: 299.90,
    shippingMethod: 'PAC'
  },
  {
    id: '1005',
    customerId: '5',
    customerName: 'Roberto Almeida',
    status: 'Cancelado',
    date: '2023-06-16T11:05:00',
    items: [
      { id: '7', productId: 'p7', productName: 'Camisa Seleção Brasil', quantity: 2, price: 219.90 }
    ],
    total: 439.80,
    shippingMethod: 'Sedex'
  }
];

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    // Em uma aplicação real, faríamos uma chamada à API aqui
    // Simulando um carregamento
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...orders];
    
    // Filtrar por busca (nome do cliente ou número do pedido)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.customerName.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por status
    if (statusFilter !== 'todos') {
      result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Aplicar ordenação
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const statuses = [
    { value: 'todos', label: 'Todos os status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'em processamento', label: 'Em processamento' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pedidos</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por pedido ou cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <SelectValue placeholder="Filtrar por status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Carregando pedidos...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('id')}
                          >
                            Pedido
                            {sortConfig?.key === 'id' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('customerName')}
                          >
                            Cliente
                            {sortConfig?.key === 'customerName' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('date')}
                          >
                            Data
                            {sortConfig?.key === 'date' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('status')}
                          >
                            Status
                            {sortConfig?.key === 'status' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-right">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('total')}
                          >
                            Total
                            {sortConfig?.key === 'total' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-4">#{order.id}</td>
                          <td className="py-4">{order.customerName}</td>
                          <td className="py-4">{formatDate(order.date)}</td>
                          <td className="py-4">
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">{formatCurrency(order.total)}</td>
                          <td className="py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/orders/${order.id}`)}
                                title="Ver detalhes"
                              >
                                <Eye size={18} />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Mais opções"
                                  >
                                    <MoreHorizontal size={18} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/customers/${order.customerId}`)}
                                  >
                                    Ver cliente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // Duplicar pedido (em uma app real, teria uma API call)
                                      alert('Funcionalidade para duplicar pedido');
                                    }}
                                  >
                                    Duplicar pedido
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 text-gray-400">
                    <Filter size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
                  <p className="text-gray-500 mt-1">
                    Tente ajustar os filtros ou termos de busca.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
