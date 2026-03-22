/* =========================================
   NovaMind AI — Main Script
   ========================================= */

'use strict';

// ─── State ───────────────────────────────
const state = {
  chats: {},           // { id: { id, title, messages: [] } }
  activeChatId: null,
  isTyping: false,
  showTimestamps: true,
  fontSize: 16,
  theme: 'dark',
  searchQuery: '',
};

// ─── DOM References ───────────────────────
const $ = id => document.getElementById(id);
const sidebar          = $('sidebar');
const sidebarClose     = $('sidebarClose');
const menuToggle       = $('menuToggle');
const newChatBtn       = $('newChatBtn');
const searchInput      = $('searchInput');
const chatList         = $('chatList');
const mainEl           = $('main');
const welcomeScreen    = $('welcomeScreen');
const messagesList     = $('messagesList');
const messagesContainer= $('messagesContainer');
const messageInput     = $('messageInput');
const sendBtn          = $('sendBtn');
const attachBtn        = $('attachBtn');
const voiceBtn         = $('voiceBtn');
const themeToggle      = $('themeToggle');
const settingsBtn      = $('settingsBtn');
const settingsPanel    = $('settingsPanel');
const settingsOverlay  = $('settingsOverlay');
const closeSettings    = $('closeSettings');
const themeToggleSetting = $('themeToggleSetting');
const timestampToggle  = $('timestampToggle');
const fontIncrease     = $('fontIncrease');
const fontDecrease     = $('fontDecrease');
const fontSizeDisplay  = $('fontSizeDisplay');
const clearHistoryBtn  = $('clearHistoryBtn');
const exportBtn        = $('exportBtn');
const toast            = $('toast');

