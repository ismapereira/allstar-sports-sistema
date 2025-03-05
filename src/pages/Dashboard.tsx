
import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  DollarSign
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';

// Dados de demonstração para os gráficos
const revenueData = [
  { name: 'Jan', value: 1500 },
  { name: 'Fev', value: 2300 },
  { name: 'Mar', value: 1800 },
  { name: 'Abr', value: 2800 },
  { name: 'Mai', value: 2000 },
  { name: 'Jun', value: 3500 },
];

const categoryData = [
  { name: 'Futebol', value: 400 },
  { name: 'Basquete', value: 300 },
  { name: 'Natação', value: 200 },
  { name: 'Tênis', value: 350 },
  { name: 'Corrida', value: 320 },
];

// Dados de pedidos recentes
const recentOrders = [
  { id: 'ORD-0012', customer: 'Carlos Oliveira', date: '22/05/2023', status: 'Entregue', total: 289.99 },
  { id: 'ORD-0011', customer: 'Maria Silva', date: '21/05/2023', status: 'Em processamento', total: 129.50 },
  { id: 'ORD-0010', customer: 'João Santos', date: '20/05/2023', status: 'Enviado', total: 453.75 },
  { id: 'ORD-0009', customer: 'Ana Costa', date: '19/05/2023', status: 'Entregue', total: 87.20 },
  { id: 'ORD-0008', customer: 'Paulo Lima', date: '18/05/2023', status: 'Cancelado', total: 312.00 },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setStats({
        totalSales: 342,
        totalCustomers: 127,
        totalProducts: 85,
        totalRevenue: 28750.50,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue':
        return 'bg-green-100 text-green-800';
      case 'Em processamento':
        return 'bg-blue-100 text-blue-800';
      case 'Enviado':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div>
        <h1 className="text-3xl font-bold text-secondary animate-slide-in-left">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 animate-slide-in-left animate-delay-100">
          Visão geral e métricas da sua loja AllStar Sports
        </p>
      </div>

      {/* Cards principais de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift animate-slide-in-bottom animate-delay-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Vendas Totais
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>12% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-slide-in-bottom animate-delay-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Clientes
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>5% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-slide-in-bottom animate-delay-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Produtos
            </CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="text-xs text-blue-500 flex items-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>3 novos esta semana</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift animate-slide-in-bottom animate-delay-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              Receita Total
            </CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-red-500 flex items-center mt-1">
              <ArrowDown className="w-3 h-3 mr-1" />
              <span>3% comparado à última semana</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in-left animate-delay-300">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Análise dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value) => [`R$ ${value}`, 'Receita']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00AFEF" 
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-in-right animate-delay-300">
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
            <CardDescription>Distribuição do volume de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    formatter={(value) => [`${value} unidades`, 'Vendas']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#001E5A" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <Card className="animate-slide-in-bottom animate-delay-500">
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>
            Os últimos 5 pedidos processados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="hover-lift">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
