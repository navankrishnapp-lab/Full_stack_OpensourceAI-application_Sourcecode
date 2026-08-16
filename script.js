let activePendingFile = null;

// ==========================================================================
// 1. SPECIFIED SPECIFIC ACCESSIBILITY SHORTCUT & TAB-LOOP ENFORCER
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    const primaryHeader = document.querySelector('.logo-area h1');
    if (primaryHeader) {
        primaryHeader.focus();
    }
});

document.addEventListener('keydown', function(e) {
    const primaryTitle = document.querySelector('.logo-area h1');
    const sendBtn = document.getElementById('sendBtn');

    // Tab Loop Core Enforcer Logic
    if (e.key === 'Tab') {
        // Shift + Tab from Title resets focus backward onto the Send Button
        if (e.shiftKey && document.activeElement === primaryTitle) {
            e.preventDefault();
            sendBtn.focus();
        } 
        // Standard Tab from Send Button cycles focus cleanly back up to the Title
        else if (!e.shiftKey && document.activeElement === sendBtn) {
            e.preventDefault();
            primaryTitle.focus();
        }
    }

    // Traditional Alt Shortcut Commands
    if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault(); e.stopPropagation();
        document.getElementById('newChatBtn').click();
    }
    if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault(); e.stopPropagation();
        const copyButtons = document.querySelectorAll('.copy-btn');
        if(copyButtons.length > 0) copyButtons[copyButtons.length - 1].click();
    }
    if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault(); e.stopPropagation();
        const speakButtons = document.querySelectorAll('.speak-btn');
        if(speakButtons.length > 0) speakButtons[speakButtons.length - 1].click();
    }
    if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault(); e.stopPropagation();
        document.getElementById('attachBtn').click();
    }
    if (e.altKey && e.key.toLowerCase() === 'i') {
        e.preventDefault(); e.stopPropagation();
        document.getElementById('userInput').focus();
    }
});

// ==========================================================================
// 2. TEXT PARSING & TTS SCRUBBING LAYER
// ==========================================================================
function cleanMarkdownSymbols(rawText) {
    if (!rawText) return "";
    let clean = rawText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '');
    clean = clean.replace(/\*\*/g, ''); 
    clean = clean.replace(/\*/g, '');
    clean = clean.replace(/__/g, '');
    clean = clean.replace(/_/g, '');
    clean = clean.replace(/`/g, '');
    clean = clean.replace(/^\s*#+\s+/gm, ''); 
    clean = clean.replace(/^\s*-\s+/gm, '');
    return clean.trim();
}

function speakResponse(rawResponseText) {
    window.speechSynthesis.cancel();
    const processedText = cleanMarkdownSymbols(rawResponseText);
    const utterance = new SpeechSynthesisUtterance(processedText);
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => v.name.includes("Microsoft") || v.name.includes("Natural"));
    if (optimalVoice) utterance.voice = optimalVoice;
    window.speechSynthesis.speak(utterance);
}

// ==========================================================================
// 3. CORE FRONTEND LOGIC & DOM COUPLINGS
// ==========================================================================
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const attachBtn = document.getElementById('attachBtn');
const fileAttachment = document.getElementById('fileAttachment');
const newChatBtn = document.getElementById('newChatBtn');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const previewFileName = document.getElementById('previewFileName');
const removeFileBtn = document.getElementById('removeFileBtn');

userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);
attachBtn.addEventListener('click', () => fileAttachment.click());

fileAttachment.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    activePendingFile = file;
    previewFileName.textContent = file.name;
    filePreviewContainer.style.display = 'flex';
    userInput.focus();
});

removeFileBtn.addEventListener('click', clearPendingFileState);

function clearPendingFileState() {
    activePendingFile = null;
    fileAttachment.value = '';
    filePreviewContainer.style.display = 'none';
}

newChatBtn.addEventListener('click', async () => {
    chatWindow.innerHTML = '';
    clearPendingFileState();
    userInput.focus();
    
    try {
        await fetch('http://127.0.0.1:8000/reset', { method: 'POST' });
    } catch (e) {
        console.log("Memory wipe routine timed out:", e);
    }
});

function appendMessage(text, isUser, attachedFileName = null) {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isUser ? 'user-message' : 'ai-message'}`;
    
    if (!isUser) {
        bubble.setAttribute('aria-live', 'assertive');
        bubble.setAttribute('role', 'alert');
    } else {
        bubble.setAttribute('tabindex', '-1');
    }
    
    const visuallyCleanedText = cleanMarkdownSymbols(text);

    if (isUser) {
        if (attachedFileName) {
            const docBadge = document.createElement('div');
            docBadge.style.background = 'rgba(0, 119, 255, 0.15)';
            docBadge.style.border = '1px solid rgba(0, 243, 255, 0.2)';
            docBadge.style.padding = '6px 10px';
            docBadge.style.borderRadius = '6px';
            docBadge.style.marginBottom = '8px';
            docBadge.style.fontSize = '0.9rem';
            docBadge.style.display = 'inline-block';
            docBadge.textContent = `📄 Attached: ${attachedFileName}`;
            bubble.appendChild(docBadge);
            bubble.appendChild(document.createElement('br'));
        }
        bubble.appendChild(document.createTextNode(visuallyCleanedText));
    } else {
        const textContainer = document.createElement('div');
        textContainer.className = 'ai-response-text';
        textContainer.innerHTML = visuallyCleanedText.replace(/\n/g, '<br>');
        bubble.appendChild(textContainer);

        const actionRow = document.createElement('div');
        actionRow.className = 'action-row';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn copy-btn';
        copyBtn.setAttribute('title', 'Copy Text (Alt+C)');
        copyBtn.innerHTML = `<svg class="futuristic-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        copyBtn.addEventListener('click', () => navigator.clipboard.writeText(visuallyCleanedText));

        const speakBtn = document.createElement('button');
        speakBtn.className = 'action-btn speak-btn';
        speakBtn.setAttribute('title', 'Read Aloud (Alt+R)');
        speakBtn.innerHTML = `<svg class="futuristic-icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
        speakBtn.addEventListener('click', () => speakResponse(visuallyCleanedText));

        actionRow.appendChild(copyBtn);
        actionRow.appendChild(speakBtn);
        bubble.appendChild(actionRow);
    }

    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message && !activePendingFile) return;

    let attachedName = null;
    if (activePendingFile) {
        attachedName = activePendingFile.name;
        const formData = new FormData();
        formData.append('file', activePendingFile);
        clearPendingFileState();

        try {
            await fetch('http://127.0.0.1:8000/upload', { method: 'POST', body: formData });
        } catch (err) {
            appendMessage("Failed to successfully transmit file content nodes to app engine.", false);
            return;
        }
    }

    appendMessage(message || `Analyzing Document Content Node...`, true, attachedName);
    userInput.value = '';
    userInput.style.height = '26px';

    try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message || "Provide an overall detailed layout summary overview explanation of this document data." })
        });
        const data = await response.json();
        appendMessage(data.response, false);
    } catch (err) {
        appendMessage("System communication failure. Ensure local app engine server pipeline is active.", false);
    }
}

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}