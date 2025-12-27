import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Plus, Pencil, Trash2, Search, Check, X } from "lucide-react";
import { menuItemsApi } from "@/lib/services";
import { MenuItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const categories = ["Todos", "Entradas", "Pratos Principais", "Pizzas", "Massas", "Saladas", "Sobremesas", "Bebidas", "Vinhos"];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await menuItemsApi.getAll();
      setMenuItems(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar itens do menu:", error);
      toast({
        title: "Erro ao carregar cardápio",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const toggleAvailability = async (id: number) => {
    try {
      await menuItemsApi.toggleAvailability(id);
      toast({
        title: "Disponibilidade atualizada",
        description: "Status do item foi alterado"
      });
      await fetchMenuItems();
    } catch (error) {
      console.error("Erro ao alterar disponibilidade:", error);
      toast({
        title: "Erro ao atualizar item",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Deseja realmente excluir este item?")) return;
    
    try {
      await menuItemsApi.delete(id);
      toast({
        title: "Item excluído",
        description: "O item foi removido do cardápio"
      });
      await fetchMenuItems();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      toast({
        title: "Erro ao excluir item",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <UtensilsCrossed className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Cardápio</h1>
            <p className="text-muted-foreground">Gerenciar itens do menu</p>
          </div>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 w-full lg:w-auto">
          <Plus className="w-5 h-5" />
          Adicionar Item
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-12"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card-premium p-6 ${!item.isAvailable ? 'opacity-60' : ''}`}
          >
            {/* Item Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-foreground text-lg truncate">{item.name}</h3>
                  {!item.isAvailable && (
                    <span className="flex-shrink-0 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                      Indisponível
                    </span>
                  )}
                </div>
                <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                  {item.category}
                </span>
              </div>
              <div className="flex gap-1 ml-2">
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  onClick={() => {/* TODO: Implementar edição */}}
                  title="Editar item"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                  onClick={() => deleteItem(item.id)}
                  title="Excluir item"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-5 line-clamp-2">{item.description || "Sem descrição"}</p>

            {/* Ingredients */}
            {item.ingredients && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Ingredientes:</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.ingredients}</p>
              </div>
            )}

            {/* Price and Status */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-display font-bold text-primary">
                  R$ {item.price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  item.isAvailable
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {item.isAvailable ? (
                  <>
                    <Check className="w-4 h-4" />
                    Disponível
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Indisponível
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-premium p-12 text-center"
        >
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
          <p className="text-muted-foreground">Nenhum item encontrado nesta categoria</p>
        </motion.div>
      )}
    </div>
  );
}
