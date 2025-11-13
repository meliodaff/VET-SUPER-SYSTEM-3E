<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fur-Ever Care Chatbot</title>
  <style>
    /* Chatbot Launcher Button */
    #vc-launcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      z-index: 9999;
      transition: all 0.3s ease;
    }

    #vc-launcher:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .launcher-icon {
      width: 35px;
      height: 35px;
      filter: brightness(0) invert(1);
    }

    /* Chat Window */
    #vc-chat {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      display: flex;
      flex-direction: column;
      z-index: 9998;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      pointer-events: none;
      transition: all 0.3s ease;
    }

    #vc-chat.show {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: all;
    }

    /* Header */
    .vc-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .vc-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .paw-icon {
      width: 30px;
      height: 30px;
      filter: brightness(0) invert(1);
    }

    .vc-title {
      display: flex;
      flex-direction: column;
    }

    .assistant-name {
      font-weight: 600;
      font-size: 16px;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      opacity: 0.9;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }

    .vc-header-right {
      display: flex;
      gap: 8px;
    }

    .vc-header-right button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .vc-header-right button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Messages Area */
    #vc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #f7f7f7;
    }

    .msg {
      display: flex;
      margin-bottom: 12px;
    }

    .msg.bot {
      justify-content: flex-start;
    }

    .msg.user {
      justify-content: flex-end;
    }

    .bubble {
      max-width: 70%;
      padding: 10px 14px;
      border-radius: 18px;
      position: relative;
    }

    .msg.bot .bubble {
      background: white;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .msg.user .bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .time {
      font-size: 10px;
      opacity: 0.6;
      margin-top: 4px;
    }

    /* Quick Reply Buttons */
    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .quick-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 13px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .quick-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    /* Typing Indicator */
    .typing-indicator .bubble {
      padding: 12px 18px;
    }

    .bubble.typing {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .bubble.typing span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }

    .bubble.typing span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .bubble.typing span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {

      0%,
      60%,
      100% {
        transform: translateY(0);
      }

      30% {
        transform: translateY(-10px);
      }
    }

    /* Input Form */
    #vc-input {
      display: flex;
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e5e5;
      border-radius: 0 0 12px 12px;
    }

    #vc-text {
      flex: 1;
      border: 1px solid #e5e5e5;
      border-radius: 20px;
      padding: 10px 15px;
      font-size: 14px;
      outline: none;
    }

    #vc-text:focus {
      border-color: #667eea;
    }

    #vc-input button[type="submit"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: 8px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    #vc-input button[type="submit"]:hover {
      transform: scale(1.1);
    }
  </style>
</head>

