# 🚀 Deploy Rápido - MAKI IA no Ubuntu Server via SSH

## Pré-requisitos Mínimos
- Servidor Ubuntu Server (18.04+)
- Acesso SSH ao servidor
- Acesso sudo (para configurações)

## Deploy em 3 Passos

### 1️⃣ Conectar no servidor via SSH
```bash
ssh usuario@seu-servidor
cd /caminho/do/projeto
```

### 2️⃣ Executar o script de deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3️⃣ Aguardar a conclusão
O script irá:
- ✅ Verificar e instalar Docker (se necessário)
- ✅ Verificar e instalar Docker Compose (se necessário)
- ✅ Verificar arquivos essenciais
- ✅ Construir a imagem Docker
- ✅ Iniciar os containers
- ✅ Testar a aplicação
- ✅ Configurar serviço systemd (início automático)

## O que o script faz automaticamente:

1. **Verifica dependências**
   - Docker instalado? Se não, instala automaticamente
   - Docker Compose instalado? Se não, instala automaticamente
   - Usuário no grupo docker? Adiciona se necessário

2. **Valida arquivos**
   - Verifica se todos os arquivos essenciais existem
   - Verifica templates e arquivos estáticos

3. **Build e Deploy**
   - Para containers antigos
   - Limpa recursos não utilizados
   - Constrói nova imagem
   - Inicia containers em background

4. **Testes**
   - Testa endpoint `/api/status`
   - Testa página `/home`
   - Testa rota `/agent`
   - Testa API Gemini

5. **Configuração de Serviço**
   - Configura systemd para início automático
   - Garante que aplicação continue rodando após fechar SSH

## Após o Deploy

### Acessar a aplicação:
```bash
# No servidor ou externamente
curl http://localhost/api/status
# ou
http://SEU_IP_SERVIDOR
http://SEU_IP_SERVIDOR/agent
```

### Ver logs
```bash
docker-compose logs -f
# ou
docker-compose logs app --tail=50
```

### Comandos úteis
```bash
# Parar aplicação
docker-compose down

# Reiniciar aplicação
docker-compose restart

# Ver status
docker-compose ps

# Status do serviço systemd
sudo systemctl status maki-ia

# Reiniciar serviço
sudo systemctl restart maki-ia
```

## Diagnóstico

### Testar endpoints
```bash
# Status da API
curl http://localhost/api/status

# Testar Gemini
curl http://localhost/api/test-gemini

# Verificar arquivos
curl http://localhost/api/debug/files
```

### Verificar se está rodando
```bash
# Ver containers
docker ps | grep maki_ia

# Ver logs de erro
docker-compose logs app | grep -i error

# Verificar saúde
docker inspect maki_ia_app | grep -A 5 Health
```

## Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs app

# Reconstruir do zero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Porta 80 já em uso
```bash
# Ver o que está usando
sudo netstat -tlnp | grep :80

# Parar serviço conflitante (se necessário)
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Serviço systemd não funciona
```bash
# Ver status
sudo systemctl status maki-ia

# Ver logs do systemd
sudo journalctl -u maki-ia -f

# Reconfigurar
sudo cp maki-ia.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable maki-ia
sudo systemctl start maki-ia
```

## Atualização

Para atualizar a aplicação após mudanças:
```bash
git pull  # Se usando git
./deploy.sh  # Re-executar deploy
```

## Segurança

- ✅ Container roda como usuário não-root
- ✅ Chave de API está no código (considere usar variáveis de ambiente em produção)
- ✅ Health checks configurados
- ✅ Logs limitados em tamanho

## Suporte

Se algo não funcionar:
1. Verifique os logs: `docker-compose logs app`
2. Verifique o status: `docker ps`
3. Teste os endpoints: `curl http://localhost/api/status`
4. Verifique o serviço: `sudo systemctl status maki-ia`