// ─── AI Responses Library ─────────────────
const AI_RESPONSES = {
  greeting: [
    "Hello! I'm NovaMind, your AI assistant. How can I help you today? I'm capable of answering questions, writing code, analyzing text, and much more.",
    "Hey there! Great to meet you. I'm NovaMind — ready to help with anything from complex coding problems to creative writing. What's on your mind?",
    "Hi! I'm here and ready to assist. Whether you need help with a technical problem, want to brainstorm ideas, or just have questions — I've got you covered!",
  ],
  code: [
    `Here's a clean Python implementation for you:\n\n\`\`\`python\ndef sort_objects(items, key):\n    """\n    Sort a list of objects by a given key.\n    \n    Args:\n        items: List of objects/dicts\n        key: Attribute or key to sort by\n    \n    Returns:\n        Sorted list\n    """\n    return sorted(items, key=lambda x: x.get(key) if isinstance(x, dict) else getattr(x, key))\n\n# Example usage\npeople = [\n    {"name": "Alice", "age": 30},\n    {"name": "Bob", "age": 25},\n    {"name": "Charlie", "age": 35}\n]\n\nsorted_people = sort_objects(people, "age")\nprint(sorted_people)  # Sorted by age\n\`\`\`\n\nThis function handles both **dictionaries** and **objects** with attributes. It uses Python's built-in \`sorted()\` with a lambda for the key function, which is both readable and efficient.`,
    `Great question! Here's a JavaScript solution:\n\n\`\`\`javascript\n// Sort array of objects by any key\nconst sortBy = (arr, key, order = 'asc') => {\n  return [...arr].sort((a, b) => {\n    const valA = a[key];\n    const valB = b[key];\n    \n    if (valA < valB) return order === 'asc' ? -1 : 1;\n    if (valA > valB) return order === 'asc' ? 1 : -1;\n    return 0;\n  });\n};\n\n// Usage\nconst users = [\n  { name: 'Alice', score: 95 },\n  { name: 'Bob', score: 87 },\n  { name: 'Charlie', score: 92 }\n];\n\nconsole.log(sortBy(users, 'score', 'desc'));\n// Output: Alice (95), Charlie (92), Bob (87)\n\`\`\`\n\nThis creates a **new sorted array** (non-mutating) and supports both ascending and descending order. The spread operator \`[...arr]\` ensures the original array stays unchanged.`,
  ],
  quantum: [
    `**Quantum computing** is a type of computation that harnesses quantum mechanical phenomena — like *superposition* and *entanglement* — to process information in fundamentally different ways than classical computers.\n\n**Key concepts:**\n\n1. **Qubits** — Unlike classical bits (0 or 1), qubits can exist in a *superposition* of both states simultaneously\n2. **Superposition** — A qubit can be 0 and 1 at the same time until measured\n3. **Entanglement** — Two qubits can be "linked" so measuring one instantly determines the state of the other, regardless of distance\n4. **Interference** — Quantum algorithms use wave-like interference to amplify correct answers and cancel wrong ones\n\n**Why does it matter?**\n\nQuantum computers excel at specific problems classical computers find extremely hard:\n- Breaking/creating cryptographic codes\n- Simulating molecular chemistry for drug discovery\n- Optimization problems (logistics, finance)\n- Machine learning acceleration\n\n> *Think of it this way:* If you needed to find a specific book in a library, a classical computer checks each book one by one. A quantum computer checks all books simultaneously.`,
  ],
  productivity: [
    `Here are the **most effective productivity techniques** backed by research:\n\n**🎯 Deep Work Strategies**\n\n1. **Time Blocking** — Schedule specific blocks of time for focused work. No multitasking.\n2. **Pomodoro Technique** — 25 min focus → 5 min break → repeat 4x → long break\n3. **Eat the Frog** — Tackle your hardest task first thing in the morning\n\n**🧠 Cognitive Techniques**\n\n- **GTD (Getting Things Done)** — Capture everything in a trusted system, then process and act\n- **2-Minute Rule** — If a task takes less than 2 minutes, do it now\n- **Inbox Zero** — Process emails to empty rather than leaving them pending\n\n**⚡ Energy Management**\n\n- Align demanding tasks with your *peak energy hours*\n- Protect your mornings from meetings when possible\n- Use "no meeting" blocks for deep work\n\n**🔧 For Developers Specifically**\n\n\`\`\`\nMorning: Deep work (coding, complex problems)\nAfternoon: Meetings, code reviews, emails  \nEvening: Learning, planning next day\n\`\`\`\n\nThe key insight: **energy management > time management**. Eight focused hours beats twelve distracted ones.`,
  ],
  email: [
    `Here's a professional email to reschedule a meeting:\n\n---\n\n**Subject:** Reschedule Request — [Meeting Name] on [Original Date]\n\nHi [Name],\n\nI hope this message finds you well. I'm writing to request a reschedule for our upcoming meeting on **[Original Date at Time]**.\n\nDue to [brief, professional reason — e.g., *an unexpected scheduling conflict / a prior commitment that has come up*], I'm unfortunately unable to make the original time.\n\nI'd love to find a time that works for both of us. Here are a few alternatives:\n\n- **[Option 1]** — [Day, Date, Time + Timezone]\n- **[Option 2]** — [Day, Date, Time + Timezone]\n- **[Option 3]** — [Day, Date, Time + Timezone]\n\nPlease let me know which works best, or feel free to suggest another time that's more convenient for you.\n\nI apologize for any inconvenience and appreciate your flexibility.\n\nBest regards,\n[Your Name]\n\n---\n\n**Tips for tone:**\n- Keep it brief and professional\n- Offer multiple options to show flexibility\n- Always apologize briefly without over-explaining\n- Respond as early as possible when you know about a conflict`,
  ],
  ml: [
    `**Machine Learning (ML)** is teaching computers to learn from data and improve over time — *without being explicitly programmed for every situation*.\n\n**The simple analogy:**\n\nImagine teaching a child to recognize cats. You don't write rules like "4 legs + pointy ears + whiskers = cat." Instead, you show them thousands of pictures labeled "cat" or "not cat." Eventually, they learn the pattern themselves. ML works the same way.\n\n**Three main types:**\n\n1. **Supervised Learning** — Learning from labeled examples\n   - Input: Email → Output: Spam or Not Spam\n   - Input: Photo → Output: Cat or Dog\n\n2. **Unsupervised Learning** — Finding hidden patterns without labels\n   - Grouping customers by behavior\n   - Detecting anomalies in data\n\n3. **Reinforcement Learning** — Learning through trial and reward\n   - How AlphaGo learned to play Go\n   - How self-driving cars learn to steer\n\n**A simple ML workflow:**\n\n\`\`\`\n1. Collect Data  →  2. Clean Data  →  3. Choose Model\n         ↓\n4. Train Model  →  5. Evaluate  →  6. Deploy\n\`\`\`\n\nML powers things you use daily: Netflix recommendations, Google search, face unlock, spam filters, and voice assistants.`,
  ],
  restgraphql: [
    `Great question! Here's a clear breakdown:\n\n## REST vs GraphQL\n\n**REST (Representational State Transfer)**\n\n- Multiple endpoints: \`/users\`, \`/posts\`, \`/comments\`\n- Fixed data structure per endpoint\n- Often over-fetches (too much data) or under-fetches (too little)\n- Widely adopted, easier to cache\n\n\`\`\`http\nGET /api/users/123\nGET /api/users/123/posts\nGET /api/posts/456/comments\n// 3 requests for related data\n\`\`\`\n\n**GraphQL**\n\n- Single endpoint: \`/graphql\`\n- You request *exactly* the data you need\n- Solves over/under-fetching elegantly\n- Better for complex, nested data\n\n\`\`\`graphql\nquery {\n  user(id: "123") {\n    name\n    posts {\n      title\n      comments {\n        text\n      }\n    }\n  }\n}\n// 1 request for all related data!\n\`\`\`\n\n**When to use which:**\n\n| Scenario | Best Choice |\n|---|---|\n| Simple CRUD API | REST |\n| Complex nested data | GraphQL |\n| Public API | REST |\n| Mobile apps (bandwidth-sensitive) | GraphQL |\n| Team already knows REST | REST |\n| Multiple client types | GraphQL |`,
  ],
  default: [
    "That's a great question! Let me think through this carefully.\n\nBased on what you've shared, I'd approach this by first understanding the core problem, then breaking it down into manageable parts. The key is to focus on what matters most and build from there.\n\nIs there a specific aspect you'd like me to explore in more detail? I'm happy to dive deeper into any part of this.",
    "Interesting! Here's my take on this:\n\nThere are several ways to approach what you're asking. The most important thing is to consider the context and goals. From there, you can make informed decisions that align with your needs.\n\n**Key considerations:**\n1. Start with the fundamentals before adding complexity\n2. Test your assumptions early and often\n3. Keep things simple until simplicity isn't enough\n\nWould you like me to elaborate on any of these points?",
    "Great point! Here's a thoughtful response:\n\nThe topic you've raised is genuinely fascinating. When we dig into it, we find that there are multiple dimensions worth considering — practical, theoretical, and contextual.\n\nAt its core, the answer depends on your specific situation. However, some general principles tend to hold:\n- **Start small** — Build incrementally rather than trying to solve everything at once\n- **Measure progress** — You can't improve what you don't track\n- **Iterate** — Each cycle brings you closer to the optimal solution\n\nLet me know if you want to explore a specific angle!",
    "Absolutely! This is a topic I find quite interesting.\n\nThe short answer is: it depends on your goals and constraints. But here's the nuanced view:\n\nWhen dealing with complex problems, the best approach is often to decompose them into smaller, well-defined pieces. Each piece becomes easier to solve, test, and understand in isolation.\n\nHere's a framework that works well:\n\n1. **Define the problem** clearly\n2. **Identify constraints** (time, budget, technical limits)\n3. **Explore solutions** without judging them initially\n4. **Evaluate** based on your constraints\n5. **Implement** the best fit\n\nDoes this help? Happy to go deeper on any aspect!",
  ],
};

