
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Página não encontrada | AllStar Sports";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-dark p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-6">
          <div className="text-primary text-9xl font-bold">404</div>
          <h1 className="text-3xl font-bold text-secondary mt-4">Página não encontrada</h1>
          <p className="text-gray-600 mt-2">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Voltar
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            Ir para o Dashboard
          </Button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
