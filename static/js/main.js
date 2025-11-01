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

// Função para mostrar demonstração melhorada
function showDemo() {
    // Criar modal de demonstração melhorado
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
                        <h3>MAKI IA - Chat Interativo</h3>
                        <p>Inteligência Artificial Real • SESI • Tecnologia Acessível</p>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="action-btn" onclick="clearDemoChat()" title="Limpar conversa">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="shareDemoChat()" title="Compartilhar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.16581 15.0239 5.32482 15.0679 5.47522L8.93211 9.52478C8.97612 9.67518 9 9.83419 9 10C9 9.83419 8.97612 9.67518 8.93211 9.52478L15.0679 5.47522C15.0239 5.32482 15 5.16581 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5C21 6.65685 19.6569 8 18 8ZM8.93211 14.4752C8.97612 14.3248 9 14.1658 9 14C9 12.3431 7.65685 11 6 11C4.34315 11 3 12.3431 3 14C3 15.6569 4.34315 17 6 17C7.65685 17 9 15.6569 9 14C9 14.1658 8.97612 14.3248 8.93211 14.4752ZM15.0679 18.5248C15.0239 18.6752 15 18.8342 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 18.8342 15.0239 18.6752 15.0679 18.5248L8.93211 14.4752C8.97612 14.3248 9 14.1658 9 14C9 13.8342 8.97612 13.6752 8.93211 13.5248L15.0679 9.47522C15.0239 9.32482 15 9.16581 15 9C15 7.34315 16.3431 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12C16.3431 12 15 10.6569 15 9C15 9.16581 15.0239 9.32482 15.0679 9.47522L8.93211 13.5248C8.97612 13.6752 9 13.8342 9 14C9 14.1658 8.97612 14.3248 8.93211 14.4752L15.0679 18.5248Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="close-btn" onclick="closeDemo()" title="Fechar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="modal-body">
                <div class="demo-chat" id="demoChat">
                    <div class="welcome-message">
                        <div class="welcome-icon">✨</div>
                        <div class="welcome-text">
                            <h4>Bem-vindo à MAKI IA!</h4>
                            <p>IA educacional desenvolvida no SESI. Pergunte sobre tecnologia, programação, educação ou inovação!</p>
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
                                <button class="copy-msg-btn" onclick="copyMessage(this)" title="Copiar mensagem">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                            <p>Oi! 👋 Sou a MAKI IA do SESI, pronta para tornar tecnologia e educação mais acessíveis! Em que posso ajudar?</p>
                        </div>
                    </div>
                </div>
                <div class="demo-input-container">
                    <div class="input-wrapper">
                        <textarea id="demoInput" placeholder="Digite sua pergunta para a MAKI IA..." rows="1" autocomplete="off" maxlength="5000" style="flex: 1; border: none; background: transparent; resize: none; font-size: 0.95rem; font-family: inherit; line-height: 1.6; color: var(--color-gray-900); min-height: 24px; max-height: 150px; overflow-y: auto; outline: none;"></textarea>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="char-counter-demo" id="charCounterDemo">0/5000</span>
                            <button class="send-btn" onclick="sendDemoMessage()" id="sendBtn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="input-suggestions">
                        <span class="suggestion-label">💡 Sugestões rápidas:</span>
                        <button class="suggestion-btn" onclick="sendSuggestion('O que é inteligência artificial?')">🤖 O que é IA?</button>
                        <button class="suggestion-btn" onclick="sendSuggestion('Como começar a programar?')">💻 Como programar?</button>
                        <button class="suggestion-btn" onclick="sendSuggestion('Conte sobre o SESI')">🎓 Sobre o SESI</button>
                        <button class="suggestion-btn" onclick="sendSuggestion('Tecnologia na educação')">📚 Tech na Educação</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adicionar estilos do modal melhorado
    const modalStyles = `
        .demo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        .modal-content {
            background: white;
            border-radius: 24px;
            width: 95%;
            max-width: 900px;
            max-height: 90vh;
            overflow: hidden;
            animation: slideUp 0.3s ease;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
        }
        .modal-header {
            background: var(--gradient-secondary);
            color: white;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        .header-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        .action-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .action-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.05);
        }
        .close-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        .close-btn:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.05);
        }
        .modal-body {
            padding: 0;
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
        }
        .demo-chat {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
            scroll-behavior: smooth;
            min-height: 400px;
            max-height: 60vh;
        }
        .demo-chat::-webkit-scrollbar {
            width: 8px;
        }
        .demo-chat::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .demo-chat::-webkit-scrollbar-thumb {
            background: var(--color-secondary);
            border-radius: 10px;
            opacity: 0.5;
        }
        .demo-chat::-webkit-scrollbar-thumb:hover {
            opacity: 0.8;
        }
        .chat-message {
            display: flex;
            margin-bottom: 1.5rem;
            animation: slideInMessage 0.4s ease;
            gap: 1rem;
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
            font-size: 1.2rem;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
        }
        .message-content {
            background: white;
            padding: 1rem 1.2rem;
            border-radius: 18px;
            max-width: 75%;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid #e0e0e0;
            position: relative;
        }
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            gap: 0.5rem;
        }
        .copy-msg-btn {
            background: transparent;
            border: none;
            color: var(--color-gray-600);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            opacity: 0;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .message-content:hover .copy-msg-btn {
            opacity: 1;
        }
        .copy-msg-btn:hover {
            background: var(--color-gray-100);
            color: var(--color-secondary);
        }
        .user-message .message-content {
            background: var(--gradient-secondary);
            color: white;
            border: none;
        }
        .user-message .message-header {
            color: rgba(255, 255, 255, 0.9);
        }
        .demo-input-container {
            padding: 1.5rem;
            background: white;
            border-top: 1px solid #e0e0e0;
            flex-shrink: 0;
        }
        .input-wrapper {
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
            background: var(--color-gray-50);
            border: 2px solid var(--color-gray-200);
            border-radius: 24px;
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }
        .input-wrapper:focus-within {
            border-color: var(--color-secondary);
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }
        .char-counter-demo {
            font-size: 0.75rem;
            color: var(--color-gray-600);
            font-weight: 500;
        }
        .send-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: var(--gradient-secondary);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
            flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
        }
        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .input-suggestions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex-wrap: wrap;
        }
        .suggestion-label {
            font-size: 0.85rem;
            color: var(--color-text-light);
            font-weight: 600;
        }
        .suggestion-btn {
            padding: 0.6rem 1.2rem;
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        .suggestion-btn:hover {
            background: var(--color-secondary);
            color: white;
            border-color: var(--color-secondary);
            transform: translateY(-1px);
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
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;

    // Adicionar estilos ao head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);

    document.body.appendChild(modal);
    
    // Adicionar event listeners para o input melhorado
    setTimeout(() => {
        const input = document.getElementById('demoInput');
        if (input) {
            // Contador de caracteres
            input.addEventListener('input', function() {
                updateCharCounterDemo(this.value.length);
                autoResizeDemoTextarea();
            });
            
            // Enviar com Enter (Shift+Enter para nova linha)
            input.addEventListener('keydown', function(e) {
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

// Funções adicionais do modal
function clearDemoChat() {
    const chatContainer = document.getElementById('demoChat');
    if (!chatContainer) return;
    
    const welcomeScreen = chatContainer.querySelector('.welcome-message');
    const initialMessage = chatContainer.querySelector('.maki-message');
    const allMessages = chatContainer.querySelectorAll('.chat-message');
    
    // Manter apenas welcome e mensagem inicial
    allMessages.forEach(msg => {
        if (msg !== initialMessage && !msg.contains(welcomeScreen)) {
            msg.remove();
        }
    });
}

function shareDemoChat() {
    const chatContainer = document.getElementById('demoChat');
    if (!chatContainer) return;
    
    const messages = Array.from(chatContainer.querySelectorAll('.chat-message')).map(msg => {
        const sender = msg.classList.contains('maki-message') ? 'MAKI IA' : 'Você';
        const text = msg.querySelector('p')?.textContent || '';
        return `${sender}: ${text}`;
    }).join('\n\n');
    
    const shareText = `Conversa com MAKI IA:\n\n${messages}\n\n---\nExperimente a MAKI IA: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Conversa com MAKI IA',
            text: shareText
        }).catch(() => copyToClipboard(shareText));
    } else {
        copyToClipboard(shareText);
    }
}

function copyMessage(btn) {
    const messageContent = btn.closest('.message-content').querySelector('p');
    if (messageContent) {
        copyToClipboard(messageContent.textContent);
        btn.style.opacity = '1';
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Copiado!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✓ Copiado!');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--color-primary); color: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 3000; animation: slideInRight 0.3s ease;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Função para enviar mensagem na demonstração melhorada
async function sendDemoMessage() {
    const input = document.getElementById('demoInput');
    const message = input.value.trim();
    const sendBtn = document.getElementById('sendBtn');
    
    if (!input || !sendBtn) return;
    
    // Validar mensagem vazia
    if (!message) {
        return;
    }
    
    // Validar limite de 5000 caracteres
    if (message.length > 5000) {
        addMessageToChat(`❌ Sua mensagem tem ${message.length} caracteres. Por favor, limite a 5000 caracteres.`, 'maki', true);
        return;
    }
    
    // Desabilitar botão e input durante o envio
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';
    
    // Adicionar mensagem do usuário
    addMessageToChat(message, 'user');
    input.value = '';
    updateCharCounterDemo(0);
    autoResizeDemoTextarea();
    
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
        autoResizeDemoTextarea();
        input.focus();
    }
}

function autoResizeDemoTextarea() {
    const input = document.getElementById('demoInput');
    if (input && input.tagName === 'TEXTAREA') {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    }
}

function updateCharCounterDemo(length) {
    const counter = document.getElementById('charCounterDemo');
    if (!counter) return;
    
    counter.textContent = `${length}/5000`;
    
    if (length >= 5000) {
        counter.style.color = '#ef5350';
    } else if (length >= 4500) {
        counter.style.color = '#ff9800';
    } else {
        counter.style.color = '';
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
                    <button class="copy-msg-btn" onclick="copyMessage(this)" title="Copiar mensagem">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                        </svg>
                    </button>
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

// ==========================================
// MAKI IA AGENT - Funcionalidade integrada na home
// ==========================================

let agentIsTyping = false;

// Inicializar Agent quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeAgent();
});

function initializeAgent() {
    const messageInput = document.getElementById('agentMessageInput');
    const sendButton = document.getElementById('agentSendButton');
    const charCounter = document.getElementById('agentCharCounter');
    const welcomeScreen = document.getElementById('agentWelcomeScreen');
    const chatContainer = document.getElementById('agentChatContainer');
    
    if (!messageInput || !sendButton) return;
    
    // Event listeners
    sendButton.addEventListener('click', sendAgentMessage);
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAgentMessage();
        }
    });
    
    messageInput.addEventListener('input', () => {
        updateAgentCharCounter();
        autoResizeAgentTextarea();
        updateAgentSendButton();
    });
    
    // Sugestões
    document.querySelectorAll('.agent-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const suggestion = e.currentTarget.getAttribute('data-suggestion');
            messageInput.value = suggestion;
            updateAgentCharCounter();
            autoResizeAgentTextarea();
            updateAgentSendButton();
            messageInput.focus();
        });
    });
}

