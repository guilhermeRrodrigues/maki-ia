# MAKI IA - Site de Apresentação

## 🧠 Sobre a MAKI IA

A MAKI IA é uma inteligência artificial desenvolvida por João Guilherme no SESI, com o objetivo de trazer tecnologia de forma acessível, prática e intuitiva. Combinando design moderno, simpatia e eficiência.

**Slogan:** "Tecnologia que entende você"

## 🎯 Características

- **Amigável e inteligente:** Interface clara e próxima, sem arrogância técnica
- **Curiosa e prestativa:** Sempre busca aprender e ajudar mais
- **Educadora:** Explica conceitos de IA de maneira compreensível
- **Design futurista minimalista:** Cores preto grafite, azul ciano e branco metálico

## 🚀 Como Executar

### Opção 1: Execução Direta (Recomendado para desenvolvimento)

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python3 app.py
```

A aplicação estará disponível em: `http://localhost:5000/home`

### Opção 2: Usando Docker Compose

```bash
# Construir e executar com Docker Compose
docker-compose up --build

# Ou executar em background
docker-compose up -d --build
```

## 📁 Estrutura do Projeto

```
maki-ia/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── docker-compose.yml     # Configuração Docker Compose
├── Dockerfile            # Imagem Docker
├── templates/
│   └── home.html         # Template da página principal
└── static/
    ├── css/
    │   └── style.css     # Estilos CSS da MAKI IA
    ├── js/
    │   └── main.js       # JavaScript interativo
    └── images/           # Imagens e assets
```

## 🌐 Rotas Disponíveis

- `/` - Redireciona para `/home`
- `/home` - Página principal de apresentação da MAKI IA
- `/api/status` - Status da aplicação
- `/api/info` - Informações sobre a MAKI IA
- `/api/chat` - **NOVA!** Chat interativo com IA real da MAKI

## 🎨 Design System

### Cores
- **Principal:** #1A237E (Azul escuro profundo)
- **Secundária:** #2196F3 (Azul vibrante)
- **Accent:** #E3F2FD (Azul claro)

### Tipografia
- **Fonte:** Inter (Google Fonts)
- **Estilo:** Limpo, moderno, com formas arredondadas

### Elementos Visuais
- Circuitos sutis
- Formas esféricas
- Luzes suaves
- Animações fluidas

## 🔧 Tecnologias Utilizadas

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, JavaScript
- **IA:** Google Gemini API (com fallback inteligente local)
- **Containerização:** Docker & Docker Compose
- **Fontes:** Google Fonts (Inter)

## 🤖 Funcionalidade de IA Real

A MAKI IA agora possui integração com IA real através da API do Google Gemini:

### Características da IA:
- **Respostas Inteligentes:** Usa Google Gemini API para respostas contextualizadas
- **Fallback Local:** Sistema inteligente local como backup
- **Personalidade MAKI:** Respostas educativas e amigáveis
- **Foco Educacional:** Especializada em tecnologia e aprendizado

### Como Usar:
1. Acesse a página principal (`/home`)
2. Clique em "Ver Demonstração"
3. Digite sua pergunta no chat
4. Receba respostas inteligentes da MAKI IA

### Exemplos de Perguntas:
- "O que é inteligência artificial?"
- "Como funciona a programação?"
- "Explique sobre tecnologia educacional"
- "Conte sobre o SESI"

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🤝 Contribuição

Desenvolvido por João Guilherme no SESI para inovação educacional e tecnológica.

## 📄 Licença

© 2025 MAKI IA. Todos os direitos reservados.