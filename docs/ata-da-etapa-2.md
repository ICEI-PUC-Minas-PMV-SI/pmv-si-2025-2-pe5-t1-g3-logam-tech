# Ata de Configuração - Etapa 2

## Resumo do Projeto

Este documento registra o processo completo de configuração dos serviços de infraestrutura em instâncias EC2 da AWS ou On Premise, incluindo configurações de segurança, firewall e testes de conectividade para cada serviço implementado.

## Objetivo

Implementar uma infraestrutura completa com múltiplos serviços essenciais para um ambiente corporativo, garantindo segurança e funcionalidade adequadas.

## Membros do Grupo e Responsabilidades

| Membro | Serviço | IP Público | IP Privado | Usuário de acesso | Função |
|--------|---------|------------|------------|----------|-----------|
| Gabriel dos Reis Nascimento | Servidor Web + Banco de Dados | `54.145.137.231` | `172.31.16.36` | N/A | Configuração de servidor web com banco de dados para realizar um CRUD simples. |
| Leandro Augusto Santos Araujo | Servidor FTP | 18.206.176.203 | 172.31.17.229 | N/A | A configuração FTP para transferir arquivos entre um computador e um servidor em uma rede. |
| Martha Beatriz Siqueira da Silva | AD com DNS e GPO | `52.23.39.125` |  `10.0.1.162 ` | N/A | O AD centraliza a autenticação e o gerenciamento de usuários, grupos e computadores, enquanto o DNS garante a resolução de nomes e as GPOs aplicam políticas. |
| Alice | VPN |`54.89.217.224`- | `172.31.17.170` | N/A | Estabelecimento de conexões seguras entre colaboradores e rede corporativa. |
| Omar | Servidor DHCP | - | 192.168.1.1 | N/A | Configuração de servidor DHCP responsável por distribuir endereços IP automaticamente aos dispositivos da rede local. |

## Detalhamento das Implementações

### 📁 Active Directory (AD), DNS e GPO - Martha Beatriz

## 📤 1. Configuração de Segurança (Security Groups)

### 1.1. Regras de Entrada — `group-sg-ad`

**Descrição:** Define o tráfego permitido para o Controlador de Domínio (AD, DNS, Kerberos, LDAP, SMB).

**Objetivo:** Permitir autenticação, replicação, resolução de nomes e aplicação de políticas entre máquinas da VPC `10.0.0.0/16`.

| Tipo              | Protocolo | Porta / Intervalo | Origem      | Descrição                            |
| ----------------- | --------- | ----------------- | ----------- | ------------------------------------ |
| UDP personalizado | UDP       | 464               | 10.0.0.0/16 | Autenticação Kerberos (UDP)          |
| TCP personalizado | TCP       | 88                | 10.0.0.0/16 | Kerberos (TCP) — autenticação segura |
| UDP personalizado | UDP       | 88                | 10.0.0.0/16 | Kerberos (UDP) — autenticação rápida |
| LDAP              | TCP       | 389               | 10.0.0.0/16 | Diretório e autenticação LDAP        |
| UDP personalizado | UDP       | 389               | 10.0.0.0/16 | LDAP (UDP)                           |
| TCP personalizado | TCP       | 464               | 10.0.0.0/16 | Troca de senha Kerberos              |
| TCP personalizado | TCP       | 135               | 10.0.0.0/16 | RPC (Remote Procedure Call)          |
| TCP personalizado | TCP       | 139               | 10.0.0.0/16 | NetBIOS Session Service              |
| UDP personalizado | UDP       | 137–138           | 10.0.0.0/16 | NetBIOS Name & Datagram              |
| SMB               | TCP       | 445               | 10.0.0.0/16 | Compartilhamento SYSVOL e NETLOGON   |
| TCP personalizado | TCP       | 636               | 10.0.0.0/16 | LDAP Seguro (LDAPS)                  |
| TCP personalizado | TCP       | 3268–3269         | 10.0.0.0/16 | Global Catalog                       |
| DNS (TCP)         | TCP       | 53                | 0.0.0.0/0   | Resolução DNS (TCP)                  |
| DNS (UDP)         | UDP       | 53                | 0.0.0.0/0   | Resolução DNS (UDP)                  |
| SSH               | TCP       | 22                | 0.0.0.0/0   | Acesso remoto                        |
| ICMP              | ICMP      | Tudo              | 10.0.0.0/16 | Ping e diagnóstico interno           |

