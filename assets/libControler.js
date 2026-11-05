const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
const indicator = document.getElementById('currentSlideNum');
const totalSlideNum = document.getElementById('totalSlideNum');
const headerSubtitle = document.getElementById('headerSubtitle');
const tocModal = document.getElementById('tocModal');
const tocList = document.getElementById('tocList');
const teacherNotesDrawer = document.getElementById('teacherNotesDrawer');
const noteSlideTitle = document.getElementById('noteSlideTitle');
const noteContent = document.getElementById('noteContent');
const noteQuestionPrompt = document.getElementById('noteQuestionPrompt');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

let currentIndex = 0;
const totalSlides = slides.length;
if (totalSlideNum) totalSlideNum.textContent = totalSlides;

function updateTeacherNotesContent() {
    const currentSlide = slides[currentIndex];
    if (!currentSlide) return;

    const title = currentSlide.dataset.title || `Slide ${currentIndex + 1}`;
    if (noteSlideTitle) noteSlideTitle.textContent = title;
    if (noteContent) {
        noteContent.textContent = currentSlide.dataset.notes || 'Apresente os conceitos principais deste slide e confirme se a turma acompanhou antes de avançar.';
    }
    if (noteQuestionPrompt) {
        noteQuestionPrompt.innerHTML = `<strong>Pergunta para a turma:</strong> O que deste slide você aplicaria em um projeto real?`;
    }
}

function populateToc() {
    if (!tocList) return;

    tocList.innerHTML = '';
    slides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-xs text-slate-700';
        button.textContent = `${String(index + 1).padStart(2, '0')} — ${slide.dataset.title || `Slide ${index + 1}`}`;
        button.addEventListener('click', () => goToSlide(index));
        tocList.appendChild(button);
    });
}

function toggleTocModal() {
    if (tocModal) tocModal.classList.toggle('hidden');
}

function toggleTeacherNotes() {
    if (teacherNotesDrawer) teacherNotesDrawer.classList.toggle('translate-x-full');
}

function updatePresentation() {
    if (totalSlides === 0) return;

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentIndex);
    });

    const currentSlide = slides[currentIndex];
    const progressPercent = ((currentIndex + 1) / totalSlides) * 100;

    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (indicator) indicator.textContent = currentIndex + 1;
    if (headerSubtitle && currentSlide) {
        headerSubtitle.textContent = `${currentSlide.dataset.module || ''} — ${currentSlide.dataset.title || ''}`;
    }

    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) {
        btnNext.innerHTML = currentIndex === totalSlides - 1 ? '<span>Reiniciar</span> <span aria-hidden="true">↻</span>' : '<span>Próximo</span> <span aria-hidden="true">❯</span>';
    }

    updateTeacherNotesContent();
}

function nextSlide() {
    // Correção aplicada aqui (totalSlides - 1)
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updatePresentation();
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updatePresentation();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => { });
    } else {
        document.exitFullscreen?.().catch(() => { });
    }
}

function toggleFullScreen() {
    toggleFullscreen();
}

// --- INTEGRAÇÃO COM WEBSOCKET E BOTÕES ---
// const WS_URL = 'ws://localhost:3000';
const WS_URL = 'wss://ws.you.tec.br';
const connectionStatus = document.getElementById('connection-status');
const statusText = document.getElementById('status-text');

let socket;
let reconnectTimer;

function connectWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
        if (connectionStatus) {
            connectionStatus.innerText = 'Online (WebSocket)';
            connectionStatus.className = 'text-xs text-emerald-400 mt-1 font-medium';
        }
    };

    socket.onmessage = (event) => {
        try {
            // const data = JSON.parse(event.data);
            const data = JSON.parse(event.data);
            console.log('Objeto JSON bruto recebido no cliente:', data); // <-- Adicione isso

            if (statusText) statusText.innerText = data.message || 'Comando recebido!';

            // Verifique se a ação corresponde exatamente às strings esperadas
            const action = data.action ? data.action.toLowerCase().trim() : '';

            if (action === 'forward') { console.log('Próximo slide.'); nextSlide(); }
            if (action === 'back') { console.log('Slide anterior.'); prevSlide(); }
            if (action === 'refresh') { console.log('Atualizando página.'); location.reload(); }
        } catch (e) {
            console.error('Erro ao analisar JSON do WebSocket:', e);
            if (statusText) statusText.innerText = event.data;
        }
    };
    socket.onerror = () => {
        if (connectionStatus) {
            connectionStatus.innerText = 'Erro na conexão WS';
            connectionStatus.className = 'text-xs text-rose-400 mt-1 font-medium';
        }
    };

    socket.onclose = () => {
        if (connectionStatus) {
            connectionStatus.innerText = 'Desconectado - Reconectando...';
            connectionStatus.className = 'text-xs text-amber-400 mt-1 font-medium';
        }
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connectWebSocket, 3000);
    };
}

// Inicializa o WebSocket
connectWebSocket();

// Event Listeners dos botões da interface mobile
document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');

        if (action === 'forward') nextSlide();
        if (action === 'back') prevSlide();
        if (action === 'refresh') location.reload();
        if (action === 'audio') {
            if (statusText) statusText.innerText = 'Áudio/Silêncio alternado.';
        }

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                action: action,
                timestamp: new Date().toISOString()
            }));
        }
    });
});

// Atalhos de teclado
window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key.toLowerCase() === 'n' || e.key.toLowerCase() === 'p') {
        toggleTeacherNotes();
    } else if (e.key.toLowerCase() === 'm') {
        toggleTocModal();
    } else if (e.key.toLowerCase() === 'f') {
        toggleFullScreen();
    }
});

// Inicia apresentação
populateToc();
updatePresentation();