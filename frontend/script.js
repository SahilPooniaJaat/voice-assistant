// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
};

// Voice recognition & conversation
const micBtn = document.getElementById('micBtn');
const sendBtn = document.getElementById('sendBtn');
const inputBar = document.getElementById('inputBar');
const conversation = document.getElementById('conversation');
const voiceBars = document.querySelectorAll('.voice-bar');
const suggestions = document.getElementById('suggestions');

// Animate voice bars
function setVoiceWave(active) {
  voiceBars.forEach(bar => {
    if (active) bar.classList.add('active');
    else bar.classList.remove('active');
  });
}

// Add chat bubble
function addBubble(text, type = 'gemini', isTyping = false) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + type;
  if (isTyping) {
    bubble.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
  } else {
    bubble.textContent = text;
  }
  conversation.appendChild(bubble);
  conversation.scrollTop = conversation.scrollHeight;
  return bubble;
}

// Simulate Gemini's creative, proactive response
function simulateGeminiResponse(userText) {
  const responses = [
    `🔎 Here’s what I found for "${userText}":\n- Quick summary\n- Relevant links\n- Want to see an image?`,
    `✨ "${userText}" sounds interesting! Would you like a summary or a quiz?`,
    `📝 I've processed "${userText}". Need anything else?`,
    `🌦️ The weather today is sunny and warm. Anything else I can do?`
  ];
  // Simulate image generation for creative effect
  if (/image|picture|photo/i.test(userText)) {
    return `<img src="https://source.unsplash.com/400x200/?nature,ai" alt="AI generated" style="width:100%;border-radius:12px;margin-bottom:0.5rem;">Here’s an AI-generated image for "${userText}".`;
  }
  return responses[Math.floor(Math.random() * responses.length)];
}

// Handle voice input
micBtn.onclick = () => {
  setVoiceWave(true);
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addBubble('Sorry, your browser does not support speech recognition.', 'gemini');
    setVoiceWave(false);
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  addBubble('Listening...', 'gemini');
  recognition.start();

  recognition.onresult = function(event) {
    setVoiceWave(false);
    const transcript = event.results[0][0].transcript;
    addBubble(transcript, 'user');
    respondGemini(transcript);
  };

  recognition.onerror = function(event) {
    setVoiceWave(false);
    addBubble('Recognition error: ' + event.error, 'gemini');
  };

  recognition.onend = function() {
    setVoiceWave(false);
  };
};

// Handle text input
function handleUserInput(text) {
  if (!text.trim()) return;
  addBubble(text, 'user');
  inputBar.value = '';
  respondGemini(text);
}

// Gemini typing and response
function respondGemini(userText) {
  const typingBubble = addBubble('', 'gemini', true);
  setTimeout(() => {
    let response = simulateGeminiResponse(userText);
    // If response contains an image, use innerHTML
    if (response.startsWith('<img')) {
      typingBubble.innerHTML = response;
    } else {
      typingBubble.textContent = response;
    }
  }, 1200 + Math.random() * 800);
}

// Send button
sendBtn.onclick = () => {
  handleUserInput(inputBar.value);
};

// Enter key
inputBar.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') handleUserInput(inputBar.value);
});

// Suggestions
if (suggestions) {
  suggestions.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      handleUserInput(e.target.textContent);
    }
  });
}