#### **Saída**

| Tipo                | Destino     | Descrição                                    |
| ------------------- | ----------- | -------------------------------------------- |
| Todos os protocolos | `0.0.0.0/0` | Comunicação livre  |

---

### 1.2. Regras de Entrada — `group-sg-client`

| Tipo | Protocolo | Porta | Origem             | Descrição                                             |
| ---- | --------- | ----- | ------------------ | ----------------------------------------------------- |
| SSH  | TCP       | 22    | 0.0.0.0/0          | Acesso remoto (Linux)                                 |
| RDP  | TCP       | 3389  | 191.165.213.101/32 | Acesso remoto (Windows) via IP fixo da administradora |

#### **Saída**

| Tipo                | Destino     | Descrição                                 |
| ------------------- | ----------- | ----------------------------------------- |
| Todos os protocolos | `0.0.0.0/0` | Comunicação livre |


## 🌐 2. Configuração DNS — Route 53 (Zona Privada)

**Descrição:** A zona hospedada privada `corp.logamtech.local` é usada para resolução interna entre as instâncias da VPC.

| Nome                              | Tipo | Valor            | Função       |
| --------------------------------- | ---- | ---------------- | ------------ |
| `ftp.corp.logamtech.local`        | A    | `18.212.95.192`  | Servidor FTP |
| `web-server.corp.logamtech.local` | A    | `54.145.137.231` | Servidor Web |



## 🖥️ 3. Criar a Instância EC2 do Controlador de Domínio

| Parâmetro      | Valor                   |
| -------------- | ----------------------- |
| Nome           | `dc1-puc`               |
| SO             | Ubuntu Server 22.04 LTS |
| Tipo           | `t3.micro`              |
| Security Group | `group-sg-ad`           |

### 3.1. Elastic IP

**Objetivo:** Garantir IP fixo para o DC.

```bash
Elastic IP: 52.23.39.125
Instância: dc1-puc
```

---

## ⚙️ 4. Configuração do Servidor AD/DC

### 4.1. Acesso à instância

```bash
ssh -i "[chave-ssh]" ubuntu@52.23.39.125
```

### 4.2. Atualização dos pacotes

```bash
sudo apt update && sudo apt upgrade -y
```

### 4.3. Instalação de dependências

```bash
sudo apt install samba krb5-config winbind smbclient dnsutils ldb-tools ntp -y
```

**Durante a configuração do Kerberos:**

```bash
Realm: CORP.LOGAMTECH.LOCAL
KDC: dc1.corp.logamtech.local
Admin Server: dc1.corp.logamtech.local
```

---

## 🧱 5. Provisionamento do Samba AD/DC

### 5.1. Backup do arquivo padrão

```bash
sudo mv /etc/samba/smb.conf /etc/samba/smb.conf.bak
```

### 5.2. Provisionar domínio

```bash
sudo samba-tool domain provision \
  --realm=CORP.LOGAMTECH.LOCAL \
  --domain=CORP \
  --server-role=dc \
  --dns-backend=SAMBA_INTERNAL \
  --use-rfc2307
```

> **Descrição:** Cria a estrutura do domínio `CORP.LOGAMTECH.LOCAL` com suporte a Kerberos, LDAP e DNS interno.

### 5.3. Substituir arquivo de configuração ativo

```bash
sudo cp /var/lib/samba/private/smb.conf /etc/samba/smb.conf
```

### 5.4. Atualizar DNS local (`resolv.conf`)

```bash
sudo nano /etc/resolv.conf
```

**Conteúdo:**

```
nameserver 127.0.0.1
search corp.logamtech.local
```

### 5.5. Configurar hostname

```bash
hostnamectl set-hostname dc1
```

---

## 🔐 6. Configurar e Validar o Kerberos

### 6.1. Testar autenticação

```bash
kinit administrator@CORP.LOGAMTECH.LOCAL
```

### 6.2. Listar ticket

```bash
klist
```

**Explicação:**

`kinit` autentica e obtém um *ticket*.

`klist` mostra o ticket emitido e sua validade, confirmando o funcionamento do Kerberos.


## 🔧 7. Ativar e Validar Serviços

