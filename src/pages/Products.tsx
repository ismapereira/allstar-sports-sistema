
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

// Tipos para os produtos
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
  description: string;
  price: number;
  stock: number;
  supplier: string;
  priceHistory: ProductPriceHistory[];
  image?: string;
}

// Mock data - Em uma aplicação real, isso viria de uma API
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Camisa Oficial Barcelona',
    sku: 'CAM-BAR-001',
    category: 'Camisas',
    description: 'Camisa oficial do FC Barcelona, temporada 2023/2024.',
    price: 249.90,
    stock: 15,
    supplier: 'Nike International',
    priceHistory: [
      { id: 'ph1', date: '2023-01-10', price: 229.90 },
      { id: 'ph2', date: '2023-04-15', price: 239.90 },
      { id: 'ph3', date: '2023-06-01', price: 249.90 }
    ]
  },
  {
    id: 'p2',
    name: 'Camisa Oficial Real Madrid',
    sku: 'CAM-RMA-001',
    category: 'Camisas',
    description: 'Camisa oficial do Real Madrid, temporada 2023/2024.',
    price: 249.90,
    stock: 12,
    supplier: 'Adidas International',
    priceHistory: [
      { id: 'ph4', date: '2023-01-10', price: 229.90 },
      { id: 'ph5', date: '2023-04-15', price: 249.90 }
    ]
  },
  {
    id: 'p3',
    name: 'Bola de Futebol Profissional',
    sku: 'BOL-PRO-001',
    category: 'Equipamentos',
    description: 'Bola de futebol profissional, modelo oficial da Liga dos Campeões da Europa.',
    price: 179.90,
    stock: 30,
    supplier: 'Adidas International',
    priceHistory: [
      { id: 'ph6', date: '2023-01-10', price: 159.90 },
      { id: 'ph7', date: '2023-03-20', price: 169.90 },
      { id: 'ph8', date: '2023-05-15', price: 179.90 }
    ]
  },
  {
    id: 'p4',
    name: 'Chuteira Campo Predator',
    sku: 'CHU-PRE-001',
    category: 'Calçados',
    description: 'Chuteira para campo, modelo Predator, para jogadores profissionais.',
    price: 399.90,
    stock: 8,
    supplier: 'Adidas International',
    priceHistory: [
      { id: 'ph9', date: '2023-01-15', price: 379.90 },
      { id: 'ph10', date: '2023-04-20', price: 399.90 }
    ]
  },
  {
    id: 'p5',
    name: 'Meião Profissional',
    sku: 'MEI-PRO-001',
    category: 'Acessórios',
    description: 'Meião profissional para prática de futebol, com tecnologia de absorção de impacto.',
    price: 39.90,
    stock: 45,
    supplier: 'Nike International',
    priceHistory: [
      { id: 'ph11', date: '2023-01-10', price: 34.90 },
      { id: 'ph12', date: '2023-05-01', price: 39.90 }
    ]
  }
];

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'priceHistory'>>({
    name: '',
    sku: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    supplier: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Em uma aplicação real, faríamos uma chamada à API aqui
    // Simulando um carregamento
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Filtrar por busca (nome ou SKU)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.sku.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoria
    if (categoryFilter !== 'todas') {
      result = result.filter(product => product.category === categoryFilter);
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
    
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, sortConfig]);

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleAddProduct = async () => {
    // Validação básica
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.price) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }
    
    try {
      // Em uma aplicação real, faríamos uma chamada POST à API aqui
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Criar novo produto (simulando uma resposta da API)
      const createdProduct: Product = {
        ...newProduct,
        id: `p${products.length + 1}`,
        priceHistory: [
          { id: `ph-new-${Date.now()}`, date: new Date().toISOString(), price: newProduct.price }
        ]
      };
      
      // Atualizar a lista de produtos
      setProducts([...products, createdProduct]);
      
      // Limpar o formulário
      setNewProduct({
        name: '',
        sku: '',
        category: '',
        description: '',
        price: 0,
        stock: 0,
        supplier: ''
      });
      
      // Fechar o diálogo
      setIsDialogOpen(false);
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso ao catálogo.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o produto.",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      // Em uma aplicação real, faríamos uma chamada DELETE à API aqui
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Atualizar a lista de produtos
      setProducts(products.filter(product => product.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso do catálogo.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o produto.",
      });
    }
  };

  // Extrair categorias únicas dos produtos
  const categories = ['todas', ...Array.from(new Set(products.map(product => product.category)))];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-1" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo produto para adicioná-lo ao catálogo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU*</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria*</Label>
                  <Input
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={newProduct.supplier}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)*</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque*</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddProduct}>Adicionar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <SelectValue placeholder="Filtrar por categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'todas' ? 'Todas as categorias' : category}
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
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('name')}
                          >
                            Nome
                            {sortConfig?.key === 'name' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-left">SKU</th>
                        <th className="pb-3 font-medium text-left">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('category')}
                          >
                            Categoria
                            {sortConfig?.key === 'category' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-right">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('price')}
                          >
                            Preço
                            {sortConfig?.key === 'price' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-right">
                          <Button 
                            variant="ghost" 
                            className="font-medium text-sm"
                            onClick={() => handleSort('stock')}
                          >
                            Estoque
                            {sortConfig?.key === 'stock' && (
                              <ArrowUpDown size={16} className="ml-1" />
                            )}
                          </Button>
                        </th>
                        <th className="pb-3 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="py-4">{product.name}</td>
                          <td className="py-4">{product.sku}</td>
                          <td className="py-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">{formatCurrency(product.price)}</td>
                          <td className="py-4 text-right">
                            <span className={`font-medium ${product.stock <= 5 ? 'text-red-500' : product.stock <= 10 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Ver detalhes"
                                onClick={() => navigate(`/products/${product.id}`)}
                              >
                                <Eye size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Editar"
                                onClick={() => navigate(`/products/${product.id}?edit=true`)}
                              >
                                <Edit size={18} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Excluir"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </Button>
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
                  <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
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

export default Products;
