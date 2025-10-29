# Utiliza uma imagem oficial do Python como base
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY requirements.txt ./

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta 5000 (ajuste se sua aplicação usar outra porta)
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["python", "app.py"]
