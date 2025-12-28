import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, ArrowLeft, Utensils } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function MenuPage() {
  const { tableId } = useParams();
  const [cart, setCart] = useState<CartItem[]>([]);

  const menuItems = [
    { id: 1, name: "Hambúrguer Clássico", price: 25.90, category: "Pratos Principais" },
    { id: 2, name: "Batata Frita", price: 15.00, category: "Entradas" },
    { id: 3, name: "Pudim", price: 12.00, category: "Sobremesas" },
    { id: 4, name: "Refrigerante", price: 8.00, category: "Bebidas" },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/"
                className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">Choose</h1>
                <p className="text-sm text-muted-foreground">Mesa {tableId}</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32 lg:pb-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Cardápio</h2>
              <p className="text-muted-foreground">Escolha os itens do seu pedido</p>
            </motion.div>

            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground truncate">{item.name}</h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-lg">{item.category}</span>
                      <p className="text-lg font-bold text-primary mt-1">R$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium p-6 sticky top-24"
            >
              <h2 className="text-xl font-display font-bold text-foreground mb-6">Seu Pedido</h2>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Carrinho vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-sm text-primary font-semibold">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4 text-foreground" />
                          </button>
                          <span className="font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4 text-foreground" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex items-center justify-between text-xl font-display font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="btn-primary w-full py-4 text-lg">
                    Fazer Pedido
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile Cart Footer */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{itemCount} itens</p>
              <p className="text-xl font-display font-bold text-foreground">R$ {total.toFixed(2)}</p>
            </div>
            <button className="btn-primary py-3 px-8">
              Fazer Pedido
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
