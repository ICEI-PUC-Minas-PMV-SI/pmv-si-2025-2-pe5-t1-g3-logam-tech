# Membros do Grupo e Responsabilidades

| Membro | Responsabilidade |
|--------|---------|
| Alice Abreu dos Reis | - |
| Gabriel dos Reis Nascimento | Fiquei responsável pela monitoração do servidor web (API em Node.js e NGINX) hospedado em uma instância EC2 na AWS. Instalei e configurei o Zabbix Agent no servidor (Ubuntu 24.04), ajustei o arquivo `zabbix_agentd.conf` para permitir comunicação com o Zabbix Server e garanti a abertura da porta 10050 via Security Groups. Cadastrei o host no Zabbix Frontend, corrigi problemas de conectividade (Unknown status, permissões de acesso, ServerActive) e implementei a coleta de métricas do sistema operacional. Também documentei os passos relacionados à configuração do agente e integração com o Zabbix, além de preparar o NGINX para expor a rota `/basic_status` para monitoramento. Além disso, criei um dashboard personalizado no Zabbix exibindo gráficos de uso de CPU, memória e quantidade de requisições processadas pelo NGINX.|
| Leandro Augusto Santos Araujo | - |
| Martha Beatriz Siqueira da Silva | - |
| Omar P. Martins| Fiquei responsável pela etapa de monitoramento do servidor DHCP já configurado na fase anterior. Instalei e configurei o Zabbix Agent na VM Debian e implementei o Zabbix Server utilizando o Zabbix Appliance em outra VM. Ajustei os adaptadores de rede para garantir a comunicação, cadastrei o host no Zabbix Frontend e vinculei ao template Linux para coleta de métricas de CPU, memória, tráfego de rede e disco. Documentei todo o processo no Overleaf e no GitHub, incluindo prints dos dashboards e explicações. Também realizei testes de conectividade e auxiliei com pequenas correções no documento geral do projeto. |
