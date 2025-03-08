
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Database, User } from "lucide-react";
import UserSetup from "@/components/admin/UserSetup";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { initializeDatabase, setupSql } from "@/lib/supabase/setup";
import { testConnection } from "@/lib/supabase/client";

const Setup = () => {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<null | boolean>(null);
  const [dbStatus, setDbStatus] = useState<null | boolean>(null);
  
  const testDbConnection = async () => {
    setLoading(true);
    try {
      const result = await testConnection();
      setConnectionStatus(result.success);
      
      if (result.success) {
        toast.success('Conexão com o banco de dados estabelecida');
      } else {
        toast.error('Falha na conexão com o banco de dados');
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus(false);
      toast.error('Erro ao testar conexão com o banco de dados');
    } finally {
      setLoading(false);
    }
  };
  
  const setupDatabase = async () => {
    setLoading(true);
    try {
      const result = await initializeDatabase();
      setDbStatus(result);
      
      if (result) {
        toast.success('Banco de dados inicializado com sucesso');
      } else {
        toast.error('Falha ao inicializar banco de dados');
      }
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      setDbStatus(false);
      toast.error('Erro ao inicializar banco de dados');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Configuração do Sistema</h1>
      
      <Tabs defaultValue="database">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="database" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Conexão com o Banco de Dados
                </CardTitle>
                <CardDescription>
                  Teste a conexão com o banco de dados Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={testDbConnection} 
                    disabled={loading}
                    className="w-full"
                  >
                    Testar Conexão
                  </Button>
                  
                  {connectionStatus !== null && (
                    <div className={`p-3 rounded-md flex items-center gap-2 ${
                      connectionStatus ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {connectionStatus ? 
                        <><CheckCircle2 className="h-4 w-4" /> Conexão estabelecida com sucesso</> : 
                        <>Falha ao conectar com o banco de dados</>
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Inicialização do Banco de Dados
                </CardTitle>
                <CardDescription>
                  Crie as tabelas e estruturas necessárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={setupDatabase} 
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    Inicializar Banco de Dados
                  </Button>
                  
                  {dbStatus !== null && (
                    <div className={`p-3 rounded-md flex items-center gap-2 ${
                      dbStatus ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {dbStatus ? 
                        <><CheckCircle2 className="h-4 w-4" /> Banco de dados inicializado com sucesso</> : 
                        <>Falha ao inicializar banco de dados</>
                      }
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">SQL para configuração manual:</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48">
                      <pre>{setupSql}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <div className="flex justify-center">
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Configuração de Usuários
                </CardTitle>
                <CardDescription>
                  Crie usuários iniciais para o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserSetup />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Setup;
