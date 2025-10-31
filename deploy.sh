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

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose estão instalados${NC}"

# Parar containers existentes (se houver)
echo -e "${YELLOW}📦 Parando containers existentes...${NC}"
docker-compose down 2>/dev/null || true

# Remover imagens antigas (opcional - descomente se quiser)
# echo -e "${YELLOW}🗑️  Removendo imagens antigas...${NC}"
# docker rmi maki-ia_app:latest 2>/dev/null || true

# Construir a nova imagem
echo -e "${YELLOW}🔨 Construindo a imagem Docker...${NC}"
docker-compose build --no-cache

# Iniciar os containers
echo -e "${YELLOW}🚀 Iniciando os containers...${NC}"
docker-compose up -d

# Aguardar alguns segundos para o container iniciar
echo -e "${YELLOW}⏳ Aguardando o container iniciar...${NC}"
sleep 5

# Verificar se o container está rodando
if docker ps | grep -q maki_ia_app; then
    echo -e "${GREEN}✅ Container está rodando!${NC}"
    
    # Mostrar logs iniciais
    echo -e "${YELLOW}📋 Logs iniciais:${NC}"
    docker-compose logs --tail=20
    
    # Testar a aplicação
    echo -e "${YELLOW}🧪 Testando aplicação...${NC}"
    sleep 3
    
    if curl -f http://localhost/api/status &> /dev/null; then
        echo -e "${GREEN}✅ Aplicação está respondendo corretamente!${NC}"
    else
        echo -e "${YELLOW}⚠️  A aplicação pode estar iniciando ainda. Verifique os logs com: docker-compose logs${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
    echo -e "${GREEN}📱 Acesse a aplicação em: http://45.70.136.66${NC}"
    echo ""
    echo "Comandos úteis:"
    echo "  - Ver logs: docker-compose logs -f"
    echo "  - Parar: docker-compose down"
    echo "  - Reiniciar: docker-compose restart"
    echo "  - Status: docker-compose ps"
    
else
    echo -e "${RED}❌ Erro: Container não está rodando. Verifique os logs:${NC}"
    docker-compose logs
    exit 1
fi

