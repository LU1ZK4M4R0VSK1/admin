import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowRight, UtensilsCrossed, BarChart3, Sparkles, Check } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-display font-bold text-foreground text-xl">Choose</span>
            </div>
            <Link
              to="/admin"
              className="btn-primary hidden sm:flex items-center gap-2"
            >
              Acessar Painel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sistema de Gestão Premium</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Choose
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Sistema de gestão de restaurante com análise de dados em tempo real
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg py-4 px-8"
              >
                <Home className="w-5 h-5" />
                Painel Administrativo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card Administrativo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/admin"
                className="card-premium p-8 block group hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    <Home className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                  Painel Administrativo
                </h2>
                <p className="text-muted-foreground mb-6">
                  Gerencie pedidos, cardápio, mesas e visualize análises detalhadas
                </p>
                <div className="space-y-2">
                  {["Dashboard em tempo real", "Gestão de pedidos", "Controle de cardápio", "Relatórios analíticos"].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Link>
            </motion.div>

            {/* Card Cardápio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-premium p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                Ver Cardápio
              </h2>
              <p className="text-muted-foreground mb-6">
                Para acessar o cardápio, escaneie o QR Code na sua mesa
              </p>
              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Exemplo:</strong> /mesa/1/cardapio
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seu restaurante de forma eficiente
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { label: "Pedidos", value: "∞", description: "Ilimitados" },
              { label: "Mesas", value: "99+", description: "Capacidade" },
              { label: "Relatórios", value: "24/7", description: "Em tempo real" },
              { label: "Suporte", value: "100%", description: "Disponível" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <p className="text-4xl font-display font-bold text-primary mb-1">{stat.value}</p>
                <p className="font-semibold text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="font-display font-semibold text-foreground">Choose</span>
            </div>
            <p className="text-center text-muted-foreground font-medium">
              Clareza para decidir. Inteligência para crescer
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Choose. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
