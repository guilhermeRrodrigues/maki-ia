# Deploy da MAKI IA em Produção - Ubuntu Server

## Pré-requisitos

1. **Ubuntu Server** com Docker e Docker Compose instalados
2. **Porta 80** disponível (ou ajuste no docker-compose.yml)
3. **Chave da API do Google Gemini** configurada

## Instalação do Docker (se necessário)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

## Deploy da Aplicação

1. **Clonar o repositório:**
```bash
git clone <seu-repositorio>
cd maki-ia
```

2. **Configurar domínio (batatajg.shop):**
```bash
# Verificar se o DNS está apontando para o servidor
nslookup batatajg.shop

# Deve retornar: 45.70.136.66
```

3. **Configurar variáveis de ambiente (opcional):**
```bash
# Criar arquivo .env se necessário
echo "FLASK_ENV=production" > .env
echo "FLASK_DEBUG=0" >> .env
```

4. **Construir e executar:**
```bash
# Construir a imagem
docker-compose build

# Executar em background
docker-compose up -d

# Verificar status
docker-compose ps
```

5. **Configurar porta 80 (opcional):**
```bash
# Executar script de configuração (requer sudo)
sudo bash configure-port80.sh

# Ou configurar manualmente:
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

6. **Acessar a aplicação:**
- **Domínio:** `http://batatajg.shop:8080` (atual)
- **IP direto:** `http://45.70.136.66:8080`
- **Com porta 80:** `http://batatajg.shop` (após configuração)

## Comandos Úteis

```bash
# Ver logs da aplicação
docker-compose logs -f app

# Parar a aplicação
docker-compose down

# Reiniciar a aplicação
docker-compose restart

# Atualizar a aplicação
git pull
docker-compose build
docker-compose up -d
```

## Configurações de Produção

- **Domínio:** `batatajg.shop` (porta 80 padrão)
- **IP:** `45.70.136.66` (porta 80)
- **Restart:** Automático em caso de falha
- **Debug:** Desabilitado para melhor performance
- **Volumes:** Código montado para facilitar atualizações
- **Permissões:** `NET_BIND_SERVICE` para usar porta 80

## Monitoramento

```bash
# Verificar status do container
docker ps

# Ver logs em tempo real
docker-compose logs -f

# Verificar uso de recursos
docker stats
```

## Backup e Restauração

```bash
# Backup do código
tar -czf maki-ia-backup-$(date +%Y%m%d).tar.gz .

# Restaurar
tar -xzf maki-ia-backup-YYYYMMDD.tar.gz
```

## Troubleshooting

1. **Porta 80 ocupada:**
   - Altere a porta no docker-compose.yml para 3000
   - Ou pare o serviço que está usando a porta 80

2. **Erro de permissão na porta 80:**
   - Execute: `sudo chown -R $USER:$USER .`
   - O `cap_add: NET_BIND_SERVICE` já está configurado

3. **Domínio não funciona:**
   - Verifique DNS: `nslookup batatajg.shop`
   - Deve apontar para: `45.70.136.66`
   - Teste com IP direto: `http://45.70.136.66`

4. **Container não inicia:**
   - Verifique logs: `docker-compose logs app`
   - Verifique se a API key do Gemini está correta

## Segurança

- Mantenha o sistema atualizado
- Configure firewall se necessário
- Monitore logs regularmente
- Use HTTPS em produção (configure proxy reverso)
