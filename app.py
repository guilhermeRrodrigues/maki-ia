from flask import Flask, render_template, request, jsonify, redirect, send_from_directory 
import os
import google.generativeai as genai
import json
from pathlib import Path

# Obter diretório base da aplicação
BASE_DIR = Path(__file__).resolve().parent

# Configurar Flask com caminhos explícitos para produção
app = Flask(
    __name__,
    template_folder=str(BASE_DIR / 'templates'),
    static_folder=str(BASE_DIR / 'static'),
    static_url_path='/static'
)

# Configurações
app.config['SECRET_KEY'] = 'maki-ia-secret-key-2024'

# Configurar API do Google Gemini
GEMINI_API_KEY = 'AIzaSyAw6TehD7zj-Hi3hPkpR-R6Rt7v9ILGK8A'

# Garantir que a chave está configurada
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print(f"✅ Chave de API Gemini configurada (últimos 4 dígitos: {GEMINI_API_KEY[-4:]})")
except Exception as e:
    print(f"❌ Erro ao configurar chave de API: {str(e)}")

# Configurar modelo Gemini (usando modelo válido com fallback)
model = None
try:
    # Garantir que a API está configurada antes de criar o modelo
    if not GEMINI_API_KEY:
        raise ValueError("Chave de API não configurada")
    
    genai.configure(api_key=GEMINI_API_KEY)  # Reconfigurar para garantir
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✅ Modelo Gemini 1.5 Flash configurado com sucesso")
except Exception as e:
    print(f"⚠️  Erro ao configurar gemini-1.5-flash: {str(e)}")
    try:
        genai.configure(api_key=GEMINI_API_KEY)  # Reconfigurar novamente
        model = genai.GenerativeModel('gemini-pro')
        print("✅ Modelo Gemini Pro configurado com sucesso")
    except Exception as e2:
        print(f"⚠️  Erro ao configurar gemini-pro: {str(e2)}")
        print("ℹ️  Usando fallback local para respostas")
        model = None

def get_maki_response(user_message):
    """Obter resposta da MAKI IA usando Google Gemini"""
    # Sempre garantir que a API está configurada
    try:
        genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e:
        app.logger.error(f"Erro ao configurar API key: {str(e)}")
        return get_local_maki_response(user_message)
    
    if model is None:
        # Tentar criar modelo novamente se não existir
        try:
            temp_model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""Você é MAKI IA, IA educacional desenvolvida por João Guilherme no SESI.

IDENTIDADE: MAKI IA | SESI | "Tecnologia que entende você" | Foco: educação e tecnologia acessível

PERSONALIDADE: Amigável, educadora, empática. Explica complexo de forma simples. Sempre encorajadora.

ESTILO: Português brasileiro natural. Conversacional. Adapte ao nível do usuário. Seja objetiva mas completa (máx 300 palavras). Use emojis com moderação. Evite jargões técnicos sem explicação.

FUNÇÕES ESPECIAIS:
- Se perguntar sobre código/programação: explique conceitos e forneça exemplos práticos quando relevante
- Se perguntar sobre educação: relacione com tecnologia e aprendizagem ativa
- Se perguntar sobre inovação: conecte criatividade + tecnologia
- Se saudação: seja calorosa mas breve

Pergunta: {user_message}

Responda como MAKI IA:"""
            response = temp_model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            app.logger.warning(f"Erro ao criar modelo temporário: {str(e)}")
            return get_local_maki_response(user_message)
    
    try:
        # Prompt otimizado e inteligente - mais conciso mas completo
        prompt = f"""Você é MAKI IA, IA educacional desenvolvida por João Guilherme no SESI.

IDENTIDADE: MAKI IA | SESI | "Tecnologia que entende você" | Foco: educação e tecnologia acessível

PERSONALIDADE: Amigável, educadora, empática. Explica complexo de forma simples. Sempre encorajadora.

ESTILO: Português brasileiro natural. Conversacional. Adapte ao nível do usuário. Seja objetiva mas completa (máx 300 palavras). Use emojis com moderação. Evite jargões técnicos sem explicação.

FUNÇÕES ESPECIAIS:
- Se perguntar sobre código/programação: explique conceitos e forneça exemplos práticos quando relevante
- Se perguntar sobre educação: relacione com tecnologia e aprendizagem ativa
- Se perguntar sobre inovação: conecte criatividade + tecnologia
- Se saudação: seja calorosa mas breve

