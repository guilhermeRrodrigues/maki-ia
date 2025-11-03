# 🔧 Como Resolver: Não Funciona no Navegador

## ⚠️ IMPORTANTE: Use HTTP, não HTTPS!

O erro de timeout geralmente acontece porque:
1. Está usando **HTTPS** quando deveria ser **HTTP**
2. Firewall bloqueando porta 80
3. Container não está rodando corretamente

## 🚀 Passo a Passo no Servidor

### 1. Baixar atualizações do GitHub
```bash
cd /caminho/do/projeto
git pull origin main
```

### 2. Executar verificação completa
```bash
chmod +x verificar_servidor.sh
./verificar_servidor.sh
```

Este script vai verificar:
- ✅ Se container está rodando
- ✅ Se Gunicorn está ativo
- ✅ Se porta 80 está sendo usada
- ✅ Se firewall está bloqueando
- ✅ Se localhost responde
- ✅ Se IP do servidor responde
- ✅ Se há erros nos logs
- ✅ Se rotas específicas funcionam
- ✅ Se arquivos existem no container

### 3. Se o script mostrar problemas

#### Problema: Container não está rodando
```bash
docker-compose up -d
docker logs maki_ia_app
```

#### Problema: Gunicorn não está rodando
```bash
docker logs maki_ia_app --tail=50
# Procurar por erros no log
```

#### Problema: Firewall bloqueando
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw reload
```

#### Problema: Porta 80 já em uso
```bash
sudo netstat -tlnp | grep :80
# Se outro processo estiver usando, pare-o ou use outra porta
```

### 4. Reconstruir do zero (se necessário)
```bash
docker-compose down
docker rmi $(docker images | grep maki | awk '{print $3}') 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d
sleep 10
./verificar_servidor.sh
```

### 5. Verificar logs em tempo real
```bash
docker logs -f maki_ia_app
```

## 🌐 Testar Acesso

### No próprio servidor:
```bash
# Deve retornar JSON
curl http://localhost/api/status

# Deve retornar HTML
curl http://localhost/agent | head -20

# Verificar se arquivos estáticos carregam
curl -I http://localhost/static/css/agent.css
curl -I http://localhost/static/js/agent.js
```

### No navegador (do seu PC):
```
http://45.70.136.66
http://45.70.136.66/agent
http://45.70.136.66/api/status
```

**⚠️ NUNCA use HTTPS (https://) - apenas HTTP (http://)**

## 🔍 Problemas Comuns

### 1. Timeout no navegador
**Causa:** Container não está respondendo ou firewall bloqueando

**Solução:**
```bash
# Verificar se container está rodando
docker ps | grep maki_ia_app

# Verificar logs
docker logs maki_ia_app --tail=50

# Verificar firewall
sudo ufw status
sudo ufw allow 80/tcp
```

### 2. Página carrega mas não funciona
**Causa:** Arquivos estáticos (JS/CSS) não estão sendo servidos

**Solução:**
```bash
# Verificar se arquivos existem
docker exec maki_ia_app ls -la /app/static/js/
docker exec maki_ia_app ls -la /app/static/css/

# Testar acesso direto
curl http://localhost/static/js/agent.js | head -10
```

### 3. Erro 500 Internal Server Error
**Causa:** Erro no código Python ou falta de arquivos

**Solução:**
```bash
# Ver logs detalhados
docker logs maki_ia_app 2>&1 | grep -i "error\|exception\|traceback"

# Verificar endpoint de debug
curl http://localhost/api/debug/files | python3 -m json.tool
```

### 4. Container para após alguns minutos
**Causa:** Gunicorn está crashando ou erro na aplicação

**Solução:**
```bash
# Ver logs de erro
docker logs maki_ia_app

# Verificar se há erros na inicialização
docker logs maki_ia_app 2>&1 | grep -i "error" | tail -20
```

## 📋 Checklist de Verificação

Execute estes comandos e verifique cada item:

```bash
# ✅ Container rodando?
docker ps | grep maki_ia_app

# ✅ Gunicorn rodando?
docker exec maki_ia_app ps aux | grep gunicorn

# ✅ Porta 80 mapeada?
docker port maki_ia_app

# ✅ Firewall permitindo?
sudo ufw status | grep 80

# ✅ Localhost responde?
curl http://localhost/api/status

# ✅ Arquivos existem?
docker exec maki_ia_app test -f /app/app.py && echo "OK" || echo "ERRO"
docker exec maki_ia_app test -f /app/templates/agent.html && echo "OK" || echo "ERRO"
docker exec maki_ia_app test -f /app/static/js/agent.js && echo "OK" || echo "ERRO"
docker exec maki_ia_app test -f /app/static/css/agent.css && echo "OK" || echo "ERRO"
```

## 💡 Dica Final

Execute o script de verificação:
```bash
./verificar_servidor.sh
```

Ele vai mostrar exatamente o que está funcionando e o que não está!

Se mesmo assim não funcionar, envie o output completo de:
```bash
./verificar_servidor.sh > diagnostico_completo.txt 2>&1
cat diagnostico_completo.txt
```

