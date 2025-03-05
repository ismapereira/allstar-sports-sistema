
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, BarChart, LineChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, AreaChart as RechartsAreaChart, Area } from 'recharts';

// Dados simulados para os gráficos
const monthlyRevenue = [
  { month: 'Jan', receita: 21500, custos: 15700, lucro: 5800 },
  { month: 'Fev', receita: 24000, custos: 16500, lucro: 7500 },
  { month: 'Mar', receita: 26500, custos: 17800, lucro: 8700 },
  { month: 'Abr', receita: 23800, custos: 16300, lucro: 7500 },
  { month: 'Mai', receita: 28900, custos: 18700, lucro: 10200 },
  { month: 'Jun', receita: 32500, custos: 21200, lucro: 11300 },
  { month: 'Jul', receita: 34200, custos: 22100, lucro: 12100 },
  { month: 'Ago', receita: 36800, custos: 23500, lucro: 13300 },
  { month: 'Set', receita: 35400, custos: 22800, lucro: 12600 },
  { month: 'Out', receita: 38500, custos: 24200, lucro: 14300 },
  { month: 'Nov', receita: 42000, custos: 26400, lucro: 15600 },
  { month: 'Dez', receita: 48500, custos: 30100, lucro: 18400 },
];

const revenueByCategory = [
  { name: 'Calçados', valor: 145200 },
  { name: 'Vestuário', valor: 98700 },
  { name: 'Acessórios', valor: 62500 },
  { name: 'Equipamentos', valor: 85300 },
];

const COLORS = ['#00AFEF', '#0097D6', '#001E5A', '#1A3A7C'];

const topSellingProducts = [
  { id: 1, name: 'Tênis AllStar Pro Elite', vendas: 827, receita: 206670.50 },
  { id: 2, name: 'Camisa Sport Dry-Fit', vendas: 612, receita: 91800.00 },
  { id: 3, name: 'Bola Oficial de Basquete', vendas: 548, receita: 54800.00 },
  { id: 4, name: 'Mochila Esportiva Premium', vendas: 489, receita: 73350.00 },
  { id: 5, name: 'Shorts Running Pro', vendas: 456, receita: 45600.00 },
];

const invoiceHistory = [
  { id: 'INV-2023-001', data: '2023-12-20', cliente: 'Academia Fitness Pro', status: 'Pago', valor: 12580.00 },
  { id: 'INV-2023-002', data: '2023-12-15', cliente: 'Esporte & Cia', status: 'Pago', valor: 8750.00 },
  { id: 'INV-2023-003', data: '2023-12-10', cliente: 'Club Atlético Nacional', status: 'Pendente', valor: 15300.00 },
  { id: 'INV-2023-004', data: '2023-12-05', cliente: 'Sport Center', status: 'Pago', valor: 7400.00 },
  { id: 'INV-2023-005', data: '2023-11-30', cliente: 'Márcio Equipamentos', status: 'Atrasado', valor: 6200.00 },
];

const Finance = () => {
  const [timeframe, setTimeframe] = useState('yearly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 xl:flex-row xl:justify-between xl:space-y-0">
        <h1 className="text-3xl font-bold">Financeiro</h1>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button>Exportar Relatórios</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-primary">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 372.700,00</div>
            <p className="text-xs text-green-500">+14% em relação ao ano anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-primary">
              <path d="M12 22V2M5 12H2M22 12h-3M3 5l3 3M3 19l3-3M21 5l-3 3M21 19l-3-3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 255.800,00</div>
            <p className="text-xs text-amber-500">+9% em relação ao ano anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-primary">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 116.900,00</div>
            <p className="text-xs text-green-500">+18% em relação ao ano anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-primary">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31.4%</div>
            <p className="text-xs text-green-500">+3.2% em relação ao ano anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Receita vs. Custos</CardTitle>
              <CardDescription>
                Visão comparativa da receita, custos e lucro ao longo do ano
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                <span className="text-xs">Receita</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-secondary mr-1"></div>
                <span className="text-xs">Custos</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">Lucro</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={monthlyRevenue}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="receita" fill="#00AFEF" name="Receita" />
                <Bar dataKey="custos" fill="#001E5A" name="Custos" />
                <Bar dataKey="lucro" fill="#4ade80" name="Lucro" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receita por Categoria</CardTitle>
            <CardDescription>
              Distribuição da receita entre as categorias de produtos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Produtos</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <LineChart className="h-4 w-4" />
            <span>Tendências</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center space-x-2">
            <AreaChart className="h-4 w-4" />
            <span>Faturas</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>
                Produtos com maior volume de vendas e receita gerada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Produto</th>
                      <th className="text-center py-3 px-4 font-medium">Vendas</th>
                      <th className="text-right py-3 px-4 font-medium">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="text-center py-3 px-4">{product.vendas.toLocaleString('pt-BR')}</td>
                        <td className="text-right py-3 px-4">R$ {product.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Ver todos os produtos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Vendas</CardTitle>
              <CardDescription>
                Evolução das vendas ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart
                  data={monthlyRevenue}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#00AFEF" 
                    activeDot={{ r: 8 }} 
                    name="Receita"
                  />
                  <Line type="monotone" dataKey="lucro" stroke="#4ade80" name="Lucro" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Faturas</CardTitle>
              <CardDescription>
                Últimas faturas emitidas e seus status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Fatura</th>
                      <th className="text-left py-3 px-4 font-medium">Data</th>
                      <th className="text-left py-3 px-4 font-medium">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceHistory.map((invoice) => (
                      <tr key={invoice.id} className="border-b">
                        <td className="py-3 px-4">{invoice.id}</td>
                        <td className="py-3 px-4">{invoice.data}</td>
                        <td className="py-3 px-4">{invoice.cliente}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            invoice.status === 'Pago' 
                              ? 'bg-green-100 text-green-800' 
                              : invoice.status === 'Pendente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">R$ {invoice.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline">Ver todas as faturas</Button>
                <Button>Nova Fatura</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
