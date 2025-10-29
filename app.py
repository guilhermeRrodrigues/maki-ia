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
        # Prompt personalizado para a MAKI IA
        prompt = f"""Você é MAKI IA, uma inteligência artificial criada por João Guilherme no SESI.

Sua personalidade:
- Amigável, inteligente e curiosa
- Educadora que explica conceitos de forma simples
- Focada em tecnologia, aprendizado e criatividade
- Slogan: "Tecnologia que entende você"

Responda de forma natural e educativa. Seja útil e explique conceitos de tecnologia de maneira acessível.

Pergunta: {user_message}

Resposta da MAKI IA:"""
        
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
    """Resposta local inteligente da MAKI IA como fallback"""
    message_lower = user_message.lower()
    
    # Respostas inteligentes baseadas em palavras-chave
    if any(word in message_lower for word in ['olá', 'oi', 'hello', 'hi', 'boa tarde', 'boa noite', 'bom dia']):
        return "Oi! É um prazer conhecê-lo! Eu sou a MAKI IA, desenvolvida no SESI para tornar a tecnologia mais acessível e educativa. Como posso ajudar você hoje?"
    
    elif any(word in message_lower for word in ['inteligência artificial', 'ia', 'ai', 'artificial intelligence']):
        return "Inteligência Artificial é uma tecnologia fascinante! É como ensinar computadores a pensar e aprender, similar ao que nós humanos fazemos. A IA pode reconhecer padrões, resolver problemas complexos e até mesmo criar conteúdo. É uma ferramenta poderosa para educação e inovação!"
    
    elif any(word in message_lower for word in ['tecnologia', 'tech', 'programação', 'código']):
        return "A tecnologia é incrível! Ela nos permite criar soluções inovadoras e tornar o aprendizado mais interativo. No SESI, trabalhamos para democratizar o acesso à tecnologia, tornando-a prática e acessível para todos. Que área da tecnologia mais te interessa?"
    
    elif any(word in message_lower for word in ['aprender', 'estudar', 'educação', 'escola']):
        return "O aprendizado é uma jornada maravilhosa! A tecnologia pode tornar a educação mais dinâmica e personalizada. A MAKI IA foi criada especificamente para apoiar estudantes e educadores, explicando conceitos complexos de forma simples e prática."
    
    elif any(word in message_lower for word in ['sesi', 'joão', 'desenvolvedor']):
        return "Fui desenvolvida por João Guilherme no SESI com o objetivo de trazer inovação educacional e tecnológica. O SESI é um ambiente fantástico para desenvolver soluções que realmente fazem a diferença na educação!"
    
    elif any(word in message_lower for word in ['criatividade', 'inovação', 'criar']):
        return "A criatividade é o coração da inovação! Combinar tecnologia com criatividade nos permite criar soluções únicas e impactantes. A MAKI IA foi projetada para estimular o pensamento criativo e ajudar a transformar ideias em realidade."
    
    elif any(word in message_lower for word in ['ajuda', 'help', 'suporte']):
        return "Estou aqui para ajudar! Posso explicar conceitos de tecnologia, responder perguntas sobre programação, discutir inovação educacional, ou simplesmente conversar sobre qualquer tópico que você queira explorar. O que gostaria de saber?"
    
    else:
        return f"Oi! Interessante pergunta sobre '{user_message}'! Como assistente educacional focada em tecnologia, posso ajudar você a entender melhor esse tópico. Poderia me dar mais detalhes sobre o que especificamente gostaria de saber? Estou aqui para tornar o aprendizado mais acessível e prático!"

@app.route('/')
def index():
    """Redireciona para a página home"""
    return redirect('/home')

@app.route('/home')
def home():
    """Página principal de apresentação da MAKI IA"""
    return render_template('home.html')

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
        
        if not user_message.strip():
            return jsonify({
                'error': 'Mensagem não pode estar vazia'
            }), 400
        
        # Obter resposta da MAKI IA
        maki_response = get_maki_response(user_message)
        
        return jsonify({
            'response': maki_response,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Erro interno: {str(e)}'
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
    
    app.run(debug=True, host='0.0.0.0', port=5000)
