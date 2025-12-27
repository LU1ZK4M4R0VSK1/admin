import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Aero Comidas
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sistema de gestão de restaurante com análise de dados em tempo real
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Administrativo */}
          <Link
            to="/admin"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <Home className="w-7 h-7 text-green-600 group-hover:text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-green-500 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Painel Administrativo
            </h2>
            <p className="text-slate-600">
              Gerencie pedidos, cardápio, mesas e visualize análises detalhadas
            </p>
          </Link>

          {/* Card Cardápio */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ver Cardápio
            </h2>
            <p className="text-slate-600 mb-4">
              Para acessar o cardápio, escaneie o QR Code na sua mesa
            </p>
            <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
              <strong>Exemplo:</strong> /mesa/1/cardapio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
