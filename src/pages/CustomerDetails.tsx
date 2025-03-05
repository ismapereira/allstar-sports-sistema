
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, UserCircle, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';

// Mock data - Em uma aplicação real, isso viria de uma API
const mockCustomer = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  phone: '(11) 98765-4321',
  address: 'Av. Paulista, 1000',
  city: 'São Paulo',
  state: 'SP',
  postalCode: '01310-100',
  country: 'Brasil',
  notes: 'Cliente VIP, sempre faz compras sazonais.',
  createdAt: '2023-01-15T10:30:00',
  orders: [
    { id: '101', date: '2023-06-10T14:30:00', status: 'Entregue', total: 450.90 },
    { id: '87', date: '2023-03-22T09:15:00', status: 'Entregue', total: 220.50 },
    { id: '64', date: '2022-11-05T16:45:00', status: 'Entregue', total: 375.20 },
  ]
};

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState(mockCustomer);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockCustomer);

  useEffect(() => {
    // Em uma aplicação real, faríamos uma chamada à API aqui
    // Simulando um carregamento
    const timer = setTimeout(() => {
      setCustomer(mockCustomer);
      setFormData(mockCustomer);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Em uma aplicação real, faríamos uma chamada PUT à API aqui
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Atualizar o estado local
      setCustomer(formData);
      setIsEditing(false);
      
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      // Em uma aplicação real, faríamos uma chamada DELETE à API aqui
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
      
      navigate('/customers');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o cliente.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(customer);
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 size={18} className="mr-1" /> Excluir
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
              >
                <Save size={18} className="mr-1" /> Editar
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Dados Básicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-gray-50">{customer.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-gray-50">{customer.email}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="px-3 py-2 border rounded-md bg-gray-50">{customer.phone}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="createdAt">Data de cadastro</Label>
                      <div className="px-3 py-2 border rounded-md bg-gray-50">
                        {formatDate(customer.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    {isEditing ? (
                      <Textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="px-3 py-2 border rounded-md bg-gray-50 min-h-[80px]">
                        {customer.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detalhes de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">CEP</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-gray-400 mt-0.5" size={18} />
                        <div>
                          <div>{customer.address}</div>
                          <div>{customer.city}, {customer.state} - {customer.postalCode}</div>
                          <div>{customer.country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="text-gray-400" size={18} />
                        <div>{customer.phone}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="text-gray-400" size={18} />
                        <div>{customer.email}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" size={18} />
                        <div>Cliente desde {formatDate(customer.createdAt)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orders && customer.orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Nº do Pedido</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Data</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">Status</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-600">Total</th>
                        <th className="py-3 px-4 text-center font-medium text-gray-600">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{formatDate(order.date)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === 'Entregue' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Cancelado' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              Ver detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Este cliente ainda não realizou nenhum pedido.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