### 7.1. Ativar e iniciar o Samba

```bash
sudo systemctl unmask samba-ad-dc
sudo systemctl enable samba-ad-dc
sudo systemctl start samba-ad-dc
```

### 7.2. Verificar status

```bash
sudo systemctl status samba-ad-dc
```

### 7.3. Validar nível funcional

```bash
samba-tool domain level show
```

> **Descrição:** Exibe os níveis de *forest* e *domain*, indicando que o AD foi promovido corretamente.

### 7.4. Testar resolução DNS

```bash
host -t A dc1.corp.logamtech.local
```

> **Descrição:** Retorna o IP do DC se o DNS interno estiver funcionando.



## 🧱 8. Criar grupos e usuários no domínio

### 8.1. Grupo administrativo `Administradores_Logam`

**Descrição:** Este grupo terá privilégios administrativos dentro do domínio e será usado para centralizar as permissões de gerenciamento do AD.

```bash
sudo samba-tool group add "Administradores_Logam" --description="Grupo com privilégios administrativos no domínio"
```

### 8.2. Grupo usuários comuns `Usuarios_Logam`

```bash
sudo samba-tool group add "Users_Logam" --description="Grupo padrão de usuários do domínio"
```

### 8.3. Criando usuários no domínio

**Descrição:** Cria contas de usuário dentro do domínio CORP.LOGAMTECH.LOCAL.

**Padrão de senha:** Nome!2025

```bash
sudo samba-tool user create andre 'Andre!2025'
sudo samba-tool user create renata 'Renata!2025'
sudo samba-tool user create marcelo 'Marcelo!2025'
sudo samba-tool user create patricia 'Patricia!2025'
sudo samba-tool user create diego 'Diego!2025'
sudo samba-tool user create laura 'Laura!2025'
sudo samba-tool user create cristina 'Cristina!2025'
sudo samba-tool user create gustavo 'Gustavo!2025'
sudo samba-tool user create nathalia 'Nathalia!2025'
sudo samba-tool user create bruno 'Bruno!2025'
sudo samba-tool user create caroline 'Caroline!2025'
sudo samba-tool user create joao 'Joao!2025'
sudo samba-tool user create monique 'Monique!2025'
sudo samba-tool user create arthur 'Arthur!2025'
sudo samba-tool user create elisa 'Elisa!2025'
sudo samba-tool user create henrique 'Henrique!2025'
sudo samba-tool user create isabela 'Isabela!2025'
sudo samba-tool user create pedro 'Pedro!2025'
sudo samba-tool user create lorena 'Lorena!2025'
sudo samba-tool user create ricardo 'Ricardo!2025'
```

### 8.3.1 Listar os usuários criados e verificar um usuário específico

Para listar todos os usuários criados:

```bash
sudo samba-tool user list
```

Para verificar um usuário específico (exemplo: renata):

```bash
sudo samba-tool user show renata
```

### 8.4. Adicionar usuários aos grupos

**Descrição:** Associa os usuários criados aos grupos correspondentes de acordo com suas funções e permissões.

```bash
sudo samba-tool group addmembers "Users_Logam" Andre Renata Marcelo Patricia Diego Laura Cristina Gustavo Nathalia Bruno Caroline Joao Monique Arthur Elisa Henrique Isabela Pedro Lorena Ricardo
```

**Descrição:** Grupo com privilégios administrativos para gerenciar o domínio (criação de usuários, senhas, políticas, etc.)

```bash
sudo samba-tool group addmembers "Administradores_Logam" Martha Gustavo Patricia Ricardo Nathalia Andre
```

### 8.5. Validar o domínio e os grupos criados

```bash
sudo samba-tool user list
sudo samba-tool group list
sudo samba-tool group show "Users_Logam"
sudo samba-tool group show "Administradores_Logam"
```

### 8.6. Validar autenticação Kerberos com usuário do AD

```bash
kinit martha@CORP.LOGAMTECH.LOCAL
klist
```

---

## 💻 9. Validar Ingresso de EC2 no Domínio

### 9.1 Criar a Instância EC2 do cliente

| Parâmetro      | Valor                   |
| -------------- | ----------------------- |
| Nome           | `client-01`             |
| SO             | Ubuntu Server 22.04 LTS |
| Tipo           | `t3.large`              |
| Security Group | `group-sg-client`       |

