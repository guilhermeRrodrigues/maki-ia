# 🚀 Deploy em Produção - MAKI IA

Este guia fornece instruções passo a passo para fazer deploy da MAKI IA em um servidor Ubuntu Server com Docker.

## 📋 Pré-requisitos

- Servidor Ubuntu Server com acesso SSH
- IP do servidor: **45.70.136.66**
- Acesso root ou usuário com permissões sudo
- Porta 80 disponível (ou ajuste para outra porta no docker-compose.yml)

## 🔧 Instalação do Docker no Servidor Ubuntu

### 1. Conectar ao servidor via SSH

```bash
ssh usuario@45.70.136.66
```

### 2. Atualizar o sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Instalar Docker

```bash
# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Adicionar seu usuário ao grupo docker (para não precisar usar sudo)
sudo usermod -aG docker $USER

# Reiniciar sessão ou fazer logout/login para aplicar as mudanças
```

### 4. Verificar instalação

```bash
docker --version
docker compose version
```

## 📦 Preparar os Arquivos no Servidor

### Opção 1: Usando Git (Recomendado)

```bash
# Instalar Git (se não tiver)
sudo apt install -y git

# Clonar o repositório ou fazer pull das alterações
git clone <seu-repositorio> /opt/maki-ia
cd /opt/maki-ia

# OU se já existir, fazer pull
cd /opt/maki-ia
git pull origin main
```

### Opção 2: Transferir Arquivos via SCP

No seu computador local:

```bash
scp -r /caminho/do/projeto/maki-ia usuario@45.70.136.66:/opt/
```

No servidor:

```bash
cd /opt/maki-ia
```

## 🚀 Deploy da Aplicação

### 1. Dar permissão de execução ao script de deploy

```bash
chmod +x deploy.sh
```

### 2. Executar o script de deploy

```bash
./deploy.sh
```

### OU executar manualmente:

```bash
# Parar containers existentes
docker compose down

# Construir a imagem
docker compose build --no-cache

# Iniciar em background
docker compose up -d

# Ver logs
docker compose logs -f
```

## 🌐 Configuração do Firewall (UFW)

Se o firewall estiver ativo, libere a porta 80:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # Se usar HTTPS no futuro
sudo ufw reload
sudo ufw status
```

## ✅ Verificar Deploy

### 1. Verificar se o container está rodando

```bash
docker ps
```

Você deve ver o container `maki_ia_app` rodando.

### 2. Testar a aplicação localmente no servidor

```bash
curl http://localhost/api/status
```

### 3. Acessar pelo navegador

Abra no navegador:
- **http://45.70.136.66** (porta 80)
- **http://45.70.136.66/home**

## 📝 Comandos Úteis

### Ver logs em tempo real
```bash
docker compose logs -f
```

### Parar a aplicação
```bash
docker compose down
```

### Reiniciar a aplicação
```bash
docker compose restart
```

### Ver status dos containers
```bash
docker compose ps
```

### Entrar no container
```bash
docker exec -it maki_ia_app bash
```

### Rebuild completo
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 🔄 Atualizar a Aplicação

Para atualizar a aplicação após fazer alterações:

```bash
cd /opt/maki-ia

# Se usar Git:
git pull origin main

# Rebuild e restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Ver logs
docker compose logs -f
```

## 🔒 Configuração de Segurança

### 1. Configurar Nginx como Reverse Proxy (Opcional mas Recomendado)

Instalar Nginx:
```bash
sudo apt install -y nginx
```

Criar configuração do Nginx:
```bash
sudo nano /etc/nginx/sites-available/maki-ia
```

Conteúdo:
```nginx
server {
    listen 80;
    server_name 45.70.136.66;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar:
```bash
sudo ln -s /etc/nginx/sites-available/maki-ia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Configurar SSL/HTTPS com Let's Encrypt (Opcional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker compose logs

# Verificar se a porta está em uso
sudo netstat -tulpn | grep :80
sudo lsof -i :80
```

### Aplicação não responde

```bash
# Verificar logs do container
docker compose logs -f app

# Testar dentro do container
docker exec -it maki_ia_app curl http://localhost:5000/api/status
```

### Rebuild completo

```bash
docker compose down -v
docker system prune -a -f
docker compose build --no-cache
docker compose up -d
```

## 📊 Monitoramento

### Ver uso de recursos

```bash
docker stats maki_ia_app
```

### Verificar saúde do container

```bash
docker inspect maki_ia_app | grep -A 10 Health
```

## 🌍 Configuração para Outra Porta

Se quiser usar outra porta além da 80, edite o `docker-compose.yml`:

```yaml
ports:
  - "8080:5000"  # Porta 8080 do host
```

Depois libere a porta no firewall:
```bash
sudo ufw allow 8080/tcp
```

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs: `docker compose logs -f`
2. Status: `docker compose ps`
3. Portas: `sudo netstat -tulpn | grep :80`
4. Firewall: `sudo ufw status`

---

**Desenvolvido por:** João Guilherme  
**Instituição:** SESI  
**Versão:** 1.0.0

