#!/bin/bash

# Script de diagnóstico para problemas no servidor
# Execute no servidor: ./diagnostico.sh

echo "🔍 Diagnóstico da MAKI IA no servidor"
echo "======================================"
echo ""

# Verificar container
echo "1️⃣ Verificando container..."
if docker ps | grep -q maki_ia_app; then
    echo "✅ Container está rodando"
    CONTAINER_ID=$(docker ps | grep maki_ia_app | awk '{print $1}')
    echo "   Container ID: $CONTAINER_ID"
else
    echo "❌ Container NÃO está rodando"
    exit 1
fi

echo ""
echo "2️⃣ Verificando arquivos dentro do container..."

# Verificar templates
echo "   Templates:"
docker exec maki_ia_app ls -la /app/templates/ 2>/dev/null || echo "   ❌ Erro ao listar templates"

# Verificar static/js
echo "   Static JS:"
docker exec maki_ia_app ls -la /app/static/js/ 2>/dev/null || echo "   ❌ Erro ao listar static/js"

# Verificar static/css
echo "   Static CSS:"
docker exec maki_ia_app ls -la /app/static/css/ 2>/dev/null || echo "   ❌ Erro ao listar static/css"

echo ""
echo "3️⃣ Testando endpoints HTTP..."

# Testar status
echo "   /api/status:"
STATUS=$(curl -s http://localhost/api/status 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ OK - $STATUS"
else
    echo "   ❌ Erro ao acessar"
fi

# Testar debug/files
echo "   /api/debug/files:"
FILES_DEBUG=$(curl -s http://localhost/api/debug/files 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ OK"
    echo "$FILES_DEBUG" | python3 -m json.tool 2>/dev/null || echo "$FILES_DEBUG"
else
    echo "   ❌ Erro ao acessar"
fi

# Testar /agent
echo "   /agent (verificando código de resposta):"
AGENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/agent 2>/dev/null)
echo "   Código HTTP: $AGENT_STATUS"
if [ "$AGENT_STATUS" = "200" ]; then
    echo "   ✅ Página carrega (200)"
else
    echo "   ❌ Página retorna $AGENT_STATUS"
    echo "   Resposta:"
    curl -s http://localhost/agent | head -20
fi

echo ""
echo "4️⃣ Verificando arquivos estáticos específicos..."

# Verificar agent.html
if docker exec maki_ia_app test -f /app/templates/agent.html 2>/dev/null; then
    SIZE=$(docker exec maki_ia_app stat -c%s /app/templates/agent.html 2>/dev/null)
    echo "   ✅ agent.html existe ($SIZE bytes)"
else
    echo "   ❌ agent.html NÃO existe"
fi

# Verificar agent.js
if docker exec maki_ia_app test -f /app/static/js/agent.js 2>/dev/null; then
    SIZE=$(docker exec maki_ia_app stat -c%s /app/static/js/agent.js 2>/dev/null)
    echo "   ✅ agent.js existe ($SIZE bytes)"
else
    echo "   ❌ agent.js NÃO existe"
fi

# Verificar agent.css
if docker exec maki_ia_app test -f /app/static/css/agent.css 2>/dev/null; then
    SIZE=$(docker exec maki_ia_app stat -c%s /app/static/css/agent.css 2>/dev/null)
    echo "   ✅ agent.css existe ($SIZE bytes)"
else
    echo "   ❌ agent.css NÃO existe"
fi

echo ""
echo "5️⃣ Verificando acesso aos arquivos estáticos via HTTP..."

# Testar CSS
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/static/css/agent.css 2>/dev/null)
echo "   /static/css/agent.css: $CSS_STATUS"

# Testar JS
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/static/js/agent.js 2>/dev/null)
echo "   /static/js/agent.js: $JS_STATUS"

echo ""
echo "6️⃣ Logs recentes do container:"
echo "   (últimas 30 linhas)"
docker logs --tail=30 maki_ia_app 2>&1 | grep -E "(agent|static|template|error|ERROR|Warning|WARNING)" || echo "   Nenhum log relevante encontrado"

echo ""
echo "======================================"
echo "✅ Diagnóstico concluído"
echo ""
echo "💡 Próximos passos:"
echo "   - Se arquivos não existem: execute ./deploy.sh novamente"
echo "   - Se arquivos existem mas HTTP retorna 404: problema com Flask/Gunicorn"
echo "   - Se página carrega mas não funciona: verifique console do navegador (F12)"

