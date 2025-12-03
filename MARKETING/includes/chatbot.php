<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fur-Ever Care Chatbot</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

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
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
      word-wrap: break-word;
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
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

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

    #vc-input button[type="submit"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>

<body>

  <div id="vc-launcher">
    <img src="https://api.iconify.design/mdi:paw.svg" alt="Paw Icon" class="launcher-icon">
  </div>

  <div id="vc-chat">
    <div class="vc-header">
      <div class="vc-header-left">
        <img src="https://api.iconify.design/mdi:paw.svg" alt="paw" class="paw-icon">
        <div class="vc-title">
          <div class="assistant-name">Fur-Ever Care AI</div>
          <div class="status">
            <span class="status-dot"></span>
            <span class="status-text">Online • Gemini Powered</span>
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
    const submitBtn = form.querySelector('button[type="submit"]');

    let conversationHistory = [];

    launcher.addEventListener('click', () => {
      chat.classList.add("show");
      launcher.style.display = "none";
      if (!chat.dataset.greeted) {
        setTimeout(() => {
          addMessage("👋 Hi! I'm your AI-powered veterinary assistant for Fur-Ever Care. Ask me anything about pet care, our services, or clinic info!", "bot", ["Clinic Hours", "Services", "Pet Care Tips", "Emergency"]);
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

    function addMessage(text, role = 'bot', options = []) {
      const wrap = document.createElement('div');
      wrap.className = `msg ${role}`;

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = text;

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
          btn.addEventListener('click', async () => {
            addMessage(opt, 'user');
            await getAIReply(opt);
          });
          btnWrap.appendChild(btn);
        });
        bubble.appendChild(btnWrap);
      }

      wrap.appendChild(bubble);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'msg bot typing-indicator';
      typing.innerHTML = `<div class="bubble typing"><span></span><span></span><span></span></div>`;
      log.appendChild(typing);
      log.scrollTop = log.scrollHeight;
      return typing;
    }

    async function getAIReply(userMessage) {
      const typingEl = showTyping();
      submitBtn.disabled = true;

      try {
        const systemPrompt = `You are a helpful and friendly veterinary assistant for "Fur-Ever Care" clinic.

CLINIC INFO:
- Hours: Monday–Saturday, 8AM–5PM
- Location: 123 Pet Care Avenue, VC 12345
- Emergency: (555) 123-PETS
- Services: Check-ups, Vaccinations, Grooming, Deworming
- Appointment Booking: http://localhost:5173/login    // ✅ DITO KO NILAGAY

IMPORTANT INSTRUCTIONS:                                 // ✅ AT DITO
- Keep responses under 100 words, friendly, and helpful
- For emergencies, recommend calling the hotline immediately
- If the patient wants to schedule/book an appointment, provide this link: http://localhost:5173/login
- Format the link as a clickable HTML link: <a href="http://localhost:5173/login" target="_blank" style="color: #667eea; text-decoration: underline;">Click here to book an appointment</a>
- Always mention they can book online when discussing appointments`;

        // Call YOUR PHP proxy file
        const response = await fetch('gemini-proxy.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            systemPrompt: systemPrompt,
            history: conversationHistory
          })
        });

        // Get raw text first to see what's wrong
        const rawText = await response.text();
        console.log('Raw PHP Response:', rawText);

        // Try to parse JSON
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response text:', rawText);
          throw new Error('Invalid JSON response from server');
        }

        if (data.success && data.reply) {
          conversationHistory.push({ role: 'user', content: userMessage });
          conversationHistory.push({ role: 'assistant', content: data.reply });

          if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
          }

          typingEl.remove();
          addMessage(data.reply, 'bot', ["Ask Another", "Clinic Hours", "Emergency"]);
        } else {
          throw new Error(data.error || "No response from AI");
        }

      } catch (error) {
        console.error("AI Error:", error);
        typingEl.remove();
        addMessage("Sorry, I'm having trouble connecting. 😔 Check console (F12) for details.", "bot", ["Clinic Hours", "Services", "Emergency"]);
      } finally {
        submitBtn.disabled = false;
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      
      addMessage(text, 'user');
      input.value = '';
      await getAIReply(text);
    });
  </script>

</body>
</html>

<!-- 
===============================================
CREATE THIS PHP FILE: gemini-proxy.php
===============================================
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$apiKey = 'AIzaSyChYap9dcHbsEHZw9LRNhZDNHmCPPx4CMg';
$input = json_decode(file_get_contents('php://input'), true);

$message = $input['message'] ?? '';
$systemPrompt = $input['systemPrompt'] ?? '';
$history = $input['history'] ?? [];

// Build conversation context
$context = '';
foreach ($history as $msg) {
    $role = $msg['role'] === 'user' ? 'User' : 'Assistant';
    $context .= "$role: {$msg['content']}\n";
}

$fullPrompt = $systemPrompt . "\n\n" . $context . "User: " . $message;

$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $fullPrompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.7,
        'maxOutputTokens' => 500
    ]
];

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" . $apiKey);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($result, true);
    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
        echo json_encode([
            'success' => true,
            'reply' => $data['candidates'][0]['content']['parts'][0]['text']
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No response from AI']);
    }
} else {
    echo json_encode(['success' => false, 'error' => "API Error: $httpCode", 'details' => $result]);
}
?>
===============================================
-->