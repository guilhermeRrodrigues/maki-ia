# Guia de Teste e Diagnóstico da Rota /agent

## Como testar a rota /agent em produção

### 1. Verificar se a aplicação está rodando
```bash
docker-compose ps
# ou
docker ps | grep maki_ia
```

### 2. Verificar logs em tempo real
```bash
docker-compose logs -f app
```

### 3. Testar endpoint de diagnóstico
```bash
# Acesse no navegador ou via curl:
curl http://localhost/api/debug/files
```

Isso mostra:
- Se os templates existem
- Se os arquivos estáticos existem
- Configuração do Flask

### 4. Testar a rota /agent diretamente
```bash
curl -I http://localhost/agent
# Deve retornar HTTP 200
```

### 5. Verificar arquivos no container
```bash
docker-compose exec app ls -la /app/templates/
docker-compose exec app ls -la /app/static/js/
docker-compose exec app ls -la /app/static/css/
```

### 6. Problemas comuns e soluções

#### Problema: Template não encontrado
**Solução:** Verificar se o arquivo foi copiado no Dockerfile
```bash
docker-compose exec app cat /app/templates/agent.html | head -5
```

#### Problema: Arquivos estáticos não carregam
**Solução:** Verificar permissões e caminhos
```bash
docker-compose exec app ls -la /app/static/
```

#### Problema: Erro 500 na rota /agent
**Solução:** Verificar logs detalhados
```bash
docker-compose logs app | grep -i "agent\|error\|exception"
```

### 7. Reconstruir após mudanças
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose logs -f app
```

