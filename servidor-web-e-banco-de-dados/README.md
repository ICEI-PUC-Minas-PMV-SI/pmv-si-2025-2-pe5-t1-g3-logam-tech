# PostgreSQL CRUD API

Uma API REST simples construída com Node.js e Express que fornece operações CRUD (Create, Read, Update, Delete) para usuários e produtos usando PostgreSQL como banco de dados.

## 📋 Funcionalidades

- **API REST** com operações CRUD completas
- **Banco de dados PostgreSQL**
- **Docker** para containerização e desenvolvimento
- **Nginx** para proxy reverso e servir arquivos estáticos
- **Health check** endpoint
- **Interface web** simples para testar a API

## 🏗️ Arquitetura

```bash
├── src/
│   ├── config/
│   │   └── database.js      # Configuração do banco de dados
│   ├── controllers/
│   │   ├── userController.js    # Lógica de negócio para usuários
│   │   └── productController.js # Lógica de negócio para produtos
│   ├── models/
│   │   ├── User.js          # Modelo de usuário
│   │   └── Product.js       # Modelo de produto
│   ├── routes/
│   │   ├── userRoutes.js    # Rotas da API para usuários
│   │   └── productRoutes.js # Rotas da API para produtos
│   └── server.js           # Servidor principal
├── docker-compose.yml      # Configuração Docker para desenvolvimento
├── docker-compose.prod.yml # Configuração Docker para produção
├── Dockerfile             # Imagem Docker da aplicação
├── nginx.config           # Configuração do Nginx
├── index.html             # Interface web para testar a API
└── Makefile              # Comandos úteis para gerenciamento
```

## 🚀 Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (opcional, se não usar Docker)

1. **Clone o repositório e navegue até a pasta:**

   ```bash
   cd servidor-web-e-banco-de-dados
   ```

2. **Configure as variáveis de ambiente:**

   ```bash
   cp env.example .env
   ```

   Edite o arquivo `.env` se necessário.

3. **Execute com Docker Compose:**

   ```bash
   # Para desenvolvimento
   docker-compose up -d
   
   # Para produção
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Acesse a aplicação:**
   - API: <http://localhost:3000>
   - Interface web: <http://localhost:3000> (arquivo index.html)
   - Health check: <http://localhost:3000/health>

## 📡 Endpoints da API

### Health Check

- `GET /health` - Verifica se a API está funcionando

### Usuários

- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca usuário por ID
- `POST /api/users` - Cria novo usuário
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

### Produtos

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Busca produto por ID
- `POST /api/products` - Cria novo produto
- `PUT /api/products/:id` - Atualiza produto
- `DELETE /api/products/:id` - Remove produto

## 📝 Exemplos de Uso

### Criar um usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "age": 30
  }'
```

### Criar um produto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook",
    "description": "Notebook Dell Inspiron",
    "price": 2500.00,
    "stock": 10
  }'
```

### Listar todos os usuários

```bash
curl http://localhost:3000/api/users
```

## 🛠️ Comandos Úteis (Makefile)

O projeto inclui um Makefile com comandos úteis:

```bash
# Ver todos os comandos disponíveis
make help

# Gerenciar logs
make logs              # Ver logs da API
make logs-follow       # Seguir logs em tempo real
make logs-tail         # Últimas 50 linhas dos logs

# Gerenciar containers
make status            # Status dos containers
make restart           # Reiniciar containers
make stop              # Parar containers
make start             # Iniciar containers (produção)
make build             # Build e iniciar containers

# Gerenciar Nginx
make nginx-setup       # Configuração completa do Nginx
make nginx-test        # Testar configuração do Nginx
make nginx-reload      # Recarregar configuração do Nginx
```

## 🔧 Configuração do Nginx

Para configurar o Nginx como proxy reverso:

```bash
# Configuração completa
make nginx-setup

# Ou apenas atualizar configuração
make nginx-update
```

## 📊 Monitoramento

- **Health Check**: `GET /health`
- **Logs**: Use `make logs-follow` para acompanhar logs em tempo real
- **Status dos containers**: `make status`

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `age` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela `products`

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `stock` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
