// --- Mock data for conversations ---
const conversations = [
    {
        id: "alice",
        name: "Alice",
        initials: "AL",
        status: "Online • Practicing JS",
        lastSeen: "Now",
        unread: 2,
        messages: [
            { from: "them", text: "Hey! Ready to practice some JS? 😊", time: "10:21" },
            {
                from: "me",
                text: "Yeah! I'm building a chat UI with HTML/CSS/JS.",
                time: "10:22",
            },
            {
                from: "them",
                text: "Nice. No backend needed — just mock the data.",
                time: "10:23",
            },
        ],
    },
    {
        id: "mentor",
        name: "Mentor Bot",
        initials: "MB",
        status: "Last seen 2h ago",
        lastSeen: "2h",
        unread: 0,
        messages: [
            {
                from: "them",
                text: "Tip: Keep your JS simple first, then refactor.",
                time: "08:01",
            },
            {
                from: "them",
                text: "Try separating data (conversations) from DOM logic.",
                time: "08:02",
            },
        ],
    },
    {
        id: "notes",
        name: "Coding Notes",
        initials: "CN",
        status: "Pinned • Personal",
        lastSeen: "Yesterday",
        unread: 3,
        messages: [
            {
                from: "me",
                text: "• TODO: add localStorage\n• TODO: basic search filter\n• TODO: message timestamps",
                time: "21:11",
            },
            {
                from: "them",
                text: "You can also log events to the console while testing.",
                time: "21:12",
            },
        ],
    },
];

let activeConversation = conversations[0].id;

const chatListEl = document.getElementById("chatList");
const messagesEl = document.getElementById("messages");
const messageInputEl = document.getElementById("messageInput");
const sendBtnEl = document.getElementById("sendBtn");
const themeToggleEl = document.getElementById("themeToggle");

const activeNameEl = document.getElementById("activeName");
const activeStatusEl = document.getElementById("activeStatus");
const activeMetaEl = document.getElementById("activeMeta");
const activeAvatarEl = document.getElementById("activeAvatar");

// --- Helper: get conversation by id ---
function getConversation(id) {
    return conversations.find((c) => c.id === id);
}

// --- Render chat list in sidebar ---
function renderChatList() {
    chatListEl.innerHTML = "";
    conversations.forEach((conv) => {
        const item = document.createElement("div");
        item.className = "chat-item";
        if (conv.id === activeConversation) item.classList.add("active");
        item.dataset.id = conv.id;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = conv.initials;

        const textWrap = document.createElement("div");
        textWrap.className = "chat-item-text";

        const nameEl = document.createElement("div");
        nameEl.className = "chat-name";
        nameEl.textContent = conv.name;

        const lastMsgEl = document.createElement("div");
        lastMsgEl.className = "chat-last-msg";
        const lastMsg = conv.messages[conv.messages.length - 1];
        lastMsgEl.textContent = lastMsg ? lastMsg.text : "No messages yet";

        textWrap.appendChild(nameEl);
        textWrap.appendChild(lastMsgEl);

        const meta = document.createElement("div");
        meta.className = "chat-meta";
        meta.innerHTML = `<div>${conv.lastSeen}</div>`;
        if (conv.unread && conv.unread > 0) {
            const unread = document.createElement("div");
            unread.className = "chat-unread";
            unread.textContent = conv.unread;
            meta.appendChild(unread);
        }

        item.appendChild(avatar);
        item.appendChild(textWrap);
        item.appendChild(meta);

        item.addEventListener("click", () => {
            activeConversation = conv.id;
            conv.unread = 0; // mark as read
            renderChatList();
            renderActiveConversation();
        });

        chatListEl.appendChild(item);
    });
}

// --- Render messages for active conversation ---
function renderActiveConversation() {
    const conv = getConversation(activeConversation);
    if (!conv) return;

    // Update header
    activeNameEl.textContent = conv.name;
    activeStatusEl.textContent = conv.status;
    activeMetaEl.textContent = `Mock thread: ${conv.id}`;
    activeAvatarEl.textContent = conv.initials;

    messagesEl.innerHTML = "";

    // Optional: day divider (just a demo)
    const divider = document.createElement("div");
    divider.className = "day-divider";
    divider.textContent = "Today";
    messagesEl.appendChild(divider);

    conv.messages.forEach((msg) => {
        const row = document.createElement("div");
        row.className = "message-row " + (msg.from === "me" ? "me" : "them");

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = msg.text;

        const meta = document.createElement("div");
        meta.className = "message-meta";
        meta.textContent = msg.time || "";

        bubble.appendChild(meta);
        row.appendChild(bubble);
        messagesEl.appendChild(row);
    });

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// --- Send message ---
function sendMessage() {
    const text = messageInputEl.value.trim();
    if (!text) return;

    const conv = getConversation(activeConversation);
    if (!conv) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    conv.messages.push({
        from: "me",
        text,
        time,
    });

    messageInputEl.value = "";
    renderActiveConversation();

    // Fake auto-reply after 1 second
    setTimeout(() => {
        const replyText = createAutoReply(text);
        conv.messages.push({
            from: "them",
            text: replyText,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        });
        renderActiveConversation();
    }, 1000);
}

// --- Simple auto-reply logic (for fun) ---
function createAutoReply(userText) {
    const lowered = userText.toLowerCase();
    if (lowered.includes("html"))
        return "HTML is your structure. CSS is your style. JS is the behavior ✨";
    if (lowered.includes("css"))
        return "Try using flexbox or grid to lay out your chat UI.";
    if (lowered.includes("js") || lowered.includes("java"))
        return "Keep functions small and focused. Log things while you debug.";
    if (lowered.includes("help"))
        return "What part feels confusing right now? Break it into tiny steps.";
    return "Nice. Log this in the console so you can see your events in action.";
}

// --- Event listeners ---
sendBtnEl.addEventListener("click", sendMessage);

messageInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Theme toggle
themeToggleEl.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// Initial render
renderChatList();
renderActiveConversation();
