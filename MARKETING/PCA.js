// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Chatbot script loaded!'); // Debug message
  
  const launcher = document.getElementById('vc-launcher');
  const chatWindow = document.getElementById('vc-chat');
  const minimizeBtn = document.getElementById('vc-minimize');
  const closeBtn = document.getElementById('vc-close');
  const chatForm = document.getElementById('vc-input');
  const chatInput = document.getElementById('vc-text');
  const messagesContainer = document.getElementById('vc-messages');

  console.log('Launcher found:', launcher); // Debug message

  // Chat state
  let isChatOpen = false;
  let isMinimized = false;

  // Predefined responses for the chatbot
  const responses = {
    'hello': 'Hello! Welcome to Fur-Ever Care! How can I help you today? 🐾',
    'hi': 'Hi there! How can I assist you with your pet today? 🐾',
    'hours': 'We are open Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 6:00 PM. Emergency services available 24/7! 🕐',
    'services': 'We offer General Checkups, Vaccinations, Emergency Care, Surgical Services, Preventive Care, and Wellness Programs. Would you like to know more about any specific service? 🏥',
    'appointment': 'To book an appointment, please click the "Book Now" button or call us at (555) 123-PETS. 📅',
    'emergency': 'For emergencies, please call us immediately at (555) 123-PETS. We provide 24/7 emergency care! 🚨',
    'location': 'We are located at 123 Pet Care Avenue, Veterinary District, VC 12345. 📍',
    'price': 'Our pricing varies by service. Please call us at (555) 123-PETS or book a consultation for specific pricing information. 💰',
    'vaccination': 'We provide comprehensive vaccination programs including core and non-core vaccines. Would you like to schedule a vaccination appointment? 💉',
    'contact': 'You can reach us at (555) 123-PETS or email furevercare@gmail.com. We\'d love to hear from you! 📞',
    'thank': 'You\'re welcome! Is there anything else I can help you with? 😊',
    'bye': 'Thank you for contacting Fur-Ever Care! Have a wonderful day! Take care of your furry friends! 🐾',
    'help': 'I can help you with:\n• Services information\n• Booking appointments\n• Hours of operation\n• Emergency care\n• Location and contact\n\nWhat would you like to know? 💬'
  };

  // Open chat window
  function openChat() {
    console.log('Opening chat...'); // Debug
    chatWindow.classList.add('open');
    launcher.classList.add('hidden');
    isChatOpen = true;
    isMinimized = false;
    
    // Show welcome message if no messages yet
    if (messagesContainer.children.length === 0) {
      addBotMessage('Hello! Welcome to Fur-Ever Care Veterinary Services! 🐾 How can I help you today?');
    }
  }

  // Close chat window
  function closeChat() {
    console.log('Closing chat...'); // Debug
    chatWindow.classList.remove('open');
    chatWindow.classList.remove('minimized');
    launcher.classList.remove('hidden');
    isChatOpen = false;
    isMinimized = false;
  }

  // Minimize chat window
  function minimizeChat() {
    console.log('Minimizing chat...'); // Debug
    if (!isMinimized) {
      chatWindow.classList.add('minimized');
      isMinimized = true;
    } else {
      chatWindow.classList.remove('minimized');
      isMinimized = false;
    }
  }

  // Add message to chat
  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('vc-message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    
    const timestamp = document.createElement('div');
    timestamp.classList.add('message-time');
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestamp);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Add bot message with typing indicator
  function addBotMessage(message) {
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('vc-message', 'bot-message', 'typing-indicator');
    typingDiv.innerHTML = '<div class="message-content"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Remove typing indicator and show message after delay
    setTimeout(() => {
      messagesContainer.removeChild(typingDiv);
      addMessage(message, false);
    }, 1000);
  }

  // Get bot response
  function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for keywords in user message
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }
    
    // Default response
    return 'Thank you for your message! For specific inquiries, please call us at (555) 123-PETS or email furevercare@gmail.com. How else can I assist you? 🐾';
  }

  // Event listeners
  if (launcher) {
    launcher.addEventListener('click', function() {
      console.log('Launcher clicked!'); // Debug
      openChat();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', minimizeChat);
  }

  // Handle form submission
  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userMessage = chatInput.value.trim();
      if (userMessage === '') return;
      
      // Add user message
      addMessage(userMessage, true);
      chatInput.value = '';
      
      // Get and add bot response
      const botResponse = getBotResponse(userMessage);
      addBotMessage(botResponse);
    });
  }

  // Allow Enter key to send message
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  }
});