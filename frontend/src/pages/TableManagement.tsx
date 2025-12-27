import { useState, useEffect } from "react";
import { Users, Plus, QrCode, ToggleLeft, ToggleRight } from "lucide-react";

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  isActive: boolean;
}

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      // Simular dados
      setTables([
        { id: 1, number: 1, capacity: 4, status: "available", isActive: true },
        { id: 2, number: 2, capacity: 2, status: "occupied", isActive: true },
        { id: 3, number: 3, capacity: 6, status: "available", isActive: true },
        { id: 4, number: 4, capacity: 4, status: "reserved", isActive: true },
        { id: 5, number: 5, capacity: 8, status: "available", isActive: false },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-300";
      case "occupied":
        return "bg-red-100 text-red-700 border-red-300";
      case "reserved":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "occupied":
        return "Ocupada";
      case "reserved":
        return "Reservada";
      default:
        return "Desconhecido";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando mesas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mesas</h1>
            <p className="text-slate-600">Gerenciar mesas do restaurante</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Adicionar Mesa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-slate-600 text-sm mb-1">Total de Mesas</p>
          <p className="text-2xl font-bold text-slate-900">{tables.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-green-700 text-sm mb-1">Disponíveis</p>
          <p className="text-2xl font-bold text-green-600">
            {tables.filter(t => t.status === "available" && t.isActive).length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-red-700 text-sm mb-1">Ocupadas</p>
          <p className="text-2xl font-bold text-red-600">
            {tables.filter(t => t.status === "occupied").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-yellow-700 text-sm mb-1">Reservadas</p>
          <p className="text-2xl font-bold text-yellow-600">
            {tables.filter(t => t.status === "reserved").length}
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-md transition-shadow ${
              !table.isActive ? "opacity-50" : ""
            } ${table.status === "occupied" ? "border-red-200" : "border-slate-100"}`}
          >
            {/* Table Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  table.status === "available" ? "bg-green-100" :
                  table.status === "occupied" ? "bg-red-100" : "bg-yellow-100"
                }`}>
                  <span className={`font-bold text-xl ${
                    table.status === "available" ? "text-green-600" :
                    table.status === "occupied" ? "text-red-600" : "text-yellow-600"
                  }`}>
                    {table.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Mesa {table.number}</h3>
                  <p className="text-sm text-slate-600">{table.capacity} pessoas</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                {table.isActive ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-2 rounded-lg text-sm font-medium border-2 mb-4 ${getStatusColor(table.status)}`}>
              {getStatusLabel(table.status)}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button className="px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
