import { useState, useEffect } from "react";
import { UtensilsCrossed, Plus, Pencil, Trash2, DollarSign } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Entradas", "Pratos Principais", "Sobremesas", "Bebidas"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // Simular dados
      setMenuItems([
        {
          id: 1,
          name: "Hambúrguer Clássico",
          description: "Hambúrguer com queijo, alface e tomate",
          price: 25.90,
          category: "Pratos Principais",
          isAvailable: true
        },
        {
          id: 2,
          name: "Batata Frita",
          description: "Porção de batatas crocantes",
          price: 15.00,
          category: "Entradas",
          isAvailable: true
        },
        {
          id: 3,
          name: "Pudim",
          description: "Pudim de leite caseiro",
          price: 12.00,
          category: "Sobremesas",
          isAvailable: false
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar itens do menu:", error);
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin border-t-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cardápio</h1>
            <p className="text-slate-600">Gerenciar itens do menu</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Adicionar Item
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-green-500 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
              item.isAvailable ? "border-slate-100" : "border-red-200 bg-red-50/50"
            } hover:shadow-md transition-shadow`}
          >
            {/* Item Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">{item.name}</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                  {item.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                  <Pencil className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm mb-4">{item.description}</p>

            {/* Price and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                <DollarSign className="w-5 h-5" />
                {item.price.toFixed(2)}
              </div>
              <button
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  item.isAvailable
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {item.isAvailable ? "Disponível" : "Indisponível"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Nenhum item encontrado nesta categoria</p>
        </div>
      )}
    </div>
  );
}