function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  if (/hello|hi |hey |greet|good morning|good evening/i.test(msg)) {
    return AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
  }
  if (/python|javascript|code|function|sort|script|program|array/i.test(msg)) {
    return AI_RESPONSES.code[Math.floor(Math.random() * AI_RESPONSES.code.length)];
  }
  if (/quantum/i.test(msg)) {
    return AI_RESPONSES.quantum[0];
  }
  if (/productivity|productive|technique|focus|work/i.test(msg)) {
    return AI_RESPONSES.productivity[0];
  }
  if (/email|letter|message|write/i.test(msg)) {
    return AI_RESPONSES.email[0];
  }
  if (/machine learning|ml|ai|neural|deep learning|beginner/i.test(msg)) {
    return AI_RESPONSES.ml[0];
  }
  if (/rest|graphql|api/i.test(msg)) {
    return AI_RESPONSES.restgraphql[0];
  }
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
}

// ─── Markdown Parser ──────────────────────
function parseMarkdown(text) {
  let html = text
    // Escape HTML
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Code blocks first (before inline)
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'code';
      const escapedCode = code.trim();
      return `<div class="code-block">
        <div class="code-block-header">
          <span class="code-lang">${language}</span>
          <button class="code-copy-btn" onclick="copyCode(this)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy
          </button>
        </div>
        <pre><code>${escapedCode}</code></pre>
      </div>`;
    })
    // Horizontal rule
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:10px 0">')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding-left:12px;color:var(--text-secondary);margin:6px 0">$1</blockquote>')
    // Unordered lists
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // Single newline
    .replace(/\n/g, '<br>');

  return `<p>${html}</p>`;
}

