
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createAdminUser, createTestUsers } from '@/lib/supabase/setup';

const UserSetup = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const result = await createAdminUser();
      if (result) {
        toast.success('Usuário admin criado com sucesso');
        setResults([{ type: 'admin', data: result, success: true }]);
      } else {
        toast.error('Erro ao criar usuário admin');
        setResults([{ type: 'admin', success: false }]);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar usuário admin');
      setResults([{ type: 'admin', error, success: false }]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTestUsers = async () => {
    setLoading(true);
    try {
      const results = await createTestUsers();
      const success = results.some(r => r.success);
      
      if (success) {
        toast.success('Usuários de teste criados');
      } else {
        toast.error('Erro ao criar usuários de teste');
      }
      
      setResults(results.map(r => ({ ...r, type: 'test' })));
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar usuários de teste');
      setResults([{ type: 'test', error, success: false }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configuração Inicial de Usuários</CardTitle>
        <CardDescription>
          Crie usuários para testes e administração do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Crie um usuário administrador padrão:
          </p>
          <ul className="text-xs text-gray-500 list-disc list-inside">
            <li>Email: admin@allstar.com</li>
            <li>Senha: Admin@123</li>
          </ul>
          <Button 
            onClick={handleCreateAdmin}
            disabled={loading}
            className="w-full"
          >
            Criar Usuário Admin
          </Button>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Crie usuários de teste (gerente e vendedor):
          </p>
          <ul className="text-xs text-gray-500 list-disc list-inside">
            <li>gerente@allstar.com / Gerente@123</li>
            <li>vendedor@allstar.com / Vendedor@123</li>
          </ul>
          <Button 
            onClick={handleCreateTestUsers}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            Criar Usuários de Teste
          </Button>
        </div>
      </CardContent>
      
      {results.length > 0 && (
        <CardFooter className="flex flex-col">
          <div className="w-full">
            <h4 className="text-sm font-medium mb-2">Resultados:</h4>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-1 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
                >
                  {result.type === 'admin' ? 'Admin' : result.email}: 
                  {result.success ? ' Criado com sucesso' : ' Falha ao criar'}
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default UserSetup;
