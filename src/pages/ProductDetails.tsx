
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, DollarSign, LineChart, Package2, Tag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PriceHistory {
  id: string;
  date: string;
  price: number;
  notes?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  currentPrice: number;
  stock: number;
  priceHistory: PriceHistory[];
  supplier: {
    name: string;
    email: string;
    country: string;
  };
  lastUpdated: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simular busca do produto pelo ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        // Em uma aplicação real, isso seria uma chamada de API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados simulados do produto
        const mockProduct: Product = {
          id: id || '1',
          name: 'Tênis AllStar Pro Elite',
          description: 'Tênis de corrida profissional com tecnologia de absorção de impacto e materiais respiráveis.',
          sku: 'ASP-2023-001',
          category: 'Calçados Esportivos',
          currentPrice: 249.90,
          stock: 42,
          priceHistory: [
            { id: 'ph1', date: '2023-01-15', price: 219.90, notes: 'Preço inicial de lançamento' },
            { id: 'ph2', date: '2023-04-10', price: 229.90, notes: 'Ajuste sazonal' },
            { id: 'ph3', date: '2023-07-22', price: 239.90, notes: 'Aumento devido à taxa de importação' },
            { id: 'ph4', date: '2023-11-28', price: 249.90, notes: 'Atualização anual de preço' }
          ],
          supplier: {
            name: 'GlobalSport Inc.',
            email: 'contact@globalsport.com',
            country: 'Coreia do Sul'
          },
          lastUpdated: '2023-12-15'
        };
        
        setProduct(mockProduct);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar produto",
          description: "Não foi possível obter os detalhes do produto. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-1">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
          <p className="text-sm text-gray-500">Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-xl text-gray-600">Produto não encontrado</p>
        <Link to="/products">
          <Button variant="outline">Voltar para lista de produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Link to="/products">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            Editar Produto
          </Button>
          <Button>
            Atualizar Preço
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.category}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Descrição</p>
                <p>{product.description}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">SKU: {product.sku}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Estoque: {product.stock} unidades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Preço Atual: R$ {product.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Última Atualização: {product.lastUpdated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p>{product.supplier.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{product.supplier.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">País</p>
              <p>{product.supplier.country}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contatar Fornecedor
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="price-history">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="price-history">Histórico de Preços</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="price-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5" />
                <span>Histórico de Preços</span>
              </CardTitle>
              <CardDescription>
                Registro histórico de alterações de preços deste produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Data</th>
                      <th className="text-left py-3 px-4 font-medium">Preço (R$)</th>
                      <th className="text-left py-3 px-4 font-medium">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.priceHistory.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.date}</td>
                        <td className="py-3 px-4">{item.price.toFixed(2)}</td>
                        <td className="py-3 px-4">{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Venda</CardTitle>
              <CardDescription>
                Dados de desempenho deste produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4">
                <p className="text-gray-500">As estatísticas detalhadas estarão disponíveis em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetails;