### 9.1.1 Elastic IP

**Objetivo:** Garantir IP fixo para o DC.

```bash
Elastic IP: 98.90.28.104
Instância: client-01
```

### 9.2. Atualizar pacotes do sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 9.3. Instalar dependências de comunicação com o AD

```bash
sudo apt install realmd sssd-ad sssd-tools adcli krb5-user samba-common -y
```

### 9.4. Verificar descoberta do domínio

```bash
realm discover corp.logamtech.local
```

### 9.5. Corrigir DNS (caso necessário)

```bash
sudo nano /etc/resolv.conf
```

**Conteúdo:**

```
nameserver 10.0.1.162
search corp.logamtech.local
```

### 9.6. Ingressar cliente no domínio

💡 Durante o processo será solicitada a senha do administrador do domínio.

```bash
sudo realm join --user=administrator@CORP.LOGAMTECH.LOCAL corp.logamtech.local
```

### 9.7. Validar se o EC2 foi vinculado corretamente ao domínio

```bash
realm list
```

### 9.8. Validar autenticação de um usuário

```bash
id martha@corp.logamtech.local
getent passwd martha@corp.logamtech.local
```

----

### 📁 Servidor FTP - Leandro

Coloque aqui as configs

----

### 📁 Servidor VPN (OpenVPN) - Alice Abreu dos Reis

#### Configuração do Servidor

##### 1. Criação da Instância EC2

- Nome: `vpn-server`
- Sistema operacional: Ubuntu 24.04 LTS
- Tipo de instância: t3.micro
- Storage: 8 GB
- Security Group: VPN
- IP privado: `172.31.17.170`

##### 2. Security Group da VPN

- Nome: `VPN`
- Descrição: `Security Group para servidor web`
- Regras de entrada:
- UDP 1194 – Acesso de clientes OpenVPN: 0.0.0.0/0
- SSH 22 – Acesso administrativo: 0.0.0.0/0
- ICMP (Echo Request) – Permitir testes de conectividade (ping) entre cliente e servidor: 0.0.0.0/0
- Regras de saída:
  - Todos: `0.0.0.0/0:0`

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

#### Configuração do Servidor

##### 1. Criação da Máquina Virtual

- Nome: `DebianSrv`  
- Virtualizador: Oracle VM VirtualBox  
- Sistema operacional: Debian 13  
- Memória RAM: 1 GB  
- Armazenamento: 10 GB  
- Interfaces de rede:  
  - **enp0s3**: modo *NAT*, usada para acesso à internet.  
  - **enp0s8**: modo *rede interna*, utilizada para fornecer endereços IP aos clientes.
  
##### 2. Configuração das Interfaces de Rede

Arquivo: `/etc/network/interfaces`

```bash
# Interface conectada à rede externa (internet), recebe IP automaticamente via DHCP
auto enp0s3
iface enp0s3 inet dhcp

# Interface conectada à rede interna, usada como servidor DHCP, possui IP fixo
auto enp0s8
iface enp0s8 inet static
  address 192.168.1.1
  netmask 255.255.255.0
  dns-nameservers 8.8.8.8 1.1.1.1
```
Após salvar, reiniciar a rede:
```bash
sudo systemctl restart networking
```
##### 3. Instalação do Servidor DHCP
```bash
# atualizar pacotes
sudo apt update -y && sudo apt upgrade -y

# Instalar dhcp-server
sudo apt install isc-dhcp-server -y
```
##### 4. Definição da Interface do DHCP

Arquivo: `/etc/default/isc-dhcp-server`
```bash
# atualizar pacotes
INTERFACESv4="enp0s8"
```

##### 5. Configuração do Escopo DHCP

Arquivo: `/etc/dhcp/dhcpd.config`
```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.51 192.168.1.100;
  option routers 192.168.1.1;
  option domain-name-servers 8.8.8.8, 1.1.1.1;
  option domain-name "exemple.org";
}
```
##### 6. Reinicialização e Teste do Serviço

```bash
sudo systemctl restart isc-dhcp-server
sudo systemctl status isc-dhcp-server
```
Um cliente conectado na mesma rede interna obteve automaticamente um endereço IP dentro da faixa 192.168.1.51 - 192.168.1.100, confirmando o funcionamento correto do serviço DHCP.

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
