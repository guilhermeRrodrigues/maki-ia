// JavaScript para o modo Agent da MAKI IA

class MAKIAgent {
    constructor() {
        this.chatHistory = [];
        this.conversations = [];
        this.currentConversationId = null;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadHistory();
        this.checkAPIStatus();
    }
    
    setupElements() {
        this.chatContainer = document.getElementById('chatContainer');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.charCounter = document.getElementById('charCounter');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.menuToggle = document.getElementById('menuToggle');
        this.historyList = document.getElementById('historyList');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }
    
    setupEventListeners() {
        // Enviar mensagem
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter para enviar (Shift+Enter para nova linha)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.updateCharCounter();
            this.autoResizeTextarea();
            this.updateSendButton();
        });
        
        // Nova conversa
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        
        // Menu toggle (mobile)
        this.menuToggle?.addEventListener('click', () => this.toggleSidebar());
        
        // Sugestões
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const suggestion = e.currentTarget.getAttribute('data-suggestion');
                this.messageInput.value = suggestion;
                this.updateCharCounter();
                this.autoResizeTextarea();
                this.updateSendButton();
                this.messageInput.focus();
            });
        });
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
    }
    
    updateCharCounter() {
        const length = this.messageInput.value.length;
        const maxLength = 5000;
        this.charCounter.textContent = `${length}/${maxLength}`;
        
        if (length >= maxLength) {
            this.charCounter.style.color = '#ef5350';
        } else if (length >= maxLength * 0.9) {
            this.charCounter.style.color = '#ff9800';
        } else {
            this.charCounter.style.color = '';
        }
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const underLimit = this.messageInput.value.length <= 5000;
        this.sendButton.disabled = !hasText || !underLimit || this.isTyping;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || message.length > 5000 || this.isTyping) {
            return;
        }
        
        // Esconder welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }
        
        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Limpar input
        this.messageInput.value = '';
        this.updateCharCounter();
        this.autoResizeTextarea();
        this.updateSendButton();
        
        // Mostrar indicador de digitação
        this.showTypingIndicator();
        this.isTyping = true;
        this.updateSendButton();
        
        try {
            // Enviar para API
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
            
            // Remover indicador de digitação
            this.hideTypingIndicator();
            
            if (data.status === 'success' && data.response) {
                // Adicionar resposta da MAKI
                this.addMessage(data.response.trim(), 'maki');
            } else {
                const errorMsg = data.error || 'Desculpe, ocorreu um erro. Tente novamente.';
                this.addMessage(`❌ ${errorMsg}`, 'maki', true);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.hideTypingIndicator();
            this.addMessage('❌ Desculpe, não consegui processar sua mensagem. Verifique sua conexão e tente novamente.', 'maki', true);
        } finally {
            this.isTyping = false;
            this.updateSendButton();
            this.messageInput.focus();
            
            // Salvar conversa
            this.saveToHistory(message);
        }
    }
    
    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        if (isError) {
            messageDiv.classList.add('error-message');
        }
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Escapar HTML
        const escapedText = this.escapeHtml(text);
        // Converter quebras de linha em <br>
        const formattedText = escapedText.replace(/\n/g, '<br>');
        
        const avatar = sender === 'maki' ? '🧠' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${formattedText}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Adicionar ao histórico
        this.chatHistory.push({
            text,
            sender,
            time: now,
            isError
        });
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message maki-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🧠</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatContainer.scrollTo({
            top: this.chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    startNewChat() {
        // Limpar chat atual
        this.chatHistory = [];
        this.chatContainer.innerHTML = '';
        
        // Mostrar welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'flex';
        }
        
        // Criar nova conversa
        this.currentConversationId = Date.now().toString();
        this.messageInput.focus();
    }
    
    saveToHistory(lastMessage) {
        // Salvar no localStorage
        const conversation = {
            id: this.currentConversationId || Date.now().toString(),
            title: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? '...' : ''),
            messages: [...this.chatHistory],
            timestamp: new Date().toISOString()
        };
        
        this.currentConversationId = conversation.id;
        
        // Adicionar ou atualizar conversa
        const existingIndex = this.conversations.findIndex(c => c.id === conversation.id);
        if (existingIndex >= 0) {
            this.conversations[existingIndex] = conversation;
        } else {
            this.conversations.unshift(conversation);
        }
        
        // Limitar a 50 conversas
        if (this.conversations.length > 50) {
            this.conversations = this.conversations.slice(0, 50);
        }
        
        // Salvar no localStorage
        try {
            localStorage.setItem('maki_agent_conversations', JSON.stringify(this.conversations));
        } catch (e) {
            console.warn('Não foi possível salvar no localStorage:', e);
        }
        
        // Atualizar lista de histórico
        this.renderHistory();
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('maki_agent_conversations');
            if (saved) {
                this.conversations = JSON.parse(saved);
                this.renderHistory();
            }
        } catch (e) {
            console.warn('Não foi possível carregar do localStorage:', e);
        }
    }
    
    renderHistory() {
        if (!this.historyList) return;
        
        this.historyList.innerHTML = '';
        
        if (this.conversations.length === 0) {
            return;
        }
        
        this.conversations.forEach(conv => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = conv.title;
            item.addEventListener('click', () => this.loadConversation(conv));
            this.historyList.appendChild(item);
        });
    }
    
    loadConversation(conversation) {
        // Limpar chat atual
        this.chatContainer.innerHTML = '';
        this.chatHistory = [];
        
        // Esconder welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }
        
        // Carregar mensagens
        conversation.messages.forEach(msg => {
            this.addMessage(msg.text, msg.sender, msg.isError);
        });
        
        this.currentConversationId = conversation.id;
        this.scrollToBottom();
    }
    
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }
    
    async checkAPIStatus() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            if (data.status === 'online') {
                console.log('✅ MAKI IA está online');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao verificar status da API:', error);
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.makiAgent = new MAKIAgent();
});

// Fechar sidebar ao clicar fora (mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (sidebar && menuToggle && window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }
});

