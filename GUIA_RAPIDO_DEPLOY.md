# 🚀 Guia Rápido de Deploy - MAKI IA

## Deploy Rápido no Servidor Ubuntu

### 1️⃣ Conectar ao Servidor
```bash
ssh usuario@45.70.136.66
```

### 2️⃣ Instalar Docker (se não tiver)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### 3️⃣ Transferir Arquivos
No seu computador local:
```bash
scp -r /caminho/do/projeto/maki-ia usuario@45.70.136.66:/opt/
```

No servidor:
```bash
cd /opt/maki-ia
```

### 4️⃣ Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### 5️⃣ Liberar Porta no Firewall
```bash
sudo ufw allow 80/tcp
sudo ufw reload
```

### 6️⃣ Acessar
- **http://45.70.136.66**
- **http://45.70.136.66/home**

---

## Comandos Úteis

```bash
# Ver logs
docker compose logs -f

# Parar
docker compose down

# Reiniciar
docker compose restart

# Status
docker compose ps
```

---

Para instruções detalhadas, veja: `DEPLOY_PRODUCAO.md`

