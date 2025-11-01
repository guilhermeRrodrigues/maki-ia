#!/bin/bash

# Script de deploy para produção - MAKI IA
# Uso: ./deploy.sh

set -e  # Para no primeiro erro

echo "🚀 Iniciando deploy da MAKI IA para produção..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Verificar se Docker Compose está instalado (tentar docker compose primeiro, depois docker-compose)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose estão instalados${NC}"
echo -e "${YELLOW}ℹ️  Usando comando: ${DOCKER_COMPOSE_CMD}${NC}"

# Parar containers existentes (se houver)
echo -e "${YELLOW}📦 Parando containers existentes...${NC}"
$DOCKER_COMPOSE_CMD down 2>/dev/null || true

# Remover imagens antigas (opcional - descomente se quiser)
# echo -e "${YELLOW}🗑️  Removendo imagens antigas...${NC}"
# docker rmi maki-ia_app:latest 2>/dev/null || true

# Construir a nova imagem
echo -e "${YELLOW}🔨 Construindo a imagem Docker...${NC}"
$DOCKER_COMPOSE_CMD build --no-cache

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
        
        # Testar rota /agent
        if curl -f http://localhost/agent &> /dev/null; then
            echo -e "${GREEN}✅ Modo Agent (/agent) está acessível!${NC}"
        else
            echo -e "${YELLOW}⚠️  Rota /agent pode estar com problema. Verifique os logs.${NC}"
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
    echo -e "${GREEN}📱 Acesse a aplicação em: http://45.70.136.66${NC}"
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
    echo -e "  - Container rodando: $(docker ps | grep -q maki_ia_app && echo '✅ Sim' || echo '❌ Não')"
    echo -e "  - Serviço systemd: $(sudo systemctl is-active --quiet maki-ia.service && echo '✅ Ativo' || echo '⚠️  Não ativo')"
    echo ""
    echo -e "${YELLOW}💡 Dica: Se os containers pararem ao fechar o SSH, execute:${NC}"
    echo -e "   sudo systemctl start maki-ia"
    
else
    echo -e "${RED}❌ Erro: Container não está rodando. Verifique os logs:${NC}"
    $DOCKER_COMPOSE_CMD logs
    exit 1
fi

