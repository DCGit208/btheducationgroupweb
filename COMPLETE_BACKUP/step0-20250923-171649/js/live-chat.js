// Live Chat Widget for BTH Education Group
// Simple implementation that can be replaced with Intercom, Zendesk, etc.

class BTHLiveChat {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        type: 'bot',
        message: 'Hi! I\'m here to help you learn about BTH\'s UN-mandated education programs. How can I assist you today?',
        timestamp: new Date()
      }
    ];
    this.init();
  }

  init() {
    this.createChatWidget();
    this.attachEventListeners();
    this.loadQuickActions();
  }

  createChatWidget() {
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'bth-chat-button';
    chatButton.innerHTML = `
      <div class="chat-icon">💬</div>
      <span class="chat-text">Need Help?</span>
    `;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'bth-chat-window';
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-title">
          <div class="chat-avatar">🎓</div>
          <div class="chat-info">
            <div class="chat-name">BTH Education Advisor</div>
            <div class="chat-status">Online • Responds in 2 min</div>
          </div>
        </div>
        <button class="chat-close">&times;</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <!-- Messages will be populated here -->
      </div>
      <div class="chat-quick-actions" id="chat-quick-actions">
        <!-- Quick action buttons -->
      </div>
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <input type="text" id="chat-input" placeholder="Type your message..." maxlength="500">
          <button id="chat-send" class="chat-send-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add to page
    document.body.appendChild(chatButton);
    document.body.appendChild(chatWindow);
    
    // Populate initial messages
    this.updateMessages();
  }

  attachEventListeners() {
    const chatButton = document.getElementById('bth-chat-button');
    const chatWindow = document.getElementById('bth-chat-window');
    const chatClose = chatWindow.querySelector('.chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    chatButton.addEventListener('click', () => this.toggleChat());
    chatClose.addEventListener('click', () => this.closeChat());
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    chatSend.addEventListener('click', () => this.sendMessage());
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !chatWindow.contains(e.target) && 
          !chatButton.contains(e.target)) {
        // Don't auto-close to avoid interrupting conversations
      }
    });
  }

  loadQuickActions() {
    const quickActions = [
      {
        text: '📚 Download Program Catalog',
        action: 'catalog'
      },
      {
        text: '💰 View Program Pricing',
        action: 'pricing'
      },
      {
        text: '🎯 Take Career Assessment',
        action: 'assessment'
      },
      {
        text: '📞 Schedule Consultation',
        action: 'consultation'
      },
      {
        text: '🏆 Job Guarantee Details',
        action: 'guarantee'
      }
    ];

    const quickActionsContainer = document.getElementById('chat-quick-actions');
    quickActionsContainer.innerHTML = quickActions.map(action => 
      `<button class="quick-action-btn" data-action="${action.action}">${action.text}</button>`
    ).join('');

    // Attach click handlers
    quickActionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-action-btn')) {
        const action = e.target.dataset.action;
        this.handleQuickAction(action);
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    const chatWindow = document.getElementById('bth-chat-window');
    const chatButton = document.getElementById('bth-chat-button');
    
    chatWindow.classList.add('open');
    chatButton.classList.add('hidden');
    this.isOpen = true;
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('chat-input').focus();
    }, 300);
    
    // Track chat opened
    this.trackEvent('chat_opened');
  }

  closeChat() {
    const chatWindow = document.getElementById('bth-chat-window');
    const chatButton = document.getElementById('bth-chat-button');
    
    chatWindow.classList.remove('open');
    chatButton.classList.remove('hidden');
    this.isOpen = false;
  }

  sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.messages.push({
      type: 'user',
      message: message,
      timestamp: new Date()
    });
    
    chatInput.value = '';
    this.updateMessages();
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = this.generateBotResponse(message);
      this.messages.push({
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      });
      this.updateMessages();
    }, 1000 + Math.random() * 2000);
    
    // Track message sent
    this.trackEvent('chat_message_sent');
  }

  generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
      return 'Our Cybersecurity Virtuoso Program is $12,500 with flexible payment plans starting at $520/month. We also offer corporate rates and group discounts. Would you like to schedule a consultation to discuss pricing options? <a href="contact.html" target="_blank">Book a consultation</a>';
    }
    
    if (message.includes('job') || message.includes('guarantee') || message.includes('placement')) {
      return 'We offer a 100% job placement guarantee! 94% of our graduates find employment within 6 months, with an average starting salary of $75K. If you don\'t find a job within 6 months of completing your program, we provide a full refund. <a href="oedp.html" target="_blank">Learn more about our guarantee</a>';
    }
    
    if (message.includes('program') || message.includes('course') || message.includes('training')) {
      return 'We offer 60+ certification programs across 12+ industries through our comprehensive OEDP system, including cybersecurity, intelligent cloud, medical technology, automotive, renewable energy, smart home/IoT, and more. All programs are UN-mandated and include job placement guarantees. <a href="program-catalog.html" target="_blank">Download our free program catalog</a> to see all options!';
    }
    
    if (message.includes('un') || message.includes('mandate') || message.includes('accredit')) {
      return 'BTH Education Group operates under UN Educational Mandate with UNESCO partnership status. We\'re ISO 17024 certified and focus on building strong institutions (SDG #16) for global workforce development. <a href="about.html" target="_blank">Learn more about our credentials</a>';
    }
    
    if (message.includes('apply') || message.includes('start') || message.includes('enroll')) {
      return 'Ready to transform your career? Our application process is simple and takes about 10 minutes. We\'ll match you with the perfect program based on your goals. <a href="apply.html" target="_blank">Start your application now</a>';
    }
    
    if (message.includes('assessment') || message.includes('test') || message.includes('evaluate')) {
      return 'Our free career assessment takes just 5 minutes and provides personalized program recommendations based on your goals and experience. <a href="career-assessment.html" target="_blank">Take the assessment now</a>';
    }
    
    // Default responses
    const defaultResponses = [
      'That\'s a great question! I\'d recommend speaking with one of our education advisors who can provide detailed information tailored to your specific situation. <a href="contact.html" target="_blank">Schedule a free consultation</a>',
      'I\'d be happy to connect you with an admissions specialist who can answer that in detail. Our consultations are free and typically last 30 minutes. <a href="contact.html" target="_blank">Book your consultation</a>',
      'For the most accurate information about that topic, I recommend downloading our comprehensive program catalog or speaking with an advisor. <a href="program-catalog.html" target="_blank">Get the catalog</a> or <a href="contact.html" target="_blank">book a call</a>.'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  handleQuickAction(action) {
    let botMessage = '';
    let redirectUrl = '';
    
    switch (action) {
      case 'catalog':
        botMessage = 'Great choice! Our comprehensive program catalog includes detailed information about all 50+ certification programs, pricing, and career outcomes. You can download it instantly with your email.';
        redirectUrl = 'program-catalog.html';
        break;
      case 'pricing':
        botMessage = 'Our programs range from $8,900 to $12,500 with flexible payment plans. For example, our popular Cybersecurity Virtuoso Program is $12,500 or $520/month. All programs include our job placement guarantee.';
        break;
      case 'assessment':
        botMessage = 'Perfect! Our career assessment takes just 5 minutes and provides personalized program recommendations based on your goals, experience, and career aspirations.';
        redirectUrl = 'career-assessment.html';
        break;
      case 'consultation':
        botMessage = 'Excellent! Our free 30-minute consultations include personalized program recommendations, job guarantee details, and answers to all your questions. Most people find them incredibly valuable.';
        redirectUrl = 'contact.html#consultation-form';
        break;
      case 'guarantee':
        botMessage = 'Our 100% job placement guarantee is industry-leading! 94% of graduates find employment within 6 months with an average starting salary of $75K. If you don\'t find a job within 6 months of completion, we provide a full tuition refund.';
        break;
    }
    
    this.messages.push({
      type: 'bot',
      message: botMessage,
      timestamp: new Date()
    });
    
    this.updateMessages();
    
    if (redirectUrl) {
      setTimeout(() => {
        if (redirectUrl.includes('#')) {
          window.location.href = redirectUrl;
        } else {
          window.open(redirectUrl, '_blank');
        }
      }, 2000);
    }
    
    this.trackEvent('quick_action_used', { action });
  }

  updateMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    
    messagesContainer.innerHTML = this.messages.map(msg => `
      <div class="chat-message ${msg.type}">
        <div class="message-content">${msg.message}</div>
        <div class="message-time">${this.formatTime(msg.timestamp)}</div>
      </div>
    `).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackEvent(eventName, properties = {}) {
    // Track events for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Live Chat',
        ...properties
      });
    }
    
    console.log('Chat Event:', eventName, properties);
  }
}