<body>

  <!-- Chatbot Widget -->
  <div id="vc-launcher">
    <img src="https://api.iconify.design/mdi:paw.svg" alt="Paw Icon" class="launcher-icon">
  </div>

  <div id="vc-chat">
    <div class="vc-header">
      <div class="vc-header-left">
        <img src="https://api.iconify.design/mdi:paw.svg" alt="paw" class="paw-icon">
        <div class="vc-title">
          <div class="assistant-name">Fur-Ever Care</div>
          <div class="status">
            <span class="status-dot"></span>
            <span class="status-text">Online • Ready to help!</span>
          </div>
        </div>
      </div>
      <div class="vc-header-right">
        <button id="vc-minimize" title="Minimize">–</button>
        <button id="vc-close" title="Close">✖</button>
      </div>
    </div>

    <div id="vc-messages"></div>

    <form id="vc-input">
      <input type="text" id="vc-text" placeholder="Type a message..." autocomplete="off">
      <button type="submit" title="Send">➤</button>
    </form>
  </div>

  <script>
    const chat = document.getElementById('vc-chat');
    const launcher = document.getElementById('vc-launcher');
    const closeBtn = document.getElementById('vc-close');
    const minimizeBtn = document.getElementById('vc-minimize');
    const form = document.getElementById('vc-input');
    const input = document.getElementById('vc-text');
    const log = document.getElementById('vc-messages');

    // ✅ Toggle Chat
    launcher.addEventListener('click', () => {
      chat.classList.add("show");
      launcher.style.display = "none";
      if (!chat.dataset.greeted) {
        setTimeout(() => {
          addMessage("👋 I'm your Fur-Ever Care. How can I help?", "bot", ["Clinic Hours", "Appointment", "Location", "Emergency"]);
        }, 500);
        chat.dataset.greeted = "true";
      }
    });

    closeBtn.addEventListener('click', () => {
      chat.classList.remove("show");
      launcher.style.display = "flex";
    });

    minimizeBtn.addEventListener('click', () => {
      chat.classList.remove("show");
      launcher.style.display = "flex";
    });

    // ✅ Add Message
    function addMessage(text, role = 'bot', options = []) {
      const wrap = document.createElement('div');
      wrap.className = `msg ${role}`;

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerText = text;

      const t = document.createElement('div');
      t.className = 'time';
      t.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      bubble.appendChild(t);

      if (role === 'bot' && options.length) {
        const btnWrap = document.createElement('div');
        btnWrap.className = 'quick-replies';
        options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'quick-btn';
          btn.textContent = opt;
          btn.addEventListener('click', () => {
            addMessage(opt, 'user');
            setTimeout(() => {
              const reply = getBotReply(opt);
              botReply(reply.text, reply.options);
            }, 600);
          });
          btnWrap.appendChild(btn);
        });
        bubble.appendChild(btnWrap);
      }

      wrap.appendChild(bubble);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
    }

    // ✅ Typing Indicator
    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'msg bot typing-indicator';
      typing.innerHTML = `
    <div class="bubble typing">
      <span></span><span></span><span></span>
    </div>`;
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;
      return typing;
    }

    // ✅ Bot Reply with Typing
    function botReply(text, options = []) {
      const typingEl = showTyping();
      setTimeout(() => {
        typingEl.remove();
        addMessage(text, 'bot', options);
      }, 1200);
    }

    // ✅ Bot Logic
    function getBotReply(message) {
      const text = message.toLowerCase();
      let reply = {
        text: "🤖 You can ask about hours, appointments, staff, prices, or emergencies.",
        options: ["Clinic Hours", "Appointment", "Location", "Emergency", "Price"]
      };

      if (text.includes("oras") || text.includes("hours") || text.includes("clinic hours")) {
        reply = { text: "🕘 The clinic is open Monday–Saturday, 8AM–5PM.", options: ["Appointment", "Location", "Emergency"] };
      }
      else if (text.includes("saan") || text.includes("location") || text.includes("address")) {
        reply = { text: "📍 We are located at 123 Pet Care Avenue, Veterinary District, VC 12345.", options: ["Clinic Hours", "Appointment", "Emergency"] };
      }
      else if (text.includes("appointment") || text.includes("booking") || text.includes("schedule")) {
        reply = { text: "📅 You can book a check-up, vaccination, grooming, or deworming.", options: ["Clinic Hours", "Staff", "Emergency"] };
      }
      else if (text.includes("emergency") || text.includes("saklolo")) {
        reply = { text: "🚑 For emergencies, call 911 or our hotline: (555) 123-PETS.", options: ["Clinic Hours", "Appointment", "Staff"] };
      }
      else if (text.includes("staff") || text.includes("doctor") || text.includes("nurse")) {
        reply = { text: "👩‍⚕️ Our staff are licensed and ready to help you.", options: ["Clinic Hours", "Appointment", "Emergency"] };
      }
      else if (text.includes("price") || text.includes("bayad") || text.includes("cost") || text.includes("gastos")) {
        reply = { text: "💵 Prices depend on the service. Please contact reception for details.", options: ["Clinic Hours", "Appointment", "Emergency"] };
      }
      else if (text.includes("vaccine") || text.includes("bakuna") || text.includes("vaccination")) {
        reply = { text: "💉 Yes, we provide vaccination services for pets (dogs & cats).", options: ["Clinic Hours", "Appointment", "Emergency"] };
      }
      else if (text.includes("grooming")) {
        reply = { text: "✂️ We provide pet grooming (bath, haircut, nail trim).", options: ["Appointment", "Price", "Emergency"] };
      }
      else if (text.includes("deworming")) {
        reply = { text: "💊 Yes, we provide deworming services for your pets.", options: ["Appointment", "Price", "Emergency"] };
      }
      else if (text.includes("check-up") || text.includes("checkup") || text.includes("consultation")) {
        reply = { text: "👩‍⚕️ You can book a veterinary check-up for your pets.", options: ["Appointment", "Price", "Emergency"] };
      } else {


      }

      return reply;
    }

    // ✅ Manual Input
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, 'user');
      input.value = '';

      setTimeout(() => {
        const reply = getBotReply(text);
        botReply(reply.text, reply.options);
      }, 600);
    });
  </script>

</body>

</html>