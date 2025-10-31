// JavaScript para interatividade da MAKI IA

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .recurso-card, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Verificar status da API
    checkAPIStatus();

    // Adicionar efeitos de hover nos cards
    addHoverEffects();
});

// Função para scroll suave
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Função para mostrar demonstração
function showDemo() {
    // Criar modal de demonstração
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-info">
                    <div class="maki-avatar">
                        <div class="avatar-circle">🧠</div>
                        <div class="status-indicator">
                            <div class="status-dot"></div>
                            <span>MAKI IA Online</span>
                        </div>
                    </div>
                    <div class="header-text">
                        <h3>Chat com MAKI IA</h3>
                        <p>Inteligência Artificial Real • SESI</p>
                    </div>
                </div>
                <button class="close-btn" onclick="closeDemo()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="demo-chat" id="demoChat">
                    <div class="welcome-message">
                        <div class="welcome-icon">✨</div>
                        <div class="welcome-text">
                            <h4>Bem-vindo à MAKI IA!</h4>
                            <p>Uma inteligência artificial real desenvolvida no SESI. Faça qualquer pergunta sobre tecnologia, aprendizado ou criatividade!</p>
                        </div>
                    </div>
                    <div class="chat-message maki-message">
                        <div class="message-avatar">
                            <div class="avatar-circle">🧠</div>
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <span class="sender-name">MAKI IA</span>
                                <span class="message-time">agora</span>
                            </div>
                            <p>Oi! É um prazer conhecê-lo! Eu sou a MAKI IA, desenvolvida no SESI para tornar a tecnologia mais acessível e educativa. Como posso ajudar você hoje?</p>
                        </div>
                    </div>
                </div>
                <div class="demo-input-container">
                    <div class="input-wrapper">
                        <input type="text" placeholder="Digite sua pergunta para a MAKI IA..." id="demoInput" autocomplete="off" maxlength="500">
                        <button class="send-btn" onclick="sendDemoMessage()" id="sendBtn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="input-suggestions">
                        <span class="suggestion-label">Sugestões:</span>
                        <button class="suggestion-btn" onclick="sendSuggestion('O que é inteligência artificial?')">O que é IA?</button>
                        <button class="suggestion-btn" onclick="sendSuggestion('Como funciona a programação?')">Programação</button>
                        <button class="suggestion-btn" onclick="sendSuggestion('Conte sobre o SESI')">SESI</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adicionar estilos do modal
    const modalStyles = `
        .demo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: white;
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }
        .modal-header {
            background: var(--gradient-secondary);
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-body {
            padding: 2rem;
        }
        .demo-chat {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 1rem;
        }
        .chat-message {
            display: flex;
            margin-bottom: 1rem;
            animation: slideInMessage 0.5s ease;
        }
        .maki-message {
            justify-content: flex-start;
        }
        .user-message {
            justify-content: flex-end;
        }
        .message-avatar {
            width: 40px;
            height: 40px;
            background: var(--gradient-secondary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            font-size: 1.2rem;
        }
        .message-content {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 15px;
            max-width: 70%;
        }
        .user-message .message-content {
            background: var(--gradient-secondary);
            color: white;
        }
        .demo-input {
            display: flex;
            gap: 1rem;
        }
        .demo-input input {
            flex: 1;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            font-size: 1rem;
        }
        .demo-input button {
            padding: 1rem 2rem;
            background: var(--gradient-secondary);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInMessage {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;

    // Adicionar estilos ao head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    document.body.appendChild(modal);
    
    // Adicionar event listeners para o input
    setTimeout(() => {
        const input = document.getElementById('demoInput');
        if (input) {
            // Contador de caracteres
            input.addEventListener('input', function() {
                updateCharCounter(this.value.length);
            });
            
            // Enviar com Enter
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendDemoMessage();
                }
            });
            
            // Focar no input ao abrir
            input.focus();
        }
    }, 100);
}

// Função para fechar demonstração
function closeDemo() {
    const modal = document.querySelector('.demo-modal');
    if (modal) {
        modal.remove();
    }
}

// Função para enviar mensagem na demonstração
async function sendDemoMessage() {
    const input = document.getElementById('demoInput');
    const message = input.value.trim();
    const sendBtn = document.getElementById('sendBtn');
    
    // Validar mensagem vazia
    if (!message) {
        return;
    }
    
    // Validar limite de 500 caracteres
    if (message.length > 500) {
        addMessageToChat(`❌ Sua mensagem tem ${message.length} caracteres. Por favor, limite a 500 caracteres.`, 'maki', true);
        return;
    }
    
    // Desabilitar botão e input durante o envio
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';
    
    // Adicionar mensagem do usuário
    addMessageToChat(message, 'user');
    input.value = '';
    updateCharCounter(0);
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    try {
        // Enviar mensagem para a API da MAKI IA
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificar se a resposta foi bem-sucedida
        if (data.status === 'success' && data.response && data.response.trim()) {
            // Remover indicador de digitação antes de mostrar a resposta
            hideTypingIndicator();
            // Adicionar resposta da MAKI IA com efeito de digitação
            typeMessage(data.response.trim(), 'maki');
        } else {
            // Remover indicador de digitação
            hideTypingIndicator();
            // Mostrar erro específico
            const errorMsg = data.error || 'Desculpe, ocorreu um erro. Tente novamente.';
            addMessageToChat(`❌ ${errorMsg}`, 'maki', true);
        }
    } catch (error) {
        // Remover indicador de digitação
        hideTypingIndicator();
        console.error('Erro ao enviar mensagem:', error);
        addMessageToChat('❌ Desculpe, não consegui processar sua mensagem. Verifique sua conexão e tente novamente.', 'maki', true);
    } finally {
        // Reabilitar botão e input
        input.disabled = false;
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
        input.focus();
    }
}

// Função para mostrar indicador de digitação
function showTypingIndicator() {
    const chatContainer = document.getElementById('demoChat');
    if (!chatContainer) return;
    
    // Remover qualquer indicador existente primeiro
    hideTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message maki-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <div class="avatar-circle">🧠</div>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="sender-name">MAKI IA</span>
                <span class="message-time">digitando...</span>
            </div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    smoothScrollToBottom(chatContainer);
}

// Função para remover indicador de digitação
function hideTypingIndicator() {
    const chatContainer = document.getElementById('demoChat');
    if (chatContainer) {
        const typingIndicator = chatContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    } else {
        // Fallback: procurar em todo o documento
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Função para enviar sugestão
function sendSuggestion(message) {
    document.getElementById('demoInput').value = message;
    sendDemoMessage();
}

// Função para adicionar mensagem ao chat com animação suave
function addMessageToChat(message, sender, isError = false) {
    const chatContainer = document.getElementById('demoChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    if (isError) {
        messageDiv.classList.add('error-message');
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Escapar HTML para segurança
    const escapedMessage = escapeHtml(message);
    
    if (sender === 'maki') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-circle">🧠</div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">MAKI IA</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <p class="message-text">${escapedMessage}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Você</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <p class="message-text">${escapedMessage}</p>
            </div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    // Scroll suave para a última mensagem
    smoothScrollToBottom(chatContainer);
    
    // Animação de entrada
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

// Função para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Função para digitar mensagem com efeito de typewriter
function typeMessage(message, sender) {
    if (!message || typeof message !== 'string') {
        console.error('Mensagem inválida:', message);
        addMessageToChat('Desculpe, não recebi uma resposta válida.', 'maki', true);
        return;
    }
    
    const chatContainer = document.getElementById('demoChat');
    if (!chatContainer) {
        console.error('Container do chat não encontrado');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message typing-message`;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'maki') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-circle">🧠</div>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">MAKI IA</span>
                    <span class="message-time">${timeString}</span>
                </div>
                <p class="message-text"><span class="typing-cursor">|</span></p>
            </div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    
    // Animação de entrada
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    smoothScrollToBottom(chatContainer);
    
    // Digitar caractere por caractere
    const textElement = messageDiv.querySelector('.message-text');
    if (!textElement) {
        console.error('Elemento de texto não encontrado');
        return;
    }
    
    let index = 0;
    const typingSpeed = 20; // milissegundos por caractere
    
    function typeChar() {
        if (index < message.length && textElement) {
            textElement.innerHTML = escapeHtml(message.substring(0, index + 1)) + '<span class="typing-cursor">|</span>';
            index++;
            setTimeout(typeChar, typingSpeed);
            // Scroll contínuo durante a digitação
            smoothScrollToBottom(chatContainer);
        } else {
            // Remover cursor ao terminar
            if (textElement) {
                textElement.innerHTML = escapeHtml(message);
            }
        }
    }
    
    setTimeout(typeChar, 100);
}

