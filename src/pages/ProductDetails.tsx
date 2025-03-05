
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Edit, BarChart2, Info, Package, FileText, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProductPriceHistory {
  id: string;
  date: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subCategory: string;
  sport: 'Futebol' | 'Basquete';
  description: string;
  price: number;
  stock: number;
  supplier: string;
  priceHistory: ProductPriceHistory[];
  image?: string;
}

// Mock data para exemplo
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Camisa FAN Barcelona',
    sku: 'FF-BAR-001',
    category: 'Camisas',
    subCategory: 'FAN Masculina',
    sport: 'Futebol',
    description: 'Camisa versão FAN do FC Barcelona, temporada 2023/2024.',
    price: 199.90,
    stock: 15,
    supplier: 'Nike International',
    priceHistory: [
      { id: 'ph1', date: '2023-01-10', price: 189.90 },
      { id: 'ph2', date: '2023-04-15', price: 199.90 }
    ]
  },
  {
    id: 'p2',
    name: 'Camisa FAN Real Madrid',
    sku: 'FF-RMA-001',
    category: 'Camisas',
    subCategory: 'FAN Feminina',
    sport: 'Futebol',
    description: 'Camisa versão FAN feminina do Real Madrid, temporada 2023/2024.',
    price: 199.90,
    stock: 12,
    supplier: 'Adidas International',
    priceHistory: [
      { id: 'ph4', date: '2023-01-10', price: 189.90 },
      { id: 'ph5', date: '2023-04-15', price: 199.90 }
    ]
  },
  {
    id: 'p3',
    name: 'Camisa Player Liverpool',
    sku: 'CP-LIV-001',
    category: 'Camisas',
    subCategory: 'Player',
    sport: 'Futebol',
    description: 'Camisa versão Player do Liverpool, idêntica ao usado pelos jogadores.',
    price: 349.90,
    stock: 8,
    supplier: 'Nike International',
    priceHistory: [
      { id: 'ph6', date: '2023-01-10', price: 329.90 },
      { id: 'ph7', date: '2023-03-20', price: 349.90 }
    ]
  },
  {
    id: 'p4',
    name: 'Camisa Retrô Milan 2007',
    sku: 'CR-MIL-007',
    category: 'Camisas',
    subCategory: 'Retrô',
    sport: 'Futebol',
    description: 'Camisa retrô do Milan campeão da Champions League 2007.',
    price: 249.90,
    stock: 10,
    supplier: 'Vintage Sports',
    priceHistory: [
      { id: 'ph9', date: '2023-01-15', price: 229.90 },
      { id: 'ph10', date: '2023-04-20', price: 249.90 }
    ]
  },
  {
    id: 'p5',
    name: 'Jersey NBA Lakers',
    sku: 'JB-LAK-023',
    category: 'Jersey',
    subCategory: 'NBA',
    sport: 'Basquete',
    description: 'Jersey oficial do Los Angeles Lakers, temporada 2023/2024.',
    price: 299.90,
    stock: 15,
    supplier: 'Nike International',
    priceHistory: [
      { id: 'ph11', date: '2023-01-10', price: 279.90 },
      { id: 'ph12', date: '2023-05-01', price: 299.90 }
    ]
  }
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'priceHistory'>>({
    name: '',
    sku: '',
    category: '',
    subCategory: '',
    sport: 'Futebol',
    description: '',
    price: 0,
    stock: 0,
    supplier: ''
  });
  const [newPrice, setNewPrice] = useState<string>('');
  
  // Opções de categorias de produtos para o formulário
  const productCategories = [
    'Camisas',
    'Jersey',
    'Kit Infantil',
    'Regatas',
    'Shorts'
  ];
  
  // Opções de subcategorias de produtos
  const productSubCategories = [
    'FAN Masculina',
    'FAN Feminina',
    'Player',
    'Retrô',
    'NBA',
    'Futebol'
  ];

  useEffect(() => {
    // Em uma app real, aqui faríamos uma chamada à API para buscar detalhes do produto
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Simulando delay de API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Buscar produto por ID
        const foundProduct = mockProducts.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name,
            sku: foundProduct.sku,
            category: foundProduct.category,
            subCategory: foundProduct.subCategory,
            sport: foundProduct.sport,
            description: foundProduct.description,
            price: foundProduct.price,
            stock: foundProduct.stock,
            supplier: foundProduct.supplier
          });
          setNewPrice(foundProduct.price.toString());
        } else {
          toast({
            variant: "destructive",
            title: "Produto não encontrado",
            description: "O produto solicitado não existe ou foi removido.",
          });
          navigate('/products');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar produto",
          description: "Ocorreu um erro ao buscar dados do produto.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    
    // Verificar se precisa entrar em modo de edição
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('edit') === 'true') {
      setEditMode(true);
    }
  }, [id, navigate, toast, location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    if (!product) return;
    
    try {
      // Em uma aplicação real, aqui faríamos uma chamada PUT à API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar se o preço foi alterado
      const priceChanged = formData.price !== product.price;
      
      // Criar nova entrada no histórico de preços se o preço foi alterado
      let updatedPriceHistory = [...product.priceHistory];
      if (priceChanged) {
        updatedPriceHistory.push({
          id: `ph-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          price: formData.price
        });
      }
      
      // Atualizar produto local
      const updatedProduct: Product = {
        ...product,
        ...formData,
        priceHistory: updatedPriceHistory
      };
      
      setProduct(updatedProduct);
      setEditMode(false);
      
      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações.",
      });
    }
  };

  const handleAddPriceHistory = async () => {
    if (!product || !newPrice || isNaN(parseFloat(newPrice))) return;
    
    try {
      // Em uma aplicação real, aqui faríamos uma chamada POST à API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Adicionar nova entrada no histórico de preços
      const updatedPriceHistory = [
        ...product.priceHistory,
        {
          id: `ph-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          price: parseFloat(newPrice)
        }
      ];
      
      // Atualizar produto com novo preço e histórico
      const updatedProduct: Product = {
        ...product,
        price: parseFloat(newPrice),
        priceHistory: updatedPriceHistory
      };
      
      setProduct(updatedProduct);
      setFormData(prev => ({
        ...prev,
        price: parseFloat(newPrice)
      }));
      setNewPrice('');
      
      toast({
        title: "Preço atualizado",
        description: "O novo preço foi registrado com sucesso no histórico.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar preço",
        description: "Ocorreu um erro ao adicionar o novo preço.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-60">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes do produto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-60">
          <div className="text-center">
            <Info size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Produto não encontrado</h3>
            <p className="text-gray-500 mt-1 mb-4">
              O produto solicitado não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft size={16} className="mr-2" /> Voltar para Produtos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/products')}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">{editMode ? 'Editar Produto' : 'Detalhes do Produto'}</h1>
        </div>
        <div>
          {editMode ? (
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" /> Salvar Alterações
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit size={16} className="mr-2" /> Editar Produto
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details" className="flex items-center">
                <Info size={16} className="mr-2" /> Informações
              </TabsTrigger>
              <TabsTrigger value="price-history" className="flex items-center">
                <BarChart2 size={16} className="mr-2" /> Histórico de Preços
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center">
                <Package size={16} className="mr-2" /> Estoque
              </TabsTrigger>
              <TabsTrigger value="description" className="flex items-center">
                <FileText size={16} className="mr-2" /> Descrição
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Detalhes gerais do produto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Produto</Label>
                      {editMode ? (
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">{product.name}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      {editMode ? (
                        <Input
                          id="sku"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">{product.sku}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      {editMode ? (
                        <Select
                          name="category"
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">{product.category}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subCategory">Subcategoria</Label>
                      {editMode ? (
                        <Select
                          name="subCategory"
                          value={formData.subCategory}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, subCategory: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma subcategoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {productSubCategories.map(subCategory => (
                              <SelectItem key={subCategory} value={subCategory}>
                                {subCategory}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">{product.subCategory}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sport">Esporte</Label>
                      {editMode ? (
                        <Select
                          name="sport"
                          value={formData.sport}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, sport: value as 'Futebol' | 'Basquete' }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um esporte" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Futebol">Futebol</SelectItem>
                            <SelectItem value="Basquete">Basquete</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">
                          <Badge variant={product.sport === 'Futebol' ? "default" : "secondary"}>
                            {product.sport}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Fornecedor</Label>
                      {editMode ? (
                        <Input
                          id="supplier"
                          name="supplier"
                          value={formData.supplier}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border">{product.supplier}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="price-history">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Preços</CardTitle>
                  <CardDescription>Registros de alterações de preço ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-end gap-4 mb-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="newPrice">Adicionar Novo Preço (R$)</Label>
                        <Input
                          id="newPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <Button onClick={handleAddPriceHistory}>Adicionar</Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Preço atual: <span className="font-medium text-green-600">{formatCurrency(product.price)}</span>
                    </p>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Variação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.priceHistory.length > 0 ? (
                        product.priceHistory
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry, index, arr) => {
                            // Calcular variação de preço
                            const previousPrice = index < arr.length - 1 ? arr[index + 1].price : entry.price;
                            const priceChange = entry.price - previousPrice;
                            const priceChangePercent = previousPrice > 0 
                              ? (priceChange / previousPrice) * 100 
                              : 0;
                            
                            return (
                              <TableRow key={entry.id}>
                                <TableCell>
                                  {entry.date}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(entry.price)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {index < arr.length - 1 && (
                                    <span className={`${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {priceChange >= 0 ? '+' : ''}
                                      {formatCurrency(priceChange)} ({priceChangePercent.toFixed(2)}%)
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                            Nenhum histórico de preço disponível
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Estoque</CardTitle>
                  <CardDescription>Gerenciamento de estoque do produto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="stock">Quantidade em Estoque</Label>
                      {editMode ? (
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className={`text-3xl font-bold ${
                          product.stock <= 5 ? 'text-red-500' : 
                          product.stock <= 10 ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>
                          {product.stock}
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        Status: {' '}
                        <Badge variant={
                          product.stock <= 5 ? "destructive" : 
                          product.stock <= 10 ? "outline" : 
                          "default"
                        }>
                          {product.stock <= 5 ? 'Crítico' : 
                           product.stock <= 10 ? 'Baixo' : 
                           'Disponível'}
                        </Badge>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Status de Estoque</h4>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            product.stock <= 5 ? 'bg-red-500' : 
                            product.stock <= 10 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(product.stock * 5, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>10</span>
                        <span>20+</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>Descrição do Produto</CardTitle>
                  <CardDescription>Informações detalhadas sobre o produto</CardDescription>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <Textarea
                      className="min-h-[150px]"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="prose max-w-none">
                      <p>{product.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Produto</CardTitle>
              <CardDescription>Informações principais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border">
                <div className="bg-white p-10 rounded-lg mb-3 border">
                  <Package size={64} className="mx-auto text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">{product.sport} / {product.category}</p>
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Categoria:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subcategoria:</span>
                  <span className="font-medium">{product.subCategory}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Esporte:</span>
                  <span className="font-medium">{product.sport}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estoque:</span>
                  <span className={`font-medium ${
                    product.stock <= 5 ? 'text-red-500' : 
                    product.stock <= 10 ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>{product.stock} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fornecedor:</span>
                  <span className="font-medium">{product.supplier}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h4 className="text-sm font-medium">Histórico de Preços</h4>
                <div className="space-y-1">
                  {product.priceHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map((entry) => (
                      <div key={entry.id} className="flex justify-between text-sm">
                        <span className="text-gray-500">{entry.date}:</span>
                        <span className="font-medium">{formatCurrency(entry.price)}</span>
                      </div>
                    ))}
                  {product.priceHistory.length > 3 && (
                    <div className="text-xs text-center text-primary cursor-pointer hover:underline mt-1">
                      Ver histórico completo
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {!editMode && (
                <Button 
                  className="w-full" 
                  onClick={() => setEditMode(true)}
                >
                  <Edit size={16} className="mr-2" /> Editar Produto
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/products')}
              >
                <ArrowLeft size={16} className="mr-2" /> Voltar para Lista
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
