
import { useState, useEffect } from 'react';
import { supabase, Customer, generateUniqueId } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Buscar todos os clientes
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar clientes:', err);
      setError(err.message || 'Erro ao buscar clientes');
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || 'Erro ao buscar clientes',
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar um cliente específico
  const fetchCustomerById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          orders (
            id, created_at, status, total
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar cliente:', err);
      setError(err.message || 'Erro ao buscar cliente');
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || 'Erro ao buscar cliente',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Adicionar um novo cliente
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'total_purchases'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCustomer = {
        id: generateUniqueId('C'),
        ...customerData,
        created_at: new Date().toISOString(),
        total_purchases: 0
      };
      
      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar a lista local
      setCustomers(prev => [data, ...prev]);
      
      toast({
        title: "Cliente adicionado",
        description: `${customerData.name} foi adicionado com sucesso.`,
      });
      
      return data;
    } catch (err: any) {
      console.error('Erro ao adicionar cliente:', err);
      setError(err.message || 'Erro ao adicionar cliente');
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || 'Erro ao adicionar cliente',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um cliente existente
  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar a lista local
      setCustomers(prev => 
        prev.map(customer => customer.id === id ? { ...customer, ...data } : customer)
      );
      
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
      
      return data;
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err);
      setError(err.message || 'Erro ao atualizar cliente');
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || 'Erro ao atualizar cliente',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Excluir um cliente
  const deleteCustomer = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar a lista local
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir cliente:', err);
      setError(err.message || 'Erro ao excluir cliente');
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || 'Erro ao excluir cliente',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes automaticamente ao carregar o componente
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
