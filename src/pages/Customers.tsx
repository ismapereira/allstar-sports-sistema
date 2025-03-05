
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  Pencil,
  Trash2,
  UserRound,
  Download
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generateRandomId } from '@/lib/utils';

// Interface para os clientes
interface Customer {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  dataCadastro: string;
  ultimaCompra: string | null;
  totalCompras: number;
}

// Dados de exemplo
const mockCustomers: Customer[] = [
  {
    id: "C001",
    nome: "João Silva",
    email: "joao.silva@example.com",
    telefone: "(11) 98765-4321",
    cidade: "São Paulo",
    estado: "SP",
    dataCadastro: "2023-01-15",
    ultimaCompra: "2023-05-10",
    totalCompras: 3
  },
  {
    id: "C002",
    nome: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    telefone: "(21) 98765-1234",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    dataCadastro: "2023-02-20",
    ultimaCompra: "2023-05-18",
    totalCompras: 5
  },
  {
    id: "C003",
    nome: "Carlos Santos",
    email: "carlos.santos@example.com",
    telefone: "(31) 97654-3210",
    cidade: "Belo Horizonte",
    estado: "MG",
    dataCadastro: "2023-03-05",
    ultimaCompra: null,
    totalCompras: 0
  },
  {
    id: "C004",
    nome: "Ana Costa",
    email: "ana.costa@example.com",
    telefone: "(41) 99876-5432",
    cidade: "Curitiba",
    estado: "PR",
    dataCadastro: "2023-03-18",
    ultimaCompra: "2023-04-25",
    totalCompras: 2
  },
  {
    id: "C005",
    nome: "Roberto Almeida",
    email: "roberto.almeida@example.com",
    telefone: "(51) 98765-8765",
    cidade: "Porto Alegre",
    estado: "RS",
    dataCadastro: "2023-04-10",
    ultimaCompra: "2023-05-15",
    totalCompras: 4
  }
];

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'dataCadastro' | 'ultimaCompra' | 'totalCompras'>>({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    // Simulando API
    setTimeout(() => {
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filtragem de clientes com base na pesquisa
  const filteredCustomers = customers.filter(customer => 
    customer.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.cidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.estado.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Manipuladores para o formulário de novo cliente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingCustomer) {
      setEditingCustomer(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleAddCustomer = () => {
    const today = new Date().toISOString().split('T')[0];
    const newId = generateRandomId('C');
    
    const customerToAdd: Customer = {
      ...newCustomer,
      id: newId,
      dataCadastro: today,
      ultimaCompra: null,
      totalCompras: 0
    };
    
    setCustomers(prev => [customerToAdd, ...prev]);
    
    toast({
      title: "Cliente adicionado",
      description: `${newCustomer.nome} foi adicionado com sucesso.`,
    });
    
    // Limpar formulário
    setNewCustomer({
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: ''
    });
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;
    
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === editingCustomer.id ? editingCustomer : customer
      )
    );
    
    toast({
      title: "Cliente atualizado",
      description: `Os dados de ${editingCustomer.nome} foram atualizados.`,
    });
    
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = () => {
    if (!deletingCustomerId) return;
    
    const customerToDelete = customers.find(c => c.id === deletingCustomerId);
    
    setCustomers(prev => 
      prev.filter(customer => customer.id !== deletingCustomerId)
    );
    
    toast({
      title: "Cliente removido",
      description: `${customerToDelete?.nome} foi removido com sucesso.`,
    });
    
    setDeletingCustomerId(null);
  };

  const exportCustomers = () => {
    // Em um caso real, esta função geraria um CSV ou Excel
    const fileName = `clientes_allstar_${new Date().toISOString().slice(0, 10)}.csv`;
    
    toast({
      title: "Exportação iniciada",
      description: `Os dados estão sendo exportados para ${fileName}`,
    });
    
    // Simulação de download
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
      });
    }, 1500);
  };

  // Formatação de data para exibição
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Nunca';
    
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary animate-slide-in-left">
            Clientes
          </h1>
          <p className="text-gray-500 mt-1 animate-slide-in-left animate-delay-100">
            Gerencie os clientes da AllStar Sports
          </p>
        </div>
        
        <div className="flex items-center space-x-2 animate-slide-in-right">
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportCustomers}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo cliente
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input 
                      id="nome" 
                      name="nome"
                      placeholder="Nome do cliente" 
                      value={newCustomer.nome}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com" 
                      value={newCustomer.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      name="telefone"
                      placeholder="(00) 00000-0000" 
                      value={newCustomer.telefone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        name="cidade"
                        placeholder="Cidade" 
                        value={newCustomer.cidade}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="estado">Estado</Label>
                      <Input 
                        id="estado" 
                        name="estado"
                        placeholder="UF" 
                        value={newCustomer.estado}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddCustomer}>Adicionar Cliente</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <Card className="p-4 animate-slide-in-top animate-delay-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar clientes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </Card>

      {/* Tabela de clientes */}
      <Card className="overflow-hidden border animate-slide-in-bottom animate-delay-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Total Compras</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <UserRound className="h-12 w-12 mb-2 text-gray-300" />
                      <h3 className="font-medium">Nenhum cliente encontrado</h3>
                      <p className="text-sm">Tente usar outros termos de busca ou adicione um novo cliente</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover-lift">
                    <TableCell>
                      <Link 
                        to={`/customers/${customer.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {customer.nome}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.telefone}</div>
                    </TableCell>
                    <TableCell>
                      {customer.cidade}, {customer.estado}
                    </TableCell>
                    <TableCell>{formatDate(customer.dataCadastro)}</TableCell>
                    <TableCell>{formatDate(customer.ultimaCompra)}</TableCell>
                    <TableCell>{customer.totalCompras}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/customers/${customer.id}`}>
                              Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                setEditingCustomer(customer);
                              }}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Editar Cliente</DialogTitle>
                                <DialogDescription>
                                  Atualize os dados do cliente
                                </DialogDescription>
                              </DialogHeader>
                              
                              {editingCustomer && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="flex flex-col space-y-1.5">
                                      <Label htmlFor="edit-nome">Nome completo</Label>
                                      <Input 
                                        id="edit-nome" 
                                        name="nome"
                                        value={editingCustomer.nome}
                                        onChange={handleEditInputChange}
                                      />
                                    </div>
                                    
                                    <div className="flex flex-col space-y-1.5">
                                      <Label htmlFor="edit-email">Email</Label>
                                      <Input 
                                        id="edit-email" 
                                        name="email"
                                        type="email"
                                        value={editingCustomer.email}
                                        onChange={handleEditInputChange}
                                      />
                                    </div>
                                    
                                    <div className="flex flex-col space-y-1.5">
                                      <Label htmlFor="edit-telefone">Telefone</Label>
                                      <Input 
                                        id="edit-telefone" 
                                        name="telefone"
                                        value={editingCustomer.telefone}
                                        onChange={handleEditInputChange}
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="edit-cidade">Cidade</Label>
                                        <Input 
                                          id="edit-cidade" 
                                          name="cidade"
                                          value={editingCustomer.cidade}
                                          onChange={handleEditInputChange}
                                        />
                                      </div>
                                      
                                      <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="edit-estado">Estado</Label>
                                        <Input 
                                          id="edit-estado" 
                                          name="estado"
                                          value={editingCustomer.estado}
                                          onChange={handleEditInputChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button onClick={handleUpdateCustomer}>Salvar Alterações</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-red-500" 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setDeletingCustomerId(customer.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar exclusão</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja excluir o cliente <strong>{customers.find(c => c.id === deletingCustomerId)?.nome}</strong>? 
                                  Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button 
                                    variant="destructive" 
                                    onClick={handleDeleteCustomer}
                                  >
                                    Excluir
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Customers;
