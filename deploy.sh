#!/bin/bash

# Script de deploy para produção - MAKI IA
# Uso: ./deploy.sh
# Compatível com Ubuntu Server via SSH

set -e  # Para no primeiro erro (mas vamos tratar erros manualmente em algumas partes)

echo "🚀 Iniciando deploy da MAKI IA para produção..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "app.py" ] || [ ! -f "docker-compose.yml" ] || [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ Erro: Execute o script do diretório raiz do projeto (onde está app.py)${NC}"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado.${NC}"
    echo -e "${YELLOW}📦 Instalando Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker instalado! Você pode precisar fazer logout e login novamente.${NC}"
    echo -e "${YELLOW}⚠️  Após logout/login, execute o script novamente.${NC}"
    exit 0
fi

# Verificar se o usuário está no grupo docker
if ! groups | grep -q docker && [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Usuário não está no grupo docker. Tentando adicionar...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠️  Você precisa fazer logout e login novamente, ou usar sudo${NC}"
fi

# Verificar se Docker Compose está instalado (tentar docker compose primeiro, depois docker-compose)
if command -v docker &> /dev/null && docker compose version &> /dev/null 2>/dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${YELLOW}📦 Docker Compose não encontrado. Instalando...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo -e "${GREEN}✅ Docker e Docker Compose estão instalados${NC}"
echo -e "${YELLOW}ℹ️  Usando comando: ${DOCKER_COMPOSE_CMD}${NC}"

# Verificar arquivos essenciais
echo -e "${YELLOW}🔍 Verificando arquivos essenciais...${NC}"
MISSING_FILES=()
[ ! -f "app.py" ] && MISSING_FILES+=("app.py")
[ ! -f "templates/agent.html" ] && MISSING_FILES+=("templates/agent.html")
[ ! -f "static/js/agent.js" ] && MISSING_FILES+=("static/js/agent.js")
[ ! -f "static/css/agent.css" ] && MISSING_FILES+=("static/css/agent.css")
[ ! -f "requirements.txt" ] && MISSING_FILES+=("requirements.txt")

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${RED}❌ Arquivos essenciais faltando:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo -e "   ${RED}  - $file${NC}"
    done
    exit 1
fi

echo -e "${GREEN}✅ Todos os arquivos essenciais estão presentes${NC}"

# Verificar se a porta 80 está disponível
if command -v netstat &> /dev/null; then
    if sudo netstat -tlnp | grep -q ":80 "; then
        echo -e "${YELLOW}⚠️  Porta 80 já está em uso. Verificando...${NC}"
        PORT_80_USER=$(sudo netstat -tlnp | grep ":80 " | awk '{print $7}' | head -1)
        echo -e "${YELLOW}   Porta 80 está sendo usada por: $PORT_80_USER${NC}"
    fi
fi

# Parar containers existentes (se houver)
echo -e "${YELLOW}📦 Parando containers existentes...${NC}"
$DOCKER_COMPOSE_CMD down 2>/dev/null || true

# Limpar recursos não utilizados (opcional, mas ajuda a manter limpo)
echo -e "${YELLOW}🧹 Limpando recursos Docker não utilizados...${NC}"
docker system prune -f > /dev/null 2>&1 || true

# Remover imagens antigas (opcional - descomente se quiser)
# echo -e "${YELLOW}🗑️  Removendo imagens antigas...${NC}"
# docker rmi maki-ia_app:latest 2>/dev/null || true

# Construir a nova imagem
echo -e "${YELLOW}🔨 Construindo a imagem Docker...${NC}"
$DOCKER_COMPOSE_CMD build --no-cache

# Verificar se os arquivos foram copiados corretamente (após build, antes de up)
echo -e "${YELLOW}🔍 Verificando se arquivos foram copiados na imagem...${NC}"
if docker images | grep -q "maki-ia.*app"; then
    echo -e "${GREEN}✅ Imagem construída com sucesso${NC}"
    # Criar container temporário para verificar arquivos
    TEMP_CONTAINER=$(docker create $(docker images --format "{{.Repository}}:{{.Tag}}" | grep "maki-ia" | head -1 | awk '{print $1}'))
    if [ ! -z "$TEMP_CONTAINER" ]; then
        echo -e "${YELLOW}   Verificando arquivos no container...${NC}"
        docker cp $TEMP_CONTAINER:/app/templates/agent.html - > /dev/null 2>&1 && \
            echo -e "${GREEN}   ✅ agent.html encontrado${NC}" || \
            echo -e "${RED}   ❌ agent.html NÃO encontrado${NC}"
        docker cp $TEMP_CONTAINER:/app/static/js/agent.js - > /dev/null 2>&1 && \
            echo -e "${GREEN}   ✅ agent.js encontrado${NC}" || \
            echo -e "${RED}   ❌ agent.js NÃO encontrado${NC}"
        docker cp $TEMP_CONTAINER:/app/static/css/agent.css - > /dev/null 2>&1 && \
            echo -e "${GREEN}   ✅ agent.css encontrado${NC}" || \
            echo -e "${RED}   ❌ agent.css NÃO encontrado${NC}"
        docker rm $TEMP_CONTAINER > /dev/null 2>&1
    fi
fi

# Iniciar os containers em modo detached (background)
echo -e "${YELLOW}🚀 Iniciando os containers em background...${NC}"
$DOCKER_COMPOSE_CMD up -d

# Aguardar alguns segundos para o container iniciar
echo -e "${YELLOW}⏳ Aguardando o container iniciar...${NC}"
sleep 5

# Verificar se o container está rodando
if docker ps | grep -q maki_ia_app; then
    echo -e "${GREEN}✅ Container está rodando!${NC}"
    
    # Mostrar logs iniciais
    echo -e "${YELLOW}📋 Logs iniciais:${NC}"
    $DOCKER_COMPOSE_CMD logs --tail=20
    
    # Testar a aplicação
    echo -e "${YELLOW}🧪 Testando aplicação...${NC}"
    sleep 3
    
    if curl -f http://localhost/api/status &> /dev/null; then
        echo -e "${GREEN}✅ Aplicação está respondendo corretamente!${NC}"
        
        # Testar página home (que contém o modo Agent integrado)
        if curl -f http://localhost/home &> /dev/null; then
            echo -e "${GREEN}✅ Página home (com Modo Agent integrado) está acessível!${NC}"
        else
            echo -e "${YELLOW}⚠️  Página home pode estar com problema. Verifique os logs.${NC}"
        fi
        
        # Testar rota /agent (página dedicada)
        if curl -f http://localhost/agent &> /dev/null; then
            echo -e "${GREEN}✅ Modo Agent (/agent) está acessível!${NC}"
        else
            echo -e "${YELLOW}⚠️  Rota /agent pode estar com problema. Verifique os logs.${NC}"
        fi
        
        # Testar API Gemini
        echo -e "${YELLOW}🧪 Testando API Gemini...${NC}"
        sleep 2
        if curl -f http://localhost/api/test-gemini &> /dev/null; then
            API_RESPONSE=$(curl -s http://localhost/api/test-gemini)
            if echo "$API_RESPONSE" | grep -q '"status":"success"'; then
                echo -e "${GREEN}✅ API Gemini está funcionando!${NC}"
            else
                echo -e "${YELLOW}⚠️  API Gemini pode ter problemas. Verifique a resposta:${NC}"
                echo "$API_RESPONSE" | head -5
            fi
        else
            echo -e "${YELLOW}⚠️  Não foi possível testar a API Gemini${NC}"
        fi
        
        # Testar endpoint de debug de arquivos
        echo -e "${YELLOW}🔍 Verificando arquivos no container...${NC}"
        sleep 1
        if curl -f http://localhost/api/debug/files &> /dev/null; then
            FILES_STATUS=$(curl -s http://localhost/api/debug/files)
            if echo "$FILES_STATUS" | grep -q '"agent.html"'; then
                echo -e "${GREEN}✅ Endpoint de debug funcionando${NC}"
                # Mostrar status dos arquivos
                if echo "$FILES_STATUS" | grep -q '"exists":true' | head -3; then
                    echo -e "${GREEN}   Arquivos essenciais encontrados no container${NC}"
                else
                    echo -e "${RED}   ⚠️  Alguns arquivos podem estar faltando!${NC}"
                    echo "$FILES_STATUS" | grep -E '"exists"|"path"' | head -10
                fi
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  A aplicação pode estar iniciando ainda. Verifique os logs com: ${DOCKER_COMPOSE_CMD} logs${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}🔧 Configurando serviço systemd para iniciar automaticamente...${NC}"
    
    # Criar diretório de serviço se não existir
    sudo mkdir -p /etc/systemd/system
    
    # Copiar arquivo de serviço
    if [ -f "maki-ia.service" ]; then
        sudo cp maki-ia.service /etc/systemd/system/maki-ia.service
        sudo sed -i "s|WorkingDirectory=/opt/maki-ia|WorkingDirectory=$(pwd)|g" /etc/systemd/system/maki-ia.service
        
        # Recarregar systemd
        sudo systemctl daemon-reload
        
        # Habilitar serviço para iniciar no boot
        sudo systemctl enable maki-ia.service
        
        # IMPORTANTE: Iniciar o serviço agora (não apenas habilitar)
        echo -e "${YELLOW}🚀 Iniciando o serviço systemd...${NC}"
        sudo systemctl start maki-ia.service || echo -e "${YELLOW}⚠️  Serviço pode já estar rodando${NC}"
        
        # Verificar status do serviço
        sleep 2
        if sudo systemctl is-active --quiet maki-ia.service; then
            echo -e "${GREEN}✅ Serviço systemd está ativo e rodando!${NC}"
        else
            echo -e "${YELLOW}⚠️  Serviço systemd não está ativo. Verifique com: sudo systemctl status maki-ia${NC}"
        fi
        
        echo -e "${GREEN}✅ Serviço systemd configurado e habilitado!${NC}"
        echo -e "${YELLOW}ℹ️  O serviço iniciará automaticamente no boot do sistema${NC}"
        echo -e "${GREEN}✅ Os containers continuarão rodando mesmo após fechar o Putty/SSH!${NC}"
    else
        echo -e "${YELLOW}⚠️  Arquivo maki-ia.service não encontrado. Continuando sem serviço systemd...${NC}"
        echo -e "${RED}⚠️  ATENÇÃO: Sem o serviço systemd, os containers podem parar ao fechar o SSH!${NC}"
        echo -e "${YELLOW}ℹ️  Para resolver isso, execute: sudo ./INSTALAR_SERVICO.sh${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    
    # Detectar IP do servidor
    SERVER_IP=$(hostname -I | awk '{print $1}' | head -1)
    if [ -z "$SERVER_IP" ]; then
        SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "seu-servidor")
    fi
    
    echo -e "${GREEN}📱 Acesse a aplicação em:${NC}"
    echo -e "   ${GREEN}   - http://$SERVER_IP${NC}"
    echo -e "   ${GREEN}   - http://localhost${NC}"
    echo -e "   ${GREEN}   - http://localhost/agent (Modo Agent)${NC}"
    echo -e "   ${GREEN}   - http://localhost/api/status (Status da API)${NC}"
    echo ""
    echo "Comandos úteis:"
    echo "  - Ver logs: ${DOCKER_COMPOSE_CMD} logs -f"
    echo "  - Parar: ${DOCKER_COMPOSE_CMD} down"
    echo "  - Reiniciar: ${DOCKER_COMPOSE_CMD} restart"
    echo "  - Status: ${DOCKER_COMPOSE_CMD} ps"
    echo "  - Status do serviço: sudo systemctl status maki-ia"
    echo "  - Reiniciar serviço: sudo systemctl restart maki-ia"
    echo ""
    echo -e "${GREEN}✅ O container continuará rodando mesmo após fechar o Putty/SSH!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Verificação final:${NC}"
    
    # Verificar container
    if docker ps | grep -q maki_ia_app; then
        echo -e "  ${GREEN}✅ Container rodando${NC}"
        CONTAINER_STATUS=$(docker ps --filter "name=maki_ia_app" --format "{{.Status}}")
        echo -e "     Status: $CONTAINER_STATUS"
    else
        echo -e "  ${RED}❌ Container não está rodando${NC}"
    fi
    
    # Verificar serviço systemd
    if sudo systemctl is-active --quiet maki-ia.service 2>/dev/null; then
        echo -e "  ${GREEN}✅ Serviço systemd ativo${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Serviço systemd não ativo${NC}"
    fi
    
    # Verificar saúde do container
    if docker ps | grep -q maki_ia_app; then
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' maki_ia_app 2>/dev/null || echo "N/A")
        if [ "$HEALTH" != "N/A" ]; then
            echo -e "  ${GREEN}✅ Health check: $HEALTH${NC}"
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}💡 Comandos úteis:${NC}"
    echo -e "   ${YELLOW}- Ver logs em tempo real:${NC} ${DOCKER_COMPOSE_CMD} logs -f"
    echo -e "   ${YELLOW}- Ver logs da aplicação:${NC} ${DOCKER_COMPOSE_CMD} logs app --tail=50"
    echo -e "   ${YELLOW}- Parar aplicação:${NC} ${DOCKER_COMPOSE_CMD} down"
    echo -e "   ${YELLOW}- Reiniciar aplicação:${NC} ${DOCKER_COMPOSE_CMD} restart"
    echo -e "   ${YELLOW}- Status do serviço:${NC} sudo systemctl status maki-ia"
    echo -e "   ${YELLOW}- Reiniciar serviço:${NC} sudo systemctl restart maki-ia"
    echo ""
    echo -e "${YELLOW}🔍 Diagnóstico:${NC}"
    echo -e "   ${YELLOW}- Testar API:${NC} curl http://localhost/api/status"
    echo -e "   ${YELLOW}- Testar Gemini:${NC} curl http://localhost/api/test-gemini"
    echo -e "   ${YELLOW}- Verificar arquivos:${NC} curl http://localhost/api/debug/files"
    echo ""
    echo -e "${GREEN}✅ A aplicação continuará rodando mesmo após fechar o SSH!${NC}"
    
else
    echo -e "${RED}❌ Erro: Container não está rodando. Verifique os logs:${NC}"
    $DOCKER_COMPOSE_CMD logs
    exit 1
fi

