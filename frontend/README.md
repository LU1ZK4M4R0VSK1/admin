# Aero Comidas - Frontend

Sistema moderno de gestão de restaurante com análise de dados em tempo real.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- Framer Motion
- React Query

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do Projeto

```
src/
  ├── components/    # Componentes reutilizáveis
  ├── hooks/         # Custom hooks
  ├── lib/           # Utilitários e configurações
  ├── pages/         # Páginas da aplicação
  └── App.tsx        # Componente principal
```

## Configuração

O servidor de desenvolvimento roda por padrão na porta 8080. Para alterar, edite o `vite.config.ts`.

## API Backend

O frontend se conecta ao backend .NET em `http://localhost:5000`. Configure o proxy no `vite.config.ts` se necessário.
