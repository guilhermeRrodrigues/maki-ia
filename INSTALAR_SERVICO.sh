#!/bin/bash

# Script para instalar o serviço systemd da MAKI IA
# Use este script se precisar reinstalar ou configurar o serviço manualmente

set -e

echo "🔧 Instalando serviço systemd para MAKI IA..."

# Verificar se está executando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Por favor, execute com sudo: sudo ./INSTALAR_SERVICO.sh"
    exit 1
fi

# Obter diretório atual
CURRENT_DIR=$(pwd)
SERVICE_FILE="maki-ia.service"

if [ ! -f "$SERVICE_FILE" ]; then
    echo "❌ Arquivo $SERVICE_FILE não encontrado no diretório atual!"
    exit 1
fi

# Copiar arquivo de serviço
echo "📋 Copiando arquivo de serviço..."
cp "$SERVICE_FILE" /etc/systemd/system/maki-ia.service

# Ajustar WorkingDirectory no arquivo de serviço
sed -i "s|WorkingDirectory=/opt/maki-ia|WorkingDirectory=$CURRENT_DIR|g" /etc/systemd/system/maki-ia.service

# Recarregar systemd
echo "🔄 Recarregando systemd..."
systemctl daemon-reload

# Habilitar serviço para iniciar no boot
echo "✅ Habilitando serviço para iniciar automaticamente..."
systemctl enable maki-ia.service

# Iniciar o serviço
echo "🚀 Iniciando serviço..."
systemctl start maki-ia.service

# Verificar status
echo ""
echo "📊 Status do serviço:"
systemctl status maki-ia.service --no-pager

echo ""
echo "✅ Serviço instalado e iniciado com sucesso!"
echo ""
echo "Comandos úteis:"
echo "  - Ver status: sudo systemctl status maki-ia"
echo "  - Ver logs: sudo journalctl -u maki-ia -f"
echo "  - Reiniciar: sudo systemctl restart maki-ia"
echo "  - Parar: sudo systemctl stop maki-ia"
echo "  - Desabilitar: sudo systemctl disable maki-ia"