function autoResizeAgentTextarea() {
    const input = document.getElementById('agentMessageInput');
    if (input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    }
}

function updateAgentCharCounter() {
    const input = document.getElementById('agentMessageInput');
    const counter = document.getElementById('agentCharCounter');
    if (!input || !counter) return;
    
    const length = input.value.length;
    const maxLength = 5000;
    counter.textContent = `${length}/${maxLength}`;
    
    if (length >= maxLength) {
        counter.style.color = '#ef5350';
    } else if (length >= maxLength * 0.9) {
        counter.style.color = '#ff9800';
    } else {
        counter.style.color = '';
    }
}

function updateAgentSendButton() {
    const input = document.getElementById('agentMessageInput');
    const sendButton = document.getElementById('agentSendButton');
    if (!input || !sendButton) return;
    
    const hasText = input.value.trim().length > 0;
    const underLimit = input.value.length <= 5000;
    sendButton.disabled = !hasText || !underLimit || agentIsTyping;
    
    if (sendButton.disabled) {
        sendButton.style.opacity = '0.5';
    } else {
        sendButton.style.opacity = '1';
    }
}

async function sendAgentMessage() {
    const input = document.getElementById('agentMessageInput');
    const sendButton = document.getElementById('agentSendButton');
    const welcomeScreen = document.getElementById('agentWelcomeScreen');
    const chatContainer = document.getElementById('agentChatContainer');
    
    if (!input || !sendButton) return;
    
    const message = input.value.trim();
    
    if (!message || message.length > 5000 || agentIsTyping) {
        return;
    }
    
    // Esconder welcome screen
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Adicionar mensagem do usuário
    addAgentMessage(message, 'user');
    
    // Limpar input
    input.value = '';
    updateAgentCharCounter();
    autoResizeAgentTextarea();
    updateAgentSendButton();
    
    // Mostrar indicador de digitação
    showAgentTypingIndicator();
    agentIsTyping = true;
    updateAgentSendButton();
    
    try {
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
        
        hideAgentTypingIndicator();
        
        if (data.status === 'success' && data.response) {
            addAgentMessage(data.response.trim(), 'maki');
        } else {
            const errorMsg = data.error || 'Desculpe, ocorreu um erro. Tente novamente.';
            addAgentMessage(`❌ ${errorMsg}`, 'maki', true);
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        hideAgentTypingIndicator();
        addAgentMessage('❌ Desculpe, não consegui processar sua mensagem. Verifique sua conexão e tente novamente.', 'maki', true);
    } finally {
        agentIsTyping = false;
        updateAgentSendButton();
        input.focus();
    }
}

function addAgentMessage(text, sender, isError = false) {
    const chatContainer = document.getElementById('agentChatContainer');
    if (!chatContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'display: flex; gap: 1rem; padding: 1rem 0; animation: slideIn 0.3s ease;';
    if (sender === 'user') {
        messageDiv.style.justifyContent = 'flex-end';
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const escapedText = escapeHtml(text).replace(/\n/g, '<br>');
    const avatar = sender === 'maki' ? '🧠' : '👤';
    
    const messageStyle = sender === 'user' 
        ? 'background: var(--gradient-secondary); color: white; border: none;'
        : isError 
            ? 'background: #ffebee; border: 1px solid #ef5350; color: #c62828;'
            : 'background: white; border: 1px solid var(--color-gray-200); color: var(--color-gray-900);';
    
    messageDiv.innerHTML = `
        ${sender === 'maki' ? `<div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; background: var(--gradient-secondary); box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);">${avatar}</div>` : ''}
        <div style="max-width: 70%; display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="padding: 1rem 1.25rem; border-radius: 18px; line-height: 1.7; font-size: 0.95rem; word-wrap: break-word; white-space: pre-wrap; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); ${messageStyle}">${escapedText}</div>
            <div style="font-size: 0.75rem; color: var(--color-gray-600); padding: 0 0.5rem;">${timeString}</div>
        </div>
        ${sender === 'user' ? `<div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; background: var(--color-gray-300);">${avatar}</div>` : ''}
    `;
    
    chatContainer.appendChild(messageDiv);
    scrollAgentToBottom();
}

function showAgentTypingIndicator() {
    const chatContainer = document.getElementById('agentChatContainer');
    if (!chatContainer) return;
    
    hideAgentTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'agentTypingIndicator';
    typingDiv.style.cssText = 'display: flex; gap: 1rem; padding: 1rem 0;';
    typingDiv.innerHTML = `
        <div style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; background: var(--gradient-secondary);">🧠</div>
        <div style="display: flex; gap: 0.5rem; padding: 1rem 1.25rem; background: white; border: 1px solid var(--color-gray-200); border-radius: 18px; align-items: center;">
            <div style="width: 8px; height: 8px; background: var(--color-secondary); border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
            <div style="width: 8px; height: 8px; background: var(--color-secondary); border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.2s;"></div>
            <div style="width: 8px; height: 8px; background: var(--color-secondary); border-radius: 50%; animation: typing 1.4s infinite ease-in-out; animation-delay: 0.4s;"></div>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    scrollAgentToBottom();
}

function hideAgentTypingIndicator() {
    const indicator = document.getElementById('agentTypingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollAgentToBottom() {
    const chatContainer = document.getElementById('agentChatContainer');
    if (chatContainer) {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
}

// Adicionar estilos CSS para o Agent na home
const agentStyles = `
    .agent-suggestion-btn {
        padding: 1.25rem;
        background: white;
        border: 1px solid var(--color-gray-200);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        text-align: center;
    }
    .agent-suggestion-btn:hover {
        border-color: var(--color-secondary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .agent-suggestion-btn span:last-child {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-gray-800);
    }
    #agentInputWrapper:focus-within {
        border-color: var(--color-secondary);
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
    #agentSendButton:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    }
    #agentSendButton:active:not(:disabled) {
        transform: scale(0.95);
    }
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = agentStyles;
document.head.appendChild(styleSheet);
