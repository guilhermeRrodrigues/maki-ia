#!/bin/bash

# Script para configurar servidor Ubuntu para usar porta 80 com Docker
# Execute com: sudo bash configure-port80.sh

echo "🔧 Configurando servidor para usar porta 80..."

# 1. Configurar sysctl para permitir portas não-privilegiadas
echo "📝 Configurando sysctl..."
echo 'net.ipv4.ip_unprivileged_port_start=80' >> /etc/sysctl.conf

# 2. Aplicar configuração
echo "⚡ Aplicando configuração..."
sysctl -p

# 3. Verificar se funcionou
echo "🔍 Verificando configuração..."
cat /proc/sys/net/ipv4/ip_unprivileged_port_start

# 4. Parar serviços que podem estar usando porta 80
echo "🛑 Parando serviços que podem usar porta 80..."
systemctl stop apache2 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true
systemctl disable nginx 2>/dev/null || true

# 5. Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 80/tcp
ufw allow 8080/tcp

echo "✅ Configuração concluída!"
echo "🚀 Agora você pode usar porta 80 ou 8080"
echo "📋 URLs disponíveis:"
echo "   - http://batatajg.shop:8080"
echo "   - http://45.70.136.66:8080"
echo ""
echo "💡 Para usar porta 80, altere docker-compose.yml para '80:5000'"
