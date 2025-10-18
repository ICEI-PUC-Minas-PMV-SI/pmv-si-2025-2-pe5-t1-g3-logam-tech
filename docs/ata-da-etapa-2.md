# Ata de Configuração - Etapa 2

## Resumo do Projeto

Este documento registra o processo completo de configuração dos serviços de infraestrutura em instâncias EC2 da AWS ou On Premise, incluindo configurações de segurança, firewall e testes de conectividade para cada serviço implementado.

## Objetivo

Implementar uma infraestrutura completa com múltiplos serviços essenciais para um ambiente corporativo, garantindo segurança e funcionalidade adequadas.

## Membros do Grupo e Responsabilidades

| Membro | Serviço | IP Público | IP Privado | Usuário de acesso | Função |
|--------|---------|------------|------------|----------|-----------|
| Gabriel dos Reis Nascimento | Servidor Web + Banco de Dados | `54.145.137.231` | `172.31.16.36` | N/A | Configuração de servidor web com banco de dados para realizar um CRUD simples. |
| [Nome do Membro] | Servidor FTP | - | - | - | - |
| [Nome do Membro] | AD com DNS e GPO | - | - | - | - |
| [Nome do Membro] | VPN | - | - | - | - |
| Alice | Servidor DHCP | VPN | `54.89.217.224` | `172.31.17.170` | N/A | Estabelecimento de conexões seguras entre colaboradores e rede corporativa. |

## Detalhamento das Implementações

### 📁 Active Directory (AD), DNS e GPO - Martha Beatriz

Coloque aqui as configs

----

### 📁 Servidor FTP - Leandro

Coloque aqui as configs

----

### 📁 Servidor VPN (OpenVPN) - Alice Abreu dos Reis

#### Configuração do Servidor

##### 1. Configurar Security Groups

##### 1.1. Security Group da VPN

- Nome: `VPN`
- Descrição: `Security Group para servidor web`
- Regras de entrada:
- UDP 1194 – Acesso de clientes OpenVPN: 0.0.0.0/0
- SSH 22 – Acesso administrativo: 0.0.0.0/0
- ICMP (Echo Request) – Permitir testes de conectividade (ping) entre cliente e servidor: 0.0.0.0/0
- Regras de saída:
  - Todos: `0.0.0.0/0:0`

##### 2. Criação da Instância EC2

- Nome: `vpn-server`
- Sistema operacional: Ubuntu 24.04 LTS
- Tipo de instância: t3.micro
- Storage: 8 GB
- Security Group: VPN
- IP privado: `172.31.17.170`

##### 3. Instalação e Configuração do OpenVPN

##### 3.1. Conectar ao servidor

```bash
ssh -i vpn-chave.pem ubuntu@54.210.126.47
```
##### 3.2. Atualizar o sistema

```bash
sudo apt update && sudo apt upgrade -y
```

##### 3.3. Instalar o OpenVPN

```bash
sudo apt install openvpn -y
```
##### 4. Gerar e Enviar Arquivo de Configuração do Cliente (.ovpn)

