# LOGAM Tech - Sistema de Gestão

API REST construída com Node.js e Express para gestão de agentes de telemarketing e cursos de tecnologia da **LOGAM Tech**, uma empresa de Telemarketing e Contact Center especializada em tecnologia.

## 📋 Sobre a LOGAM Tech

A LOGAM Tech é uma empresa de Telemarketing e Contact Center que:

- Atua com divulgação e vendas de cursos de tecnologia (B2B, B2C e B2G)
- Oferece serviços de cobrança, suporte técnico e orientação educacional
- Trabalha em parceria com escolas como Alura e Rocketseat
- Foi fundada em 2021, com sede no Rio de Janeiro e filiais em Brasília, Curitiba, Salvador e Belém
- Atende todo o Brasil, incluindo trabalho remoto/híbrido via VPN

## 🎯 Funcionalidades

- **API REST** com operações CRUD completas para Agentes e Cursos
- **Banco de dados PostgreSQL** para armazenamento persistente
- **Docker** para containerização e desenvolvimento
- **Nginx** para proxy reverso e servir arquivos estáticos
- **Health check** endpoint para monitoramento
- **Interface web** moderna e intuitiva para gestão

## 🏗️ Arquitetura

```bash
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do banco de dados
│   ├── controllers/
│   │   ├── agentController.js   # Lógica de negócio para agentes
│   │   └── courseController.js  # Lógica de negócio para cursos
│   ├── models/
│   │   ├── Agent.js             # Modelo de agente de telemarketing
│   │   └── Course.js            # Modelo de curso de tecnologia
│   ├── routes/
│   │   ├── agentRoutes.js       # Rotas da API para agentes
│   │   └── courseRoutes.js      # Rotas da API para cursos
│   └── server.js                # Servidor principal
├── docker-compose.yml            # Configuração Docker para desenvolvimento
├── docker-compose.prod.yml      # Configuração Docker para produção
├── Dockerfile                    # Imagem Docker da aplicação
├── nginx.config                  # Configuração do Nginx
├── index.html                    # Interface web para gestão
└── Makefile                      # Comandos úteis para gerenciamento
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

   Edite o arquivo `.env` com as configurações do banco de dados.

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

### Agentes

- `GET /api/agents` - Lista todos os agentes
- `GET /api/agents/:id` - Busca agente por ID
- `POST /api/agents` - Cria novo agente
- `PUT /api/agents/:id` - Atualiza agente
- `DELETE /api/agents/:id` - Remove agente

### Cursos

- `GET /api/courses` - Lista todos os cursos
- `GET /api/courses/:id` - Busca curso por ID
- `POST /api/courses` - Cria novo curso
- `PUT /api/courses/:id` - Atualiza curso
- `DELETE /api/courses/:id` - Remove curso

## 📝 Exemplos de Uso

### Criar um Agente

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria.santos@logamtech.com.br",
    "phone": "(21) 98765-4321",
    "department": "vendas",
    "location": "RJ",
    "status": "ativo"
  }'
```

**Departamentos disponíveis:** `vendas`, `suporte`, `cobranca`, `orientacao`

**Localizações disponíveis:** `RJ`, `Brasília`, `Curitiba`, `Salvador`, `Belém`, `Remoto`

**Status disponíveis:** `ativo`, `inativo`

### Criar um Curso

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Formação Full Stack JavaScript",
    "description": "Curso completo de desenvolvimento web com JavaScript, Node.js e React",
    "partner": "Alura",
    "price": 1999.99,
    "category": "B2C"
  }'
```

**Parceiros disponíveis:** `Alura`, `Rocketseat`, `Outro`

**Categorias disponíveis:** `B2B`, `B2C`, `B2G`

### Listar todos os agentes

```bash
curl http://localhost:3000/api/agents
```

### Listar todos os cursos

```bash
curl http://localhost:3000/api/courses
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

### Tabela `agents`

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100) NOT NULL)
- `email` (VARCHAR(100) UNIQUE NOT NULL)
- `phone` (VARCHAR(20))
- `department` (VARCHAR(50) CHECK: 'vendas', 'suporte', 'cobranca', 'orientacao')
- `location` (VARCHAR(50) CHECK: 'RJ', 'Brasília', 'Curitiba', 'Salvador', 'Belém', 'Remoto')
- `status` (VARCHAR(20) DEFAULT 'ativo' CHECK: 'ativo', 'inativo')
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Tabela `courses`

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(200) NOT NULL)
- `description` (TEXT)
- `partner` (VARCHAR(100)) - Ex: Alura, Rocketseat
- `price` (DECIMAL(10,2) NOT NULL)
- `category` (VARCHAR(10) CHECK: 'B2B', 'B2C', 'B2G')
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## 🎨 Interface Web

A interface web (`index.html`) oferece uma experiência completa para:

- **Gestão de Agentes**: Cadastro, edição e exclusão de agentes de telemarketing
- **Gestão de Cursos**: Cadastro, edição e exclusão de cursos de tecnologia
- **Visualização em tempo real**: Tabelas atualizadas automaticamente
- **Validação de dados**: Formulários com validação client-side e server-side

## 🔒 Validações

### Validações de Agentes

- Email deve ser único e válido
- Departamento deve ser um dos valores permitidos
- Localização deve ser uma das opções disponíveis
- Status deve ser 'ativo' ou 'inativo'

### Validações de Cursos

- Nome e preço são obrigatórios
- Preço deve ser um número positivo
- Categoria deve ser B2B, B2C ou B2G