// Função para scroll suave
function smoothScrollToBottom(element) {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
    });
}

// Função para atualizar contador de caracteres
function updateCharCounter(length) {
    let counter = document.getElementById('charCounter');
    if (!counter) {
        const inputWrapper = document.querySelector('.input-wrapper');
        counter = document.createElement('div');
        counter.id = 'charCounter';
        counter.className = 'char-counter';
        inputWrapper.appendChild(counter);
    }
    
    counter.textContent = `${length}/500`;
    counter.classList.toggle('char-limit', length >= 500);
}

// Função para verificar status da API
async function checkAPIStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.status === 'online') {
            console.log('✅ MAKI IA está online:', data.mensagem);
        }
    } catch (error) {
        console.log('⚠️ Erro ao verificar status da API:', error);
    }
}

// Função para adicionar efeitos de hover
function addHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .recurso-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função para animar elementos quando entram na tela
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .recurso-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

// Adicionar listener para scroll
window.addEventListener('scroll', animateOnScroll);

// Função para mostrar informações da MAKI IA
function showMAKIInfo() {
    fetch('/api/info')
        .then(response => response.json())
        .then(data => {
            console.log('Informações da MAKI IA:', data);
            // Aqui você pode exibir as informações de forma mais elaborada
        })
        .catch(error => {
            console.error('Erro ao buscar informações:', error);
        });
}

// Inicializar informações da MAKI
showMAKIInfo();
