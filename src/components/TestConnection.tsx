
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { testConnection } from '@/lib/supabase/client';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function TestConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await testConnection();
      setIsConnected(result.success);
      
      if (!result.success && result.error) {
        setError(typeof result.error === 'string' 
          ? result.error 
          : JSON.stringify(result.error, null, 2));
      }
    } catch (e) {
      setIsConnected(false);
      setError(e instanceof Error ? e.message : 'Erro desconhecido ao conectar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Status da Conexão com o Banco de Dados</h2>
      
      {isConnected === true && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Conectado</AlertTitle>
          <AlertDescription className="text-green-700">
            Conexão com o banco de dados estabelecida com sucesso.
          </AlertDescription>
        </Alert>
      )}
      
      {isConnected === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Conexão</AlertTitle>
          <AlertDescription>
            {error || 'Não foi possível conectar ao banco de dados. Verifique as variáveis de ambiente e a configuração do Supabase.'}
          </AlertDescription>
        </Alert>
      )}
      
      {isConnected === null && !error && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Verificando conexão...</AlertTitle>
          <AlertDescription className="text-blue-700">
            Aguarde enquanto testamos a conexão com o banco de dados.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={testDatabaseConnection} 
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Testando...' : 'Testar Conexão Novamente'}
        </Button>
        
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          Recarregar Página
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 mt-4">
        <p>Verifique se as variáveis de ambiente estão configuradas corretamente:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>VITE_SUPABASE_URL</li>
          <li>VITE_SUPABASE_ANON_KEY</li>
        </ul>
      </div>
    </div>
  );
}
