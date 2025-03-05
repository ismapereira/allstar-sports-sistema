
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, CreditCard, Package, User, Calendar, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';

// Tipos para o pedido
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
  customerEmail: string;
  status: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  shippingMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  notes: string;
}

// Mock data - Em uma aplicação real, isso viria de uma API
const mockOrder: Order = {
  id: '1001',
  customerId: '1',
  customerName: 'João Silva',
  customerEmail: 'joao.silva@exemplo.com',
  status: 'Entregue',
  date: '2023-06-15T10:30:00',
  items: [
    { id: '1', productId: 'p1', productName: 'Camisa Oficial Barcelona', quantity: 1, price: 249.90 },
    { id: '2', productId: 'p5', productName: 'Meião Profissional', quantity: 2, price: 39.90 }
  ],
  subtotal: 329.70,
  shipping: 25.00,
  taxes: 19.78,
  total: 374.48,
  shippingMethod: 'Sedex',
  shippingAddress: {
    street: 'Av. Paulista, 1000, Apto 123',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'Brasil'
  },
  paymentMethod: 'Cartão de Crédito',
  notes: 'Cliente solicitou embalagem para presente.'
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // Em uma aplicação real, faríamos uma chamada à API aqui
    // Simulando um carregamento
    const timer = setTimeout(() => {
      setOrder(mockOrder);
      setSelectedStatus(mockOrder.status);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    
    setSaving(true);
    
    try {
      // Em uma aplicação real, faríamos uma chamada PUT à API aqui
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Atualizar o estado local
      setOrder({
        ...order,
        status: newStatus
      });
      setSelectedStatus(newStatus);
      
      toast({
        title: "Status atualizado",
        description: `O status do pedido foi atualizado para ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o status do pedido.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Pedido não encontrado</h3>
          <p className="text-gray-500 mt-1">
            O pedido que você está procurando não existe ou foi removido.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/orders')}
          >
            Voltar para lista de pedidos
          </Button>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Em processamento', label: 'Em processamento' },
    { value: 'Enviado', label: 'Enviado' },
    { value: 'Entregue', label: 'Entregue' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <FileText size={18} className="mr-1" /> Imprimir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detalhes do Pedido</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="status">Status:</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={handleStatusChange}
                  disabled={saving}
                >
                  <SelectTrigger id="status" className={`w-40 ${getStatusColor(selectedStatus)}`}>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Data do pedido:</span>
                    <span>{formatDate(order.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Cliente:</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate(`/customers/${order.customerId}`)}
                    >
                      {order.customerName}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Itens do Pedido</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium">Produto</th>
                          <th className="pb-2 text-center font-medium">Qtd</th>
                          <th className="pb-2 text-right font-medium">Preço</th>
                          <th className="pb-2 text-right font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3">
                              <Button
                                variant="link"
                                className="p-0 h-auto text-left justify-start"
                                onClick={() => navigate(`/products/${item.productId}`)}
                              >
                                {item.productName}
                              </Button>
                            </td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                            <td className="py-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Frete:</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Impostos:</span>
                      <span>{formatCurrency(order.taxes)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={18} />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm text-gray-500">Nome:</h4>
                  <p>{order.customerName}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Email:</h4>
                  <p>{order.customerEmail}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate(`/customers/${order.customerId}`)}
                >
                  Ver perfil completo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck size={18} />
                Envio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm text-gray-500">Método de envio:</h4>
                  <p>{order.shippingMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Endereço de entrega:</h4>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={18} />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm text-gray-500">Método de pagamento:</h4>
                  <p>{order.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Status do pagamento:</h4>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Pago
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