```bash
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

##### 4.1. Baixar o arquivo .ovpn para o computador

```bash
scp -i vpn-chave.pem ubuntu@54.210.126.47:/home/ubuntu/vpn_client_1.ovpn .
```
##### 5. Conexão e Testes

##### 5.1. Conectar ao servidor VPN no cliente (Ubuntu)

```bash
sudo apt install openvpn -y
sudo openvpn --config ~/Downloads/vpn_client_1.ovpn
```

##### 5.2. Testar conectividade com a rede privada

```bash
ping 172.31.17.170
```
----

### 📁 Servidor DHCP - Omar Abreu

Coloque aqui as configs

----

### 📁 Servidor Web + Banco de Dados - Gabriel dos Reis Nascimento

#### Configuração do Servidor

##### 1. Configurar Security Groups

##### 1.1. Security Group para servidor web

- Nome: `Web`
- Descrição: `Security Group para servidor web`
- Regras de entrada:
  - SSH: `0.0.0.0/0:22`
  - HTTP: `0.0.0.0/0:80`
  - HTTPS: `0.0.0.0/0:443`
- Regras de saída:
  - Todos: `0.0.0.0/0:0`

##### 1.2. Security Group para banco de dados

- Nome: `Database`
- Descrição: `Security Group para banco de dados`
- Regras de entrada:
  - PostgreSQL do security group `Web`: `0.0.0.0/0:5432`
- Regras de saída:
  - Todos: `0.0.0.0/0`

##### 2. Criar o RDS PostgreSQL

- Nome: `database-0`
- Engine: PostgreSQL
- Versão: `17.4-R1`
- Template: Sandbox
- Instance class: `db.t4g.micro`
- Storage type: `gp2`
- Storage: `20GB`
- Security Group: `Database`
- Initial database: `test_database`

##### 3. Criar o EC2 para o servidor web

- Nome: `web-server`
- Sistema operacional: Ubuntu 24.04 LTS
- Tipo de instância: `t3.micro`
- Security Group: `Web`
- Storage: `8GB`

##### 3.1. Configurar Elastic IP para o EC2

**Objetivo:** Garantir que o servidor web tenha um endereço IP público estático, evitando mudanças de IP quando a instância for reiniciada.

1. Alocar Elastic IP:
   - Acessar o console AWS EC2
   - Navegar para "Elastic IPs" no menu lateral
   - Clicar em "Allocate Elastic IP address"

2. Associar Elastic IP à instância EC2 `servidor-web`:
   - Selecionar o Elastic IP recém-criado
   - Selecionar a instância `servidor-web`

3. Verificar associação:
   - Confirmar que o Elastic IP está associado à instância
   - Anotar o endereço IP público estático para uso posterior

##### 4. Configurar o servidor web

##### 4.1. Acessar a instância EC2 `servidor-web`

```bash
ssh -i "[chave-ssh]" ubuntu@54.145.137.231
```

##### 4.2. Clonar esse repositório e executar o script de instalação do Docker

```bash
mkdir app
cd app
git clone [url-do-repositorio] .
cd servidor-web-e-banco-de-dados
sudo ./install-docker-ubuntu.sh
```

Sair da sessão SSH e entrar novamente para aplicar as alterações.

##### 4.3. Configurar o ambiente

```bash
cp env.production.example .env
```

###### 4.3.1. Editar o arquivo .env com as credenciais do RDS

```bash
vim .env
# Editar o arquivo .env com as credenciais do RDS
```

##### 4.4. Deploy

```bash
docker-compose -f docker-compose.prod.yml --env-file .env up -d --build
```

##### 4.5. Atualizar security group do servidor web

Adicionar regra de entrada para porta 3000 do security group do servidor web para que seja possível acessar as rotas da API pela internet usando o Elastic IP.

##### 5. Testar a API

###### 5.1. Teste de saúde

```bash
curl --location '54.145.137.231:3000/health' \
--header 'Content-Type: application/json' \
--data ''
```

###### 5.2. Teste de usuários

```bash
curl --location '54.145.137.231:3000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

```bash
curl --location '54.145.137.231:3000/api/users' \
--header 'Content-Type: application/json'
```

###### 5.3. Teste de produtos

```bash
curl --location '54.145.137.231:3000/api/products' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "Product 1", "description": "Description 1", "price": 100, "stock": 10}'
```

```bash
curl --location '54.145.137.231:3000/api/products' \
--header 'Content-Type: application/json'
```

#### 6. Configurar o Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo apt install make -y
make nginx-setup
```

**Detalhes do que o comando `make nginx-setup` configura:**

O comando `make nginx-setup` executa o script `update-nginx-config.sh` que realiza as seguintes configurações:

1. **Verificação de segurança:**
   - Verifica se o script está sendo executado com privilégios de root/sudo
   - Valida a existência dos arquivos necessários (`nginx.config` e `index.html`)

2. **Backup da configuração atual:**
   - Cria diretório de backup: `/etc/nginx/backups`
   - Faz backup da configuração atual com timestamp: `default_backup_YYYYMMDD_HHMMSS.conf`

3. **Aplicação da nova configuração:**
   - Substitui `/etc/nginx/sites-available/default` com o conteúdo de `nginx.config`
   - Testa a configuração com `nginx -t`

4. **Configuração do Nginx (nginx.config):**
   - **Servidor HTTP na porta 80**
   - **Diretório raiz:** `/var/www/app`
   - **Servir arquivos estáticos:** Configuração para servir arquivos HTML/CSS/JS
   - **Proxy para API:** Redireciona requisições `/api/` para `http://127.0.0.1:3000/api/`
   - **Health check:** Redireciona `/health` para `http://127.0.0.1:3000/health`
   - **Headers de proxy:** Configura headers necessários para proxy reverso

5. **Criação do diretório web:**
   - Cria diretório `/var/www/app`
   - Define proprietário: `www-data:www-data`
   - Define permissões: `755` para diretório, `644` para arquivos

6. **Cópia dos arquivos estáticos:**
   - Copia `index.html` para `/var/www/app/`
   - Define permissões corretas para o arquivo

7. **Recarga do Nginx:**
   - Executa `systemctl reload nginx` para aplicar as mudanças
   - Verifica se a recarga foi bem-sucedida

**Estrutura final da configuração:**

- **Frontend:** Servido diretamente pelo Nginx na porta 80
- **API:** Proxy reverso para aplicação Node.js na porta 3000
- **Arquivos estáticos:** Servidos do diretório `/var/www/app`

#### 7. Testar no navegador

1. Acessar o servidor web via browser no endereço `http://54.145.137.231`
2. Validar que a interface de CRUD está sendo exibida corretamente.
3. Testar adicionar usuários e produtos.

---

**Grupo**: Eixo 5 - LOGAM Tech
