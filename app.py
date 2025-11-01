from flask import Flask, render_template, request, jsonify, redirect
import os
import google.generativeai as genai
import json

app = Flask(__name__)

# Configurações
app.config['SECRET_KEY'] = 'maki-ia-secret-key-2024'

# Configurar API do Google Gemini
GEMINI_API_KEY = 'AIzaSyAw6TehD7zj-Hi3hPkpR-R6Rt7v9ILGK8A'
genai.configure(api_key=GEMINI_API_KEY)

# Configurar modelo Gemini
model = genai.GenerativeModel('gemini-2.5-flash')

def get_maki_response(user_message):
    """Obter resposta da MAKI IA usando Google Gemini"""
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
        print(f"Erro na API Gemini: {str(e)}")
        # Tentar novamente com configuração diferente
        try:
            # Configurar novamente a API
            genai.configure(api_key=GEMINI_API_KEY)
            model_retry = genai.GenerativeModel('gemini-1.5-flash')
            response = model_retry.generate_content(prompt)
            return response.text.strip()
        except Exception as e2:
            print(f"Segunda tentativa falhou: {str(e2)}")
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
    return render_template('agent.html')

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
        # Teste simples
        test_prompt = "Responda apenas: 'API Gemini funcionando!'"
        response = model.generate_content(test_prompt)
        return jsonify({
            'status': 'success',
            'message': 'API Gemini funcionando!',
            'response': response.text.strip()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erro na API Gemini: {str(e)}',
            'error_type': type(e).__name__
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

if __name__ == '__main__':
    # Criar diretórios necessários
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/images', exist_ok=True)
    
    # Configurações para produção
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    port = int(os.environ.get('PORT', 5000))
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
