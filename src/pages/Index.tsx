
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TestConnection from '@/components/TestConnection';

const Index = () => {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">AllStar Sports Hub</h1>
        <p className="text-xl text-gray-600">
          Sistema de administração para gerenciamento de produtos esportivos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Teste de Conexão</h2>
          <TestConnection />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Navegação Rápida</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/dashboard">
              <Button className="w-full">Dashboard</Button>
            </Link>
            <Link to="/customers">
              <Button className="w-full">Clientes</Button>
            </Link>
            <Link to="/products">
              <Button className="w-full">Produtos</Button>
            </Link>
            <Link to="/orders">
              <Button className="w-full">Pedidos</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Instruções de Configuração</h2>
        <div className="space-y-4">
          <p>Para configurar corretamente a conexão com o Supabase, siga os passos abaixo:</p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Crie um arquivo <code>.env.local</code> na raiz do projeto</li>
            <li>Adicione as seguintes variáveis de ambiente:
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                VITE_SUPABASE_URL=sua_url_do_supabase<br/>
                VITE_SUPABASE_ANON_KEY=sua_chave_anônima_do_supabase
              </pre>
            </li>
            <li>Reinicie o servidor de desenvolvimento</li>
          </ol>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="font-medium text-yellow-800">Nota Importante</p>
            <p className="text-yellow-700">
              As variáveis de ambiente são necessárias para que o aplicativo se conecte ao seu banco de dados Supabase.
              Sem essas configurações, o sistema não funcionará corretamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
