# 🔧 Solução de Problemas - Modo Agent não funciona no servidor

## Passos para Diagnosticar

### 1. Execute o script de diagnóstico
```bash
chmod +x diagnostico.sh
./diagnostico.sh
```

Este script vai mostrar:
- Se o container está rodando
- Quais arquivos existem no container
- Se os endpoints HTTP respondem
- Logs relevantes

### 2. Verificar manualmente no container
```bash
# Entrar no container
docker exec -it maki_ia_app bash

# Dentro do container, verificar arquivos
ls -la /app/templates/
ls -la /app/static/js/
ls -la /app/static/css/

# Verificar se os arquivos específicos existem
test -f /app/templates/agent.html && echo "EXISTE" || echo "NÃO EXISTE"
test -f /app/static/js/agent.js && echo "EXISTE" || echo "NÃO EXISTE"
test -f /app/static/css/agent.css && echo "EXISTE" || echo "NÃO EXISTE"

# Sair do container
exit
```

### 3. Testar endpoints HTTP
```bash
# Testar página agent
curl -I http://localhost/agent

# Testar arquivos estáticos diretamente
curl -I http://localhost/static/css/agent.css
curl -I http://localhost/static/js/agent.js

# Ver resposta completa
curl http://localhost/api/debug/files | python3 -m json.tool
```

### 4. Ver logs detalhados
```bash
# Ver todos os logs
docker logs maki_ia_app

# Ver apenas erros
docker logs maki_ia_app 2>&1 | grep -i error

# Ver logs em tempo real
docker logs -f maki_ia_app
```

## Problemas Comuns e Soluções

### Problema 1: Arquivos não existem no container

**Sintoma:** `diagnostico.sh` mostra que arquivos não existem

**Solução:**
```bash
# Reconstruir do zero
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar novamente
./diagnostico.sh
```

### Problema 2: Arquivos existem mas HTTP retorna 404

**Sintoma:** Arquivos existem no container mas `curl http://localhost/static/css/agent.css` retorna 404

**Solução:** Problema com Flask/Gunicorn servindo arquivos estáticos

**Correção aplicada:** O Dockerfile foi ajustado para garantir cópia correta e permissões.

### Problema 3: Página carrega mas JavaScript não funciona

**Sintoma:** `/agent` retorna 200 mas página não funciona

**Diagnóstico:**
1. Abrir console do navegador (F12)
2. Verificar se há erros JavaScript
3. Verificar se arquivos JS/CSS estão sendo carregados (Network tab)

### Problema 4: Permissões incorretas

**Sintoma:** Arquivos existem mas usuário não pode ler

**Correção:** Dockerfile foi ajustado para garantir permissões 755

## Reconstruir Tudo do Zero

Se nada funcionar, execute:

```bash
# 1. Parar tudo
docker-compose down

# 2. Remover imagens antigas
docker rmi $(docker images | grep maki | awk '{print $3}') 2>/dev/null || true

# 3. Limpar cache do Docker
docker builder prune -f

# 4. Reconstruir
./deploy.sh

# 5. Verificar
./diagnostico.sh
```

## Enviar Resultados do Diagnóstico

Execute e envie o resultado:
```bash
./diagnostico.sh > diagnostico_resultado.txt 2>&1
cat diagnostico_resultado.txt
```

Isso vai ajudar a identificar o problema específico.

