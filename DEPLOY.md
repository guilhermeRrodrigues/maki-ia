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

2. **Configurar variáveis de ambiente (opcional):**
```bash
# Criar arquivo .env se necessário
echo "FLASK_ENV=production" > .env
echo "FLASK_DEBUG=0" >> .env
```

3. **Construir e executar:**
```bash
# Construir a imagem
docker-compose build

# Executar em background
docker-compose up -d

# Verificar status
docker-compose ps
```

4. **Acessar a aplicação:**
- URL: `http://45.70.136.66:8080`
- Ou: `http://seu-servidor:8080`

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

- **Porta:** A aplicação roda na porta 8080 (acessível via http://seu-servidor:8080)
- **Restart:** Automático em caso de falha
- **Debug:** Desabilitado para melhor performance
- **Volumes:** Código montado para facilitar atualizações

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
   - Altere a porta no docker-compose.yml
   - Ou pare o serviço que está usando a porta 80

2. **Erro de permissão:**
   - Execute: `sudo chown -R $USER:$USER .`

3. **Container não inicia:**
   - Verifique logs: `docker-compose logs app`
   - Verifique se a API key do Gemini está correta

## Segurança

- Mantenha o sistema atualizado
- Configure firewall se necessário
- Monitore logs regularmente
- Use HTTPS em produção (configure proxy reverso)
