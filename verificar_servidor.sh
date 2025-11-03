#!/bin/bash

# Script de verificação completa do servidor
# Execute após o deploy para verificar se tudo está funcionando

echo "🔍 Verificação Completa do Servidor MAKI IA"
echo "============================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Verificar Docker
echo "1️⃣ Verificando Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker instalado${NC}"
    docker --version
else
    echo -e "${RED}❌ Docker não instalado${NC}"
    exit 1
fi

# 2. Verificar Container
echo ""
echo "2️⃣ Verificando Container..."
if docker ps | grep -q maki_ia_app; then
    echo -e "${GREEN}✅ Container está rodando${NC}"
    CONTAINER_STATUS=$(docker ps --filter "name=maki_ia_app" --format "{{.Status}}")
    echo "   Status: $CONTAINER_STATUS"
else
    echo -e "${RED}❌ Container NÃO está rodando${NC}"
    echo "   Tentando iniciar..."
    docker-compose up -d
    sleep 5
    if docker ps | grep -q maki_ia_app; then
        echo -e "${GREEN}✅ Container iniciado${NC}"
    else
        echo -e "${RED}❌ Falha ao iniciar container${NC}"
        echo "   Logs:"
        docker-compose logs --tail=20
        exit 1
    fi
fi

# 3. Verificar Processo Gunicorn
echo ""
echo "3️⃣ Verificando Processo Gunicorn..."
if docker exec maki_ia_app ps aux | grep -q gunicorn; then
    echo -e "${GREEN}✅ Gunicorn está rodando${NC}"
    docker exec maki_ia_app ps aux | grep gunicorn | head -2
else
    echo -e "${RED}❌ Gunicorn NÃO está rodando${NC}"
    echo "   Verificando logs..."
    docker logs maki_ia_app --tail=30
    exit 1
fi

# 4. Verificar Porta 80
echo ""
echo "4️⃣ Verificando Porta 80..."
if sudo netstat -tlnp 2>/dev/null | grep -q ":80 " || sudo ss -tlnp 2>/dev/null | grep -q ":80 "; then
    echo -e "${GREEN}✅ Porta 80 está em uso${NC}"
    PORT_INFO=$(sudo netstat -tlnp 2>/dev/null | grep ":80 " || sudo ss -tlnp 2>/dev/null | grep ":80 ")
    echo "   $PORT_INFO"
else
    echo -e "${YELLOW}⚠️  Porta 80 não está sendo usada${NC}"
    echo "   Verificando mapeamento do Docker..."
    docker port maki_ia_app 2>/dev/null || echo "   Container não expõe portas"
fi

# 5. Verificar Firewall
echo ""
echo "5️⃣ Verificando Firewall..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | head -1)
    echo "   $UFW_STATUS"
    if echo "$UFW_STATUS" | grep -q "ativo\|active"; then
        if sudo ufw status | grep -q "80/tcp"; then
            echo -e "${GREEN}✅ Porta 80 permitida no firewall${NC}"
        else
            echo -e "${YELLOW}⚠️  Porta 80 pode estar bloqueada${NC}"
            echo "   Execute: sudo ufw allow 80/tcp"
        fi
    fi
fi

# 6. Testar Localhost
echo ""
echo "6️⃣ Testando Localhost..."
LOCAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/status 2>/dev/null || echo "000")
if [ "$LOCAL_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Localhost responde (HTTP $LOCAL_STATUS)${NC}"
    curl -s http://localhost/api/status | head -3
else
    echo -e "${RED}❌ Localhost NÃO responde (HTTP $LOCAL_STATUS)${NC}"
    echo "   Verificando logs do container..."
    docker logs maki_ia_app --tail=20
fi

# 7. Testar IP do Servidor
echo ""
echo "7️⃣ Testando IP do Servidor..."
SERVER_IP=$(hostname -I | awk '{print $1}' | head -1)
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "N/A")
fi

echo "   IP do servidor: $SERVER_IP"
if [ "$SERVER_IP" != "N/A" ]; then
    IP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://$SERVER_IP/api/status 2>/dev/null || echo "000")
    if [ "$IP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ IP do servidor responde (HTTP $IP_STATUS)${NC}"
    else
        echo -e "${YELLOW}⚠️  IP do servidor não responde (HTTP $IP_STATUS)${NC}"
        echo "   Pode ser problema de firewall ou rede"
    fi
fi

# 8. Verificar Logs de Erro
echo ""
echo "8️⃣ Verificando Logs de Erro..."
ERROR_COUNT=$(docker logs maki_ia_app 2>&1 | grep -i "error\|exception\|traceback" | wc -l)
if [ "$ERROR_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Encontrados $ERROR_COUNT erros nos logs${NC}"
    echo "   Últimos erros:"
    docker logs maki_ia_app 2>&1 | grep -i "error\|exception\|traceback" | tail -5
else
    echo -e "${GREEN}✅ Nenhum erro encontrado nos logs${NC}"
fi

# 9. Testar Rotas Específicas
echo ""
echo "9️⃣ Testando Rotas Específicas..."
for route in "/api/status" "/agent" "/home"; do
    ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost$route 2>/dev/null || echo "000")
    if [ "$ROUTE_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ $route (HTTP $ROUTE_STATUS)${NC}"
    else
        echo -e "${RED}❌ $route (HTTP $ROUTE_STATUS)${NC}"
    fi
done

# 10. Verificar Arquivos no Container
echo ""
echo "🔟 Verificando Arquivos no Container..."
docker exec maki_ia_app test -f /app/app.py && echo -e "${GREEN}✅ app.py existe${NC}" || echo -e "${RED}❌ app.py NÃO existe${NC}"
docker exec maki_ia_app test -f /app/templates/agent.html && echo -e "${GREEN}✅ agent.html existe${NC}" || echo -e "${RED}❌ agent.html NÃO existe${NC}"
docker exec maki_ia_app test -f /app/static/js/agent.js && echo -e "${GREEN}✅ agent.js existe${NC}" || echo -e "${RED}❌ agent.js NÃO existe${NC}"
docker exec maki_ia_app test -f /app/static/css/agent.css && echo -e "${GREEN}✅ agent.css existe${NC}" || echo -e "${RED}❌ agent.css NÃO existe${NC}"

# Resumo Final
echo ""
echo "============================================"
echo "📋 Resumo Final:"
echo ""

# Container
if docker ps | grep -q maki_ia_app; then
    echo -e "${GREEN}✅ Container: Rodando${NC}"
else
    echo -e "${RED}❌ Container: Parado${NC}"
fi

# Gunicorn
if docker exec maki_ia_app ps aux 2>/dev/null | grep -q gunicorn; then
    echo -e "${GREEN}✅ Gunicorn: Rodando${NC}"
else
    echo -e "${RED}❌ Gunicorn: Parado${NC}"
fi

# Localhost
LOCAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/status 2>/dev/null || echo "000")
if [ "$LOCAL_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Localhost: Funcionando${NC}"
else
    echo -e "${RED}❌ Localhost: Não responde${NC}"
fi

echo ""
echo "💡 Próximos passos se não estiver funcionando:"
echo "   1. Verificar logs: docker logs maki_ia_app"
echo "   2. Verificar firewall: sudo ufw status"
echo "   3. Reiniciar: docker-compose restart"
echo "   4. Reconstruir: docker-compose build --no-cache && docker-compose up -d"
echo ""

