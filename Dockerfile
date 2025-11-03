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

# Copiar arquivos estáticos e templates explicitamente primeiro
COPY templates/ /app/templates/
COPY static/ /app/static/
COPY app.py /app/app.py

# Copiar outros arquivos necessários
COPY requirements.txt /app/requirements.txt

# Garantir que templates e static existam e tenham permissões corretas
RUN mkdir -p /app/templates /app/static/css /app/static/js /app/static/images && \
    chmod -R 755 /app/templates /app/static && \
    ls -la /app/static/js/ && \
    ls -la /app/static/css/ && \
    ls -la /app/templates/

# Cria um usuário não-root para segurança
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expõe a porta 5000
EXPOSE 5000

# Comando para iniciar a aplicação com Gunicorn (produção)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