// ─── Time Formatting ──────────────────────
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Toast ────────────────────────────────
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Generate Chat ID ─────────────────────
function genId() {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ─── Save/Load from localStorage ─────────
function saveState() {
  localStorage.setItem('novamind_chats', JSON.stringify(state.chats));
  localStorage.setItem('novamind_activeChatId', state.activeChatId);
  localStorage.setItem('novamind_theme', state.theme);
  localStorage.setItem('novamind_fontSize', state.fontSize);
  localStorage.setItem('novamind_timestamps', state.showTimestamps);
}

function loadState() {
  const chats = localStorage.getItem('novamind_chats');
  if (chats) state.chats = JSON.parse(chats);

  const active = localStorage.getItem('novamind_activeChatId');
  if (active && state.chats[active]) state.activeChatId = active;

  const theme = localStorage.getItem('novamind_theme');
  if (theme) state.theme = theme;

  const fontSize = localStorage.getItem('novamind_fontSize');
  if (fontSize) state.fontSize = parseInt(fontSize);

  const timestamps = localStorage.getItem('novamind_timestamps');
  if (timestamps !== null) state.showTimestamps = timestamps === 'true';
}

// ─── Theme ────────────────────────────────
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleSetting.checked = theme === 'dark';
  saveState();
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// ─── Font Size ────────────────────────────
function applyFontSize(size) {
  state.fontSize = Math.max(12, Math.min(22, size));
  document.documentElement.style.setProperty('--font-size-msg', state.fontSize + 'px');
  fontSizeDisplay.textContent = state.fontSize + 'px';
  saveState();
}

// ─── Sidebar ──────────────────────────────
function isMobile() { return window.innerWidth < 768; }

function openSidebar() {
  if (isMobile()) {
    sidebar.classList.add('mobile-open');
  } else {
    sidebar.classList.remove('collapsed');
    mainEl.classList.remove('sidebar-hidden');
  }
}

function closeSidebar() {
  if (isMobile()) {
    sidebar.classList.remove('mobile-open');
  } else {
    sidebar.classList.add('collapsed');
    mainEl.classList.add('sidebar-hidden');
  }
}

function toggleSidebar() {
  if (isMobile()) {
    sidebar.classList.contains('mobile-open') ? closeSidebar() : openSidebar();
  } else {
    sidebar.classList.contains('collapsed') ? openSidebar() : closeSidebar();
  }
}

// ─── Chat Management ──────────────────────
function createChat(firstMessage = null) {
  const id = genId();
  const title = firstMessage
    ? firstMessage.slice(0, 42) + (firstMessage.length > 42 ? '…' : '')
    : 'New Chat';
  state.chats[id] = { id, title, messages: [], createdAt: Date.now() };
  state.activeChatId = id;
  saveState();
  renderChatList();
  renderMessages();
  return id;
}

function deleteChat(id) {
  delete state.chats[id];
  if (state.activeChatId === id) {
    const ids = Object.keys(state.chats);
    state.activeChatId = ids.length > 0 ? ids[ids.length - 1] : null;
  }
  saveState();
  renderChatList();
  if (state.activeChatId) {
    renderMessages();
  } else {
    showWelcome();
  }
}

function switchChat(id) {
  state.activeChatId = id;
  saveState();
  renderChatList();
  renderMessages();
  if (isMobile()) closeSidebar();
}

function getCurrentChat() {
  return state.activeChatId ? state.chats[state.activeChatId] : null;
}

// ─── Render Chat List ─────────────────────
function renderChatList() {
  const query = state.searchQuery.toLowerCase();
  const chats = Object.values(state.chats)
    .filter(c => !query || c.title.toLowerCase().includes(query))
    .sort((a, b) => b.createdAt - a.createdAt);

  if (chats.length === 0) {
    chatList.innerHTML = `<div class="chat-list-empty">${query ? 'No chats found' : 'No chats yet'}</div>`;
    return;
  }

  chatList.innerHTML = chats.map(chat => `
    <div class="chat-item ${chat.id === state.activeChatId ? 'active' : ''}" data-id="${chat.id}">
      <svg class="chat-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="chat-item-text">${escapeHTML(chat.title)}</span>
      <button class="chat-item-delete" data-id="${chat.id}" title="Delete chat">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `).join('');

  // Click events
  chatList.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', e => {
      if (!e.target.closest('.chat-item-delete')) {
        switchChat(item.dataset.id);
      }
    });
  });

  chatList.querySelectorAll('.chat-item-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteChat(btn.dataset.id);
    });
  });
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Welcome Screen ───────────────────────
function showWelcome() {
  welcomeScreen.style.display = 'flex';
  messagesList.innerHTML = '';
}

