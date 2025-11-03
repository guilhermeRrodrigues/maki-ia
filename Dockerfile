# Utiliza uma imagem oficial do Python como base
FROM python:3.11-slim

# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY requirements.txt ./

# Instala as dependências
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copiar TODOS os arquivos primeiro (como root)
COPY . .

# Verificar se os arquivos foram copiados corretamente
RUN echo "=== Verificando arquivos copiados ===" && \
    ls -la /app/ && \
    echo "=== Templates ===" && \
    ls -la /app/templates/ && \
    echo "=== Static ===" && \
    ls -la /app/static/ && \
    echo "=== Static/JS ===" && \
    ls -la /app/static/js/ 2>/dev/null || echo "Diretório js não existe" && \
    echo "=== Static/CSS ===" && \
    ls -la /app/static/css/ 2>/dev/null || echo "Diretório css não existe" && \
    echo "=== Verificando arquivos específicos ===" && \
    test -f /app/templates/agent.html && echo "✅ agent.html existe" || echo "❌ agent.html NÃO existe" && \
    test -f /app/static/js/agent.js && echo "✅ agent.js existe" || echo "❌ agent.js NÃO existe" && \
    test -f /app/static/css/agent.css && echo "✅ agent.css existe" || echo "❌ agent.css NÃO existe"

# Garantir permissões corretas
RUN chmod -R 755 /app/templates /app/static

# Cria um usuário não-root para segurança
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# Verificar permissões antes de mudar de usuário
RUN ls -la /app/ | head -10

# Criar script de inicialização ANTES de mudar de usuário (como root)
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "🚀 Iniciando MAKI IA..."' >> /app/start.sh && \
    echo 'echo "📁 Diretório: $(pwd)"' >> /app/start.sh && \
    echo 'echo "📂 Verificando arquivos:"' >> /app/start.sh && \
    echo 'test -f /app/app.py && echo "✅ app.py existe" || echo "❌ app.py NÃO existe"' >> /app/start.sh && \
    echo 'test -f /app/templates/agent.html && echo "✅ agent.html existe" || echo "❌ agent.html NÃO existe"' >> /app/start.sh && \
    echo 'test -f /app/static/js/agent.js && echo "✅ agent.js existe" || echo "❌ agent.js NÃO existe"' >> /app/start.sh && \
    echo 'test -f /app/static/css/agent.css && echo "✅ agent.css existe" || echo "❌ agent.css NÃO existe"' >> /app/start.sh && \
    echo 'echo "🔧 Iniciando Gunicorn..."' >> /app/start.sh && \
    echo 'exec gunicorn --bind 0.0.0.0:5000 --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile - --log-level info app:app' >> /app/start.sh && \
    chmod +x /app/start.sh

# Mudar para usuário não-root
USER appuser

# Verificar novamente após mudar de usuário
RUN test -f /app/templates/agent.html && echo "✅ agent.html acessível" || echo "❌ agent.html NÃO acessível" && \
    test -f /app/static/js/agent.js && echo "✅ agent.js acessível" || echo "❌ agent.js NÃO acessível" && \
    test -f /app/static/css/agent.css && echo "✅ agent.css acessível" || echo "❌ agent.css NÃO acessível"

# Expõe a porta 5000
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["/bin/bash", "/app/start.sh"]