// CSS Styles for Live Chat Widget
const chatStyles = `
<style>
#bth-chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #1a365d, #2d4a70);
  color: white;
  border-radius: 50px;
  padding: 15px 20px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(26, 54, 93, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

#bth-chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(26, 54, 93, 0.4);
}

#bth-chat-button.hidden {
  transform: scale(0);
  opacity: 0;
}

.chat-icon {
  font-size: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

#bth-chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  transform: scale(0) translateY(50px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  border: 1px solid #e5e7eb;
}

#bth-chat-window.open {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.chat-header {
  background: linear-gradient(135deg, #1a365d, #2d4a70);
  color: white;
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chat-name {
  font-weight: 600;
  font-size: 16px;
}

.chat-status {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 5px;
}

.chat-status::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.chat-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-message {
  max-width: 85%;
  word-wrap: break-word;
}

.chat-message.user {
  align-self: flex-end;
}

.chat-message.bot {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.chat-message.user .message-content {
  background: linear-gradient(135deg, #1a365d, #2d4a70);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.bot .message-content {
  background: #f3f4f6;
  color: #374151;
  border-bottom-left-radius: 4px;
}

.chat-message.bot .message-content a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.chat-message.bot .message-content a:hover {
  text-decoration: underline;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

.chat-message.user .message-time {
  text-align: right;
}

.chat-quick-actions {
  padding: 15px 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-action-btn {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.quick-action-btn:hover {
  background: #1a365d;
  color: white;
  border-color: #1a365d;
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #f3f4f6;
  border-radius: 0 0 16px 16px;
}

.chat-input-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 25px;
  padding: 12px 15px;
  transition: border-color 0.2s;
}

.chat-input-wrapper:focus-within {
  border-color: #1a365d;
  box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
}

#chat-input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 14px;
  color: #374151;
  font-family: inherit;
}

#chat-input::placeholder {
  color: #9ca3af;
}

.chat-send-btn {
  background: #1a365d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  margin-left: 10px;
}

.chat-send-btn:hover {
  background: #2d4a70;
}

.chat-send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  #bth-chat-window {
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  #bth-chat-button {
    bottom: 15px;
    right: 15px;
  }
  
  .chat-header {
    border-radius: 0;
  }
  
  .chat-input-area {
    border-radius: 0;
  }
}
</style>
`;

// Initialize live chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add CSS styles
  document.head.insertAdjacentHTML('beforeend', chatStyles);
  
  // Initialize chat widget
  setTimeout(() => {
    new BTHLiveChat();
  }, 1000);
});

// Export for external use
window.BTHLiveChat = BTHLiveChat;