// ─── Render Messages ──────────────────────
function renderMessages() {
  const chat = getCurrentChat();
  if (!chat || chat.messages.length === 0) {
    showWelcome();
    return;
  }

  welcomeScreen.style.display = 'none';
  messagesList.innerHTML = chat.messages.map(msg => buildMessageHTML(msg)).join('');

  // Add regenerate button to last AI message
  const aiMessages = messagesList.querySelectorAll('.ai-message');
  if (aiMessages.length > 0) {
    const lastAI = aiMessages[aiMessages.length - 1];
    const meta = lastAI.querySelector('.message-meta');
    if (meta && !lastAI.querySelector('.regenerate-btn')) {
      const regenBtn = document.createElement('button');
      regenBtn.className = 'regenerate-btn';
      regenBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.25"></path></svg> Regenerate`;
      regenBtn.addEventListener('click', regenerateLastResponse);
      meta.appendChild(regenBtn);
    }
  }

  scrollToBottom();
}

function buildMessageHTML(msg) {
  const isUser = msg.role === 'user';
  const content = isUser ? `<div class="msg-content">${escapeHTML(msg.content).replace(/\n/g,'<br>')}</div>`
                         : `<div class="msg-content">${parseMarkdown(msg.content)}</div>`;
  return `
    <div class="message ${isUser ? 'user-message' : 'ai-message'}" data-id="${msg.id}">
      <div class="message-avatar">${isUser ? 'U' : 'N'}</div>
      <div class="message-body">
        <div class="message-bubble">${content}</div>
        <div class="message-meta">
          ${state.showTimestamps ? `<span class="message-time">${formatTime(msg.timestamp)}</span>` : ''}
          <div class="message-actions">
            <button class="msg-action-btn" title="Copy" onclick="copyMessage(this)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

// ─── Send Message ─────────────────────────
function sendMessage(text) {
  if (!text.trim() || state.isTyping) return;
  text = text.trim();

  // Create chat if none
  if (!state.activeChatId) {
    createChat(text);
  }

  const chat = getCurrentChat();
  chat.title = text.slice(0, 42) + (text.length > 42 ? '…' : '');

  // Add user message
  const userMsg = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
  chat.messages.push(userMsg);
  saveState();

  welcomeScreen.style.display = 'none';

  // Append user message
  const userEl = document.createElement('div');
  userEl.innerHTML = buildMessageHTML(userMsg);
  messagesList.appendChild(userEl.firstElementChild);
  scrollToBottom();

  // Show typing + skeleton
  showTyping();

  // Simulate AI response
  const delay = 800 + Math.random() * 1200;
  setTimeout(() => {
    hideTyping();
    const aiContent = getAIResponse(text);
    const aiMsg = { id: genId(), role: 'assistant', content: aiContent, timestamp: Date.now() };
    chat.messages.push(aiMsg);
    saveState();

    const aiEl = document.createElement('div');
    aiEl.innerHTML = buildMessageHTML(aiMsg);
    const aiNode = aiEl.firstElementChild;
    messagesList.appendChild(aiNode);

    // Add regenerate button
    const meta = aiNode.querySelector('.message-meta');
    const regenBtn = document.createElement('button');
    regenBtn.className = 'regenerate-btn';
    regenBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.25"></path></svg> Regenerate`;
    regenBtn.addEventListener('click', regenerateLastResponse);
    if (meta) meta.appendChild(regenBtn);

    scrollToBottom();
    renderChatList();
  }, delay);

  messageInput.value = '';
  updateSendBtn();
  adjustTextarea();
}

