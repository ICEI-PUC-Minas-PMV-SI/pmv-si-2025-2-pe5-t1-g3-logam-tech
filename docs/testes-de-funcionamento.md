# 📸 Prints e Demonstração do Funcionamento

## 1. Active Directory (AD), DNS e GPO

Suas imagens aqui

## 2. Servidor FTP

Suas imagens aqui

## 3. Servidor VPN (OpenVPN)

Suas imagens aqui

## 4. Servidor DHCP

Suas imagens aqui

## 5. Servidor web e banco de dados

As figuras a seguir demonstram o funcionamento do ambiente de servidor web e banco de dados configurado na AWS.  
Cada etapa evidencia um componente da arquitetura e comprova o correto funcionamento dos serviços,  
desde a infraestrutura e segurança até os testes de integração entre API e banco de dados.

---

### **Figura 1 – Painel da Instância EC2 na AWS com o Elastic IP associado e Security Group configurado**

A Figura 1 apresenta a instância EC2 configurada para hospedar o servidor web.  
Essa instância executa o sistema operacional **Ubuntu 24.04 LTS** e possui um **Elastic IP**, garantindo endereço público fixo mesmo após reinicializações.  
É nela que residem o **Nginx** e a **aplicação Node.js**, responsáveis por servir o frontend e a API do sistema CRUD.

![image](images/web-and-db/1-painel-ec2.png)

---

### **Figura 2 – Painel do Banco de Dados RDS PostgreSQL com o endpoint e Security Group configurado**

A Figura 2 exibe o serviço **Amazon RDS** utilizado para o banco de dados da aplicação.  
O banco de dados **PostgreSQL** foi criado com acesso restrito apenas à instância EC2, por meio de um Security Group dedicado, assegurando que as conexões externas sejam bloqueadas.  
Esse banco armazena as tabelas utilizadas pelo sistema CRUD (como usuários e produtos).

![image](images/web-and-db/2-painel-rds.png)

---

### **Figura 3 – Regras de Segurança do Servidor Web (Security Group)**

A Figura 3 mostra as regras de segurança aplicadas ao servidor web.  
Apenas as portas necessárias foram liberadas: SSH (22) para administração, HTTP (80) e HTTPS (443) para acesso público, e 3000 para comunicação com a API Node.js.  
Para saída, todas as portas (0.0.0.0/0) estão liberadas, permitindo que o servidor faça requisições externas conforme necessário.

![image](images/web-and-db/3.1-web-security-group-inbound.png)
![image](images/web-and-db/3.2-web-security-group-outbound.png)

---

### **Figura 4 – Regras de Segurança do Banco de Dados (Security Group)**

A Figura 4 apresenta o Security Group do banco de dados PostgreSQL.  
Ele permite conexões apenas provenientes do grupo de segurança do servidor web, na porta 5432, bloqueando todo o tráfego externo.  
Para saída, todas as portas (0.0.0.0/0) estão liberadas, permitindo que o servidor faça requisições externas conforme necessário.

![image](images/web-and-db/4.1-database-security-group-inbound.png)
![image](images/web-and-db/4.2-database-security-group-outbound.png)

---

### **Figura 5 – Acesso SSH ao Servidor Web**

A Figura 5 demonstra o acesso SSH ao servidor EC2 e a execução do comando `docker ps` e o comando `docker logs [nome-do-container]` para verificar os logs do container da aplicação Node.js em execução.  
Evidenciando que o container da aplicação Node.js está em execução e está funcionando corretamente.

![image](images/web-and-db/5-acesso-ssh.png)

---

### **Figura 6 – Variáveis de Ambiente no Container da API**

A Figura 6 mostra o acesso ao container da API Node.js via `docker exec` e a execução do comando `env`, exibindo as variáveis de ambiente configuradas dentro do container em execução.
Essas variáveis incluem as credenciais e configurações necessárias para conexão com o banco de dados PostgreSQL no RDS.

![image](images/web-and-db/6-variaveis-de-ambiente.png)

---

### **Figura 7 – Configuração do Nginx**

A Figura 7 mostra a configuração do **Nginx** utilizada como proxy reverso.
Essa configuração direciona as requisições HTTP da rota `/api` para a aplicação Node.js interna, enquanto serve os arquivos estáticos do frontend diretamente.

![image](images/web-and-db/7-nginx-conf.png)

---

### **Figura 8 – Interface do CRUD no Navegador**

A Figura 8 apresenta a interface do sistema CRUD sendo servida pelo Nginx, acessada diretamente através do **Elastic IP** da instância EC2.
Essa tela comprova que o servidor web está ativo e a aplicação está disponível publicamente.

![image](images/web-and-db/8-web-interface.png)

---

### **Figura 9 – Requisição POST no Postman**

A Figura 9 demonstra o envio de uma requisição POST para a API utilizando o Postman.  
O retorno JSON confirma que o servidor web recebeu a requisição, processou os dados e gravou o novo registro no banco de dados PostgreSQL.

![image](images/web-and-db/9-postman-criar-usuario.png)

---

### **Figura 10 – Registro Inserido no Banco de Dados (DataGrip)**

A Figura 10 exibe o banco de dados acessado via **DataGrip**, comprovando que o registro inserido através da requisição POST na API na Figura 9 foi armazenado na tabela `users`.  
Essa evidência confirma a integração entre o servidor web na EC2 e o banco de dados PostgreSQL no RDS.

![image](images/web-and-db/10-tabela-users.png)