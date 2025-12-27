import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <AlertCircle className="w-24 h-24 text-slate-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