// ─── Typing Indicator ─────────────────────
let typingEl = null;

function showTyping() {
  state.isTyping = true;
  sendBtn.disabled = true;

  typingEl = document.createElement('div');
  typingEl.className = 'message ai-message';
  typingEl.id = 'typing-indicator-msg';
  typingEl.innerHTML = `
    <div class="message-avatar">N</div>
    <div class="message-body">
      <div class="skeleton-block">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
      <div style="margin-top:8px">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>`;
  messagesList.appendChild(typingEl);
  scrollToBottom();
}

function hideTyping() {
  state.isTyping = false;
  updateSendBtn();
  if (typingEl) { typingEl.remove(); typingEl = null; }
}

// ─── Regenerate ───────────────────────────
function regenerateLastResponse() {
  const chat = getCurrentChat();
  if (!chat || chat.messages.length === 0) return;

  // Remove last AI message
  const lastAI = chat.messages.findLastIndex(m => m.role === 'assistant');
  if (lastAI === -1) return;
  chat.messages.splice(lastAI, 1);
  saveState();

  // Remove from DOM
  const aiNodes = messagesList.querySelectorAll('.ai-message');
  if (aiNodes.length > 0) aiNodes[aiNodes.length - 1].remove();

  // Get last user message
  const lastUser = [...chat.messages].reverse().find(m => m.role === 'user');
  if (!lastUser) return;

  showTyping();
  const delay = 700 + Math.random() * 1000;
  setTimeout(() => {
    hideTyping();
    const aiContent = getAIResponse(lastUser.content);
    const aiMsg = { id: genId(), role: 'assistant', content: aiContent, timestamp: Date.now() };
    chat.messages.push(aiMsg);
    saveState();

    const aiEl = document.createElement('div');
    aiEl.innerHTML = buildMessageHTML(aiMsg);
    const aiNode = aiEl.firstElementChild;
    messagesList.appendChild(aiNode);

    const meta = aiNode.querySelector('.message-meta');
    const regenBtn = document.createElement('button');
    regenBtn.className = 'regenerate-btn';
    regenBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.25"></path></svg> Regenerate`;
    regenBtn.addEventListener('click', regenerateLastResponse);
    if (meta) meta.appendChild(regenBtn);

    scrollToBottom();
    showToast('Response regenerated');
  }, delay);
}

// ─── Copy Helpers ─────────────────────────
window.copyMessage = function(btn) {
  const bubble = btn.closest('.message-body').querySelector('.message-bubble');
  const text = bubble.innerText || bubble.textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
};

window.copyCode = function(btn) {
  const code = btn.closest('.code-block').querySelector('pre code');
  navigator.clipboard.writeText(code.innerText || code.textContent).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
    }, 2000);
  });
};