Pergunta: {user_message}

Responda como MAKI IA:"""
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        app.logger.error(f"Erro na API Gemini: {str(e)}")
        # Tentar novamente com configuração diferente
        try:
            # Garantir que a API está configurada antes de tentar novamente
            genai.configure(api_key=GEMINI_API_KEY)
            model_retry = genai.GenerativeModel('gemini-1.5-flash')
            response = model_retry.generate_content(prompt)
            return response.text.strip()
        except Exception as e2:
            app.logger.error(f"Segunda tentativa falhou: {str(e2)}")
            # Fallback para respostas inteligentes locais
            return get_local_maki_response(user_message)

def get_local_maki_response(user_message):
    """Resposta local inteligente e contextual da MAKI IA como fallback"""
    message_lower = user_message.lower().strip()
    
    # Análise contextual inteligente
    is_question = '?' in user_message or any(word in message_lower for word in ['como', 'o que', 'qual', 'quando', 'onde', 'por que'])
    is_greeting = any(word in message_lower for word in ['olá', 'oi', 'hello', 'hi', 'boa tarde', 'boa noite', 'bom dia', 'tarde', 'noite', 'dia'])
    
    # Respostas contextuais melhoradas
    if is_greeting:
        return "Oi! 👋 Sou a MAKI IA do SESI, pronta para tornar tecnologia e educação mais acessíveis! Em que posso ajudar?"
    
    elif any(word in message_lower for word in ['inteligência artificial', 'ia', 'ai', 'artificial intelligence', 'machine learning', 'ml']):
        return "🤖 IA é como ensinar computadores a pensar e aprender! Ela reconhece padrões, resolve problemas e cria conteúdo. Uma ferramenta poderosa para educação. Quer saber mais sobre algum aspecto específico?"
    
    elif any(word in message_lower for word in ['programação', 'código', 'código', 'programar', 'dev', 'developer', 'python', 'javascript', 'java']):
        examples = {
            'python': 'Python é ótimo para iniciantes! Sintaxe simples e muito poderosa.',
            'javascript': 'JavaScript roda no navegador e permite criar sites interativos!',
            'java': 'Java é versátil, usado desde apps mobile até sistemas empresariais.'
        }
        lang = next((k for k in examples.keys() if k in message_lower), None)
        base = f"💻 Programação é criar soluções através de código! "
        return base + (examples[lang] if lang else "Qual linguagem te interessa? Posso ajudar a começar!")
    
    elif any(word in message_lower for word in ['tecnologia', 'tech', 'tecnológico']):
        return "🚀 Tecnologia democratiza conhecimento e cria inovação! No SESI, focamos em tornar tech acessível. Que área te interessa mais: programação, IA, web ou mobile?"
    
    elif any(word in message_lower for word in ['educação', 'estudar', 'aprender', 'escola', 'ensino']):
        return "📚 Educação + tecnologia = aprendizado transformador! A MAKI foi criada para apoiar estudantes, explicando conceitos complexos de forma simples. Sobre o que quer aprender?"
    
    elif any(word in message_lower for word in ['sesi', 'joão', 'desenvolvedor', 'criador', 'autor']):
        return "✨ Fui desenvolvida por João Guilherme no SESI para inovar em educação tecnológica! O SESI é um excelente ambiente para criar soluções educacionais impactantes."
    
    elif any(word in message_lower for word in ['criatividade', 'inovação', 'criar', 'ideia', 'projeto']):
        return "💡 Criatividade + tecnologia = soluções incríveis! A MAKI estimula pensamento criativo e ajuda a transformar ideias em realidade. Tem alguma ideia em mente?"
    
    elif any(word in message_lower for word in ['ajuda', 'help', 'suporte', 'como usar', 'funciona']):
        return "🆘 Posso ajudar com: tecnologia, programação, educação, inovação e mais! Faça perguntas específicas ou explore sugestões. Estou aqui para tornar o aprendizado acessível!"
    
    elif is_question:
        return f"🤔 Ótima pergunta sobre '{user_message[:50]}'! Como assistente educacional focada em tecnologia, posso ajudar. Que aspecto específico te interessa mais?"
    
    else:
        return f"💬 Interessante! Sobre '{user_message[:40]}'... Posso ajudar com tecnologia, programação, educação ou inovação. Faça uma pergunta ou explore um tópico!"

@app.route('/')
def index():
    """Redireciona para a página home"""
    return redirect('/home')

@app.route('/home')
def home():
    """Página principal de apresentação da MAKI IA"""
    return render_template('home.html')

@app.route('/agent')
def agent():
    """Página do modo agent - Interface estilo Claude IA"""
    try:
        # Verificar se o template existe antes de renderizar
        template_path = BASE_DIR / 'templates' / 'agent.html'
        if not template_path.exists():
            app.logger.error(f"Template não encontrado: {template_path}")
            app.logger.error(f"BASE_DIR: {BASE_DIR}")
            app.logger.error(f"Listando conteúdo de templates: {list((BASE_DIR / 'templates').iterdir()) if (BASE_DIR / 'templates').exists() else 'Diretório não existe'}")
            return f"Template agent.html não encontrado em {template_path}. Verifique os arquivos da aplicação.", 500
        
        # Verificar arquivos estáticos necessários
        required_static = {
            'js': BASE_DIR / 'static' / 'js' / 'agent.js',
            'css': BASE_DIR / 'static' / 'css' / 'agent.css'
        }
        
        missing_files = []
        for name, path in required_static.items():
            if not path.exists():
                missing_files.append(f"{name}: {path}")
                app.logger.error(f"Arquivo estático não encontrado: {path}")
        
        if missing_files:
            app.logger.warning(f"Arquivos estáticos faltando: {missing_files}")
            # Listar o que existe no diretório static
            if (BASE_DIR / 'static').exists():
                app.logger.info(f"Conteúdo de static/js: {list((BASE_DIR / 'static' / 'js').iterdir()) if (BASE_DIR / 'static' / 'js').exists() else 'Diretório não existe'}")
                app.logger.info(f"Conteúdo de static/css: {list((BASE_DIR / 'static' / 'css').iterdir()) if (BASE_DIR / 'static' / 'css').exists() else 'Diretório não existe'}")
        
        return render_template('agent.html')
    except Exception as e:
        import traceback
        app.logger.error(f"Erro ao renderizar template agent.html: {str(e)}")
        app.logger.error(f"Traceback: {traceback.format_exc()}")
        return f"Erro ao carregar página: {str(e)}", 500

@app.route('/api/info')
def api_info():
    """API endpoint com informações da MAKI IA"""
    return jsonify({
        'nome': 'MAKI IA',
        'desenvolvedor': 'João Guilherme',
        'instituicao': 'SESI',
        'slogan': 'Tecnologia que entende você',
        'palavras_chave': ['tecnologia', 'praticidade', 'aprendizado', 'futuro', 'criatividade', 'acessibilidade', 'empatia'],
        'personalidade': {
            'amigavel': True,
            'inteligente': True,
            'curiosa': True,
            'prestativa': True,
            'educadora': True
        },
        'cores': {
            'principal': '#1A237E',  # Azul escuro profundo
            'secundaria': '#2196F3',  # Azul vibrante
            'accent': '#E3F2FD'      # Azul claro
        }
    })

@app.route('/api/list-models')
def list_models():
    """Endpoint para listar modelos disponíveis"""
    try:
        models = list(genai.list_models())
        model_names = [model.name for model in models]
        return jsonify({
            'status': 'success',
            'models': model_names
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erro ao listar modelos: {str(e)}'
        })

@app.route('/api/test-gemini')
def test_gemini():
    """Endpoint para testar a API do Gemini"""
    try:
        # Garantir que a API está configurada
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Tentar usar o modelo existente ou criar um novo
        test_model = model
        if test_model is None:
            test_model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Teste simples
        test_prompt = "Responda apenas: 'API Gemini funcionando!'"
        response = test_model.generate_content(test_prompt)
        return jsonify({
            'status': 'success',
            'message': 'API Gemini funcionando!',
            'response': response.text.strip(),
            'api_key_configured': bool(GEMINI_API_KEY),
            'api_key_last_chars': GEMINI_API_KEY[-4:] if GEMINI_API_KEY else None
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erro na API Gemini: {str(e)}',
            'error_type': type(e).__name__,
            'api_key_configured': bool(GEMINI_API_KEY),
            'api_key_last_chars': GEMINI_API_KEY[-4:] if GEMINI_API_KEY else None
        })

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """Endpoint para chat com a MAKI IA"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        # Validar mensagem vazia
        if not user_message.strip():
            return jsonify({
                'error': 'Mensagem não pode estar vazia',
                'status': 'error'
            }), 400
        
        # Validar limite de 5000 caracteres
        if len(user_message) > 5000:
            return jsonify({
                'error': 'Mensagem muito longa. Por favor, limite sua mensagem a 5000 caracteres.',
                'status': 'error',
                'max_length': 5000,
                'current_length': len(user_message)
            }), 400
        
        # Obter resposta da MAKI IA
        maki_response = get_maki_response(user_message)
        
        return jsonify({
            'response': maki_response,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Erro interno: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/status')
def api_status():
    """Endpoint para verificar status da aplicação"""
    return jsonify({
        'status': 'online',
        'versao': '1.0.0',
        'mensagem': 'MAKI IA está funcionando perfeitamente!',
        'ai_enabled': True
    })

@app.route('/api/debug/files')
def debug_files():
    """Endpoint de diagnóstico para verificar arquivos em produção"""
    try:
        # Verificar tamanhos dos arquivos também
        agent_js_path = BASE_DIR / 'static' / 'js' / 'agent.js'
        agent_css_path = BASE_DIR / 'static' / 'css' / 'agent.css'
        
        files_status = {
            'base_dir': str(BASE_DIR),
            'templates': {
                'agent.html': {
                    'exists': (BASE_DIR / 'templates' / 'agent.html').exists(),
                    'path': str(BASE_DIR / 'templates' / 'agent.html')
                },
                'home.html': {
                    'exists': (BASE_DIR / 'templates' / 'home.html').exists(),
                    'path': str(BASE_DIR / 'templates' / 'home.html')
                },
            },
            'static': {
                'js/agent.js': {
                    'exists': agent_js_path.exists(),
                    'path': str(agent_js_path),
                    'size': agent_js_path.stat().st_size if agent_js_path.exists() else 0
                },
                'css/agent.css': {
                    'exists': agent_css_path.exists(),
                    'path': str(agent_css_path),
                    'size': agent_css_path.stat().st_size if agent_css_path.exists() else 0
                },
            },
            'flask_config': {
                'template_folder': app.template_folder,
                'static_folder': app.static_folder,
                'static_url_path': app.static_url_path
            }
        }
        return jsonify(files_status)
    except Exception as e:
        import traceback
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    # Criar diretórios necessários (usando Path para compatibilidade)
    (BASE_DIR / 'templates').mkdir(exist_ok=True)
    (BASE_DIR / 'static' / 'css').mkdir(parents=True, exist_ok=True)
    (BASE_DIR / 'static' / 'js').mkdir(parents=True, exist_ok=True)
    (BASE_DIR / 'static' / 'images').mkdir(parents=True, exist_ok=True)
    
    # Verificar se templates essenciais existem
    required_templates = ['home.html', 'agent.html']
    for template in required_templates:
        template_path = BASE_DIR / 'templates' / template
        if not template_path.exists():
            print(f"⚠️  AVISO: Template {template} não encontrado em {template_path}")
            app.logger.warning(f"Template {template} não encontrado")
    
    # Verificar arquivos estáticos
    required_static = {
        'agent.js': BASE_DIR / 'static' / 'js' / 'agent.js',
        'agent.css': BASE_DIR / 'static' / 'css' / 'agent.css'
    }
    for name, path in required_static.items():
        if not path.exists():
            print(f"⚠️  AVISO: Arquivo estático {name} não encontrado em {path}")
            app.logger.warning(f"Arquivo estático {name} não encontrado")
    
    # Configurações para produção
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    port = int(os.environ.get('PORT', 5000))
    
    print(f"🚀 Iniciando MAKI IA na porta {port}...")
    print(f"📁 Diretório base: {BASE_DIR}")
    print(f"📝 Modo debug: {debug_mode}")
    print(f"🔑 Chave de API Gemini: {'Configurada' if GEMINI_API_KEY else 'NÃO CONFIGURADA'} (últimos 4 dígitos: {GEMINI_API_KEY[-4:] if GEMINI_API_KEY else 'N/A'})")
    print(f"🤖 Modelo Gemini: {'Configurado' if model else 'Não disponível (usando fallback local)'}")
    print(f"📂 Templates: {BASE_DIR / 'templates'}")
    print(f"📂 Static: {BASE_DIR / 'static'}")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