// ─── Scroll to Bottom ─────────────────────
function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

// ─── Input Helpers ────────────────────────
function updateSendBtn() {
  sendBtn.disabled = !messageInput.value.trim() || state.isTyping;
}

function adjustTextarea() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 180) + 'px';
}

// ─── Export Chat ──────────────────────────
function exportChat() {
  const chat = getCurrentChat();
  if (!chat || chat.messages.length === 0) {
    showToast('No messages to export');
    return;
  }

  const lines = [`NovaMind AI — Chat Export\n`, `"${chat.title}"\n`, `Exported: ${new Date().toLocaleString()}\n`, '─'.repeat(50) + '\n'];
  chat.messages.forEach(msg => {
    const role = msg.role === 'user' ? 'You' : 'NovaMind';
    const time = formatTime(msg.timestamp);
    lines.push(`[${time}] ${role}:\n${msg.content}\n`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `novamind-chat-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Chat exported!');
}

// ─── Settings Panel ───────────────────────
function openSettings() {
  settingsPanel.classList.add('open');
  settingsOverlay.classList.add('visible');
}

function closeSettingsPanel() {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('visible');
}

// ─── Event Listeners ──────────────────────
// Sidebar
menuToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);

// New Chat
newChatBtn.addEventListener('click', () => {
  createChat();
  showWelcome();
  if (isMobile()) closeSidebar();
  messageInput.focus();
});

// Search
searchInput.addEventListener('input', () => {
  state.searchQuery = searchInput.value;
  renderChatList();
});

// Input
messageInput.addEventListener('input', () => {
  updateSendBtn();
  adjustTextarea();
});

messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) sendMessage(messageInput.value);
  }
});

sendBtn.addEventListener('click', () => {
  sendMessage(messageInput.value);
  messageInput.focus();
});

// Suggestion chips
welcomeScreen.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) {
    messageInput.value = chip.dataset.prompt;
    updateSendBtn();
    adjustTextarea();
    messageInput.focus();
    sendMessage(chip.dataset.prompt);
  }
});

// Attach button (UI only)
attachBtn.addEventListener('click', () => showToast('File attachment coming soon!'));

// Voice button (UI only)
voiceBtn.addEventListener('click', () => showToast('Voice input coming soon!'));

// Theme
themeToggle.addEventListener('click', toggleTheme);
themeToggleSetting.addEventListener('change', () => {
  applyTheme(themeToggleSetting.checked ? 'dark' : 'light');
});

// Timestamps
timestampToggle.addEventListener('change', () => {
  state.showTimestamps = timestampToggle.checked;
  saveState();
  renderMessages();
});

// Font size
fontIncrease.addEventListener('click', () => applyFontSize(state.fontSize + 1));
fontDecrease.addEventListener('click', () => applyFontSize(state.fontSize - 1));

// Settings panel
settingsBtn.addEventListener('click', openSettings);
closeSettings.addEventListener('click', closeSettingsPanel);
settingsOverlay.addEventListener('click', closeSettingsPanel);

// Export
exportBtn.addEventListener('click', exportChat);

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
    state.chats = {};
    state.activeChatId = null;
    saveState();
    renderChatList();
    showWelcome();
    closeSettingsPanel();
    showToast('All chats cleared');
  }
});

// Close sidebar on mobile overlay click
document.addEventListener('click', e => {
  if (isMobile() && sidebar.classList.contains('mobile-open')) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  }
});

// Resize handler
window.addEventListener('resize', () => {
  if (!isMobile()) {
    sidebar.classList.remove('mobile-open');
  }
});

// ─── Init ─────────────────────────────────
function init() {
  loadState();

  // Apply saved settings
  applyTheme(state.theme);
  applyFontSize(state.fontSize);
  timestampToggle.checked = state.showTimestamps;
  themeToggleSetting.checked = state.theme === 'dark';

  // Render chat list
  renderChatList();

  // Show active chat or welcome
  if (state.activeChatId && state.chats[state.activeChatId]) {
    renderMessages();
  } else {
    showWelcome();
  }

  // Focus input
  messageInput.focus();
}

init();
