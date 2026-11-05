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

const aula3QuizQuestions = [
    {
        question: 'Qual SGBD é autocontido, não necessita de servidor rodando em segundo plano e armazena toda a base em um único arquivo local?',
        options: ['SQLite', 'MySQL', 'PostgreSQL', 'Oracle Database'],
        answer: 0,
        explanation: 'O SQLite funciona como uma biblioteca embutida e grava a base em um arquivo local.'
    },
    {
        question: 'Quais são as portas padrão mais conhecidas do MySQL e do PostgreSQL?',
        options: ['MySQL 5432 e PostgreSQL 3306', 'MySQL 3306 e PostgreSQL 5432', 'MySQL 1521 e PostgreSQL 3306', 'MySQL 80 e PostgreSQL 443'],
        answer: 1,
        explanation: 'O MySQL usa a porta 3306 e o PostgreSQL usa a porta 5432 por padrão.'
    },
    {
        question: 'Qual é uma vantagem importante da linha de comando (CLI) para administrar bancos de dados?',
        options: ['Substituir backups por comandos manuais', 'Impedir conexões remotas', 'Administrar servidores sem interface gráfica e automatizar scripts', 'Eliminar a necessidade de permissões'],
        answer: 2,
        explanation: 'A CLI permite trabalhar remotamente via SSH e automatizar tarefas de deploy e backup.'
    },
    {
        question: 'Qual ferramenta oferece uma interface unificada para conectar-se a diferentes SGBDs?',
        options: ['SQLite', 'DBeaver', 'SSH', 'UTF-8'],
        answer: 1,
        explanation: 'O DBeaver conecta-se a diferentes bancos usando drivers e uma interface gráfica única.'
    },
    {
        question: 'Qual alternativa mostra corretamente comentários SQL?',
        options: ['-- linha única e /* bloco */ para múltiplas linhas', '// linha única e <!-- bloco --> para múltiplas linhas', '# apenas para tabelas e ## para colunas', 'comment() para linha única e block() para múltiplas linhas'],
        answer: 0,
        explanation: 'Use -- para comentários de uma linha e /* ... */ para comentários em bloco.'
    }
];

const quizQuestionBanks = {
    aula1: [
        { question: 'Qual é a principal diferença entre um dado e uma informação?', options: ['Dado é um fato bruto; informação é o dado contextualizado e interpretado.', 'Dado sempre é numérico; informação sempre é textual.', 'Informação é o dado sem contexto.', 'Não existe diferença entre os dois conceitos.'], answer: 0, explanation: 'O dado é bruto; a informação surge quando ele recebe contexto e significado.' },
        { question: 'Qual é a função principal de um SGBD?', options: ['Criar apresentações de slides.', 'Gerenciar armazenamento, acesso, segurança e integridade dos dados.', 'Substituir o sistema operacional.', 'Servir apenas para fazer cálculos matemáticos.'], answer: 1, explanation: 'O SGBD controla o armazenamento, as consultas, os acessos e a integridade dos dados.' },
        { question: 'Para que serve uma chave primária?', options: ['Formatar o texto de uma tabela.', 'Identificar cada registro de forma única.', 'Permitir valores duplicados em todas as linhas.', 'Armazenar somente imagens.'], answer: 1, explanation: 'A chave primária identifica cada registro sem ambiguidade.' },
        { question: 'Por que um banco de dados é mais adequado que uma planilha para muitos usuários?', options: ['Porque não possui regras de segurança.', 'Porque suporta concorrência, integridade e controle de acesso.', 'Porque impede consultas simultâneas.', 'Porque só armazena números.'], answer: 1, explanation: 'Bancos de dados foram projetados para acesso concorrente, integridade e segurança.' },
        { question: 'O que representa o princípio da necessidade na LGPD?', options: ['Coletar todos os dados possíveis.', 'Coletar apenas os dados essenciais para a finalidade informada.', 'Compartilhar dados sem autorização.', 'Armazenar dados indefinidamente.'], answer: 1, explanation: 'A coleta deve ser limitada ao mínimo necessário para a finalidade do tratamento.' }
    ],
    aula2: [
        { question: 'Qual propriedade ACID assegura o princípio "tudo ou nada" em uma transação?', options: ['Atomicidade', 'Consistência', 'Isolamento', 'Durabilidade'], answer: 0, explanation: 'Atomicidade garante que todas as operações ocorram ou que todas sejam desfeitas.' },
        { question: 'Para que são especialmente adequados os bancos NoSQL de grafos?', options: ['Para armazenar apenas arquivos de texto.', 'Para representar conexões e caminhos complexos entre entidades.', 'Para substituir qualquer sistema operacional.', 'Para impedir relacionamentos entre dados.'], answer: 1, explanation: 'Bancos de grafos usam nós e arestas para representar relacionamentos ricos.' },
        { question: 'Como um relacionamento N:N é representado no modelo lógico?', options: ['Duplicando todas as colunas das duas tabelas.', 'Criando uma tabela associativa com as chaves das tabelas relacionadas.', 'Removendo as chaves primárias.', 'Usando apenas um campo de texto livre.'], answer: 1, explanation: 'A tabela associativa armazena as chaves estrangeiras das duas entidades.' },
        { question: 'O que exige a Primeira Forma Normal (1FN)?', options: ['Valores atômicos e sem listas repetidas na mesma célula.', 'Uma tabela sem chave primária.', 'Todas as tabelas em um único arquivo.', 'A eliminação de todas as chaves estrangeiras.'], answer: 0, explanation: 'A 1FN exige valores indivisíveis e elimina grupos repetitivos.' },
        { question: 'O que a Terceira Forma Normal (3FN) procura eliminar?', options: ['Chaves primárias.', 'Dependências transitivas entre atributos não-chave.', 'Todas as relações entre tabelas.', 'Valores atômicos.'], answer: 1, explanation: 'Na 3FN, atributos não-chave não devem depender de outros atributos não-chave.' }
    ],
    aula4: [
        { question: 'Qual comando pertence à família DDL?', options: ['ALTER TABLE', 'SELECT', 'INSERT', 'GRANT'], answer: 0, explanation: 'ALTER TABLE modifica a estrutura de uma tabela e pertence à DDL.' },
        { question: 'Em um UPDATE, o que representam OLD e NEW em um trigger?', options: ['OLD é o valor anterior e NEW é o novo valor.', 'OLD é o usuário e NEW é a senha.', 'OLD é a tabela e NEW é o banco.', 'Ambos representam sempre o mesmo valor.'], answer: 0, explanation: 'OLD contém os valores anteriores e NEW contém os valores enviados para atualização.' },
        { question: 'O que é uma view?', options: ['Uma cópia física obrigatória da tabela.', 'Uma tabela virtual baseada em uma consulta.', 'Um tipo de índice para imagens.', 'Um usuário com privilégios administrativos.'], answer: 1, explanation: 'Views são consultas salvas que apresentam dados como uma tabela virtual.' },
        { question: 'Qual é uma diferença entre stored procedures e functions?', options: ['Functions podem retornar valor e ser usadas em expressões; procedures são chamadas com CALL.', 'Procedures só existem em bancos NoSQL.', 'Functions não podem receber parâmetros.', 'Não há diferença entre elas.'], answer: 0, explanation: 'Functions retornam valores e podem participar de expressões; procedures são executadas como rotinas.' },
        { question: 'Qual comando MongoDB equivale a SELECT * FROM tabela?', options: ['db.colecao.find({})', 'db.colecao.deleteAll()', 'db.colecao.select(*)', 'db.colecao.update({})'], answer: 0, explanation: 'find({}) com filtro vazio retorna todos os documentos da coleção.' }
    ],
    aula5: [
        { question: 'O que determina a regra 3-2-1 de backup?', options: ['3 cópias, 2 mídias diferentes e 1 cópia fora do local.', '3 usuários, 2 senhas e 1 servidor.', '3 bancos, 2 tabelas e 1 coluna.', '3 arquivos no mesmo computador.'], answer: 0, explanation: 'A regra mantém redundância em mídias diferentes e uma cópia offsite.' },
        { question: 'Qual é a diferença entre RPO e RTO?', options: ['RPO mede perda de dados tolerada; RTO mede tempo de recuperação tolerado.', 'RPO mede velocidade; RTO mede segurança.', 'RPO e RTO são nomes para o mesmo indicador.', 'RPO mede custo; RTO mede volume de dados.'], answer: 0, explanation: 'RPO trata da perda de dados e RTO trata do tempo para restaurar o serviço.' },
        { question: 'Qual prática ajuda a evitar SQL Injection?', options: ['Concatenar o texto recebido diretamente na consulta.', 'Usar Prepared Statements ou queries parametrizadas.', 'Dar acesso root a todas as aplicações.', 'Desativar a validação de entrada.'], answer: 1, explanation: 'Queries parametrizadas mantêm os dados separados do código SQL executável.' },
        { question: 'O que explica a regra 1-10-100 da qualidade de dados?', options: ['Prevenir um erro custa menos que corrigi-lo depois ou no cliente.', 'Todo erro custa exatamente o mesmo.', 'Erros só devem ser corrigidos no relatório.', 'A regra define portas de rede.'], answer: 0, explanation: 'Quanto mais tarde o erro é descoberto, maior tende a ser o custo de correção.' },
        { question: 'Qual é uma característica do formato Parquet?', options: ['É um formato colunar que favorece compressão e leitura seletiva de colunas.', 'É um protocolo de autenticação.', 'É um banco relacional completo.', 'É usado apenas para imagens.'], answer: 0, explanation: 'Parquet organiza dados por coluna, reduzindo I/O em consultas analíticas.' }
    ]
};

function getQuizQuestions() {
    const title = document.title.toLowerCase();
    if (title.includes('aula 1') || title.includes('organização')) return quizQuestionBanks.aula1;
    if (title.includes('aula 2')) return quizQuestionBanks.aula2;
    if (title.includes('aula 4')) return quizQuestionBanks.aula4;
    if (title.includes('aula 5')) return quizQuestionBanks.aula5;
    return aula3QuizQuestions;
}

const quizQuestions = getQuizQuestions();

let currentQuizQuestion = 0;
const quizAnswers = Array(quizQuestions.length).fill(null);

function renderQuiz() {
    const question = quizQuestions[currentQuizQuestion];
    const qNumber = document.getElementById('qNumber');
    const qQuestion = document.getElementById('qQuestion');
    const qOptions = document.getElementById('qOptions');
    const qFeedback = document.getElementById('qFeedback');
    const quizNavInfo = document.getElementById('quizNavInfo');
    const btnPrevQuiz = document.getElementById('btnPrevQuiz');
    const btnNextQuiz = document.getElementById('btnNextQuiz');

    if (!question || !qOptions) return;

    if (qNumber) qNumber.textContent = `QUESTÃO ${currentQuizQuestion + 1} DE ${quizQuestions.length}`;
    if (qQuestion) qQuestion.textContent = question.question;
    if (quizNavInfo) quizNavInfo.textContent = `Questão ${currentQuizQuestion + 1} de ${quizQuestions.length}`;
    if (btnPrevQuiz) btnPrevQuiz.disabled = currentQuizQuestion === 0;
    if (btnNextQuiz) btnNextQuiz.textContent = currentQuizQuestion === quizQuestions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão';

    qOptions.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        const selected = quizAnswers[currentQuizQuestion] === index;
        button.type = 'button';
        button.className = `w-full text-left px-3 py-2 rounded-lg border transition ${selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'}`;
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.setAttribute('aria-pressed', String(selected));
        button.addEventListener('click', () => answerQuizQuestion(index));
        qOptions.appendChild(button);
    });

    if (qFeedback) {
        qFeedback.className = 'mt-3 p-2.5 rounded text-xs hidden';
        qFeedback.textContent = '';
    }
}

function updateQuizScore() {
    const score = quizAnswers.reduce((total, answer, index) => total + (answer === quizQuestions[index].answer ? 1 : 0), 0);
    const quizScore = document.getElementById('quizScore');
    if (quizScore) quizScore.textContent = `Acertos: ${score}/${quizQuestions.length}`;
}

function answerQuizQuestion(answerIndex) {
    const question = quizQuestions[currentQuizQuestion];
    const qFeedback = document.getElementById('qFeedback');
    quizAnswers[currentQuizQuestion] = answerIndex;
    updateQuizScore();
    renderQuiz();

    if (!qFeedback) return;
    qFeedback.className = `mt-3 p-2.5 rounded text-xs ${answerIndex === question.answer ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`;
    qFeedback.textContent = answerIndex === question.answer ? `Correto! ${question.explanation}` : `Ainda não. ${question.explanation}`;
}

function nextQuizQuestion() {
    if (quizAnswers[currentQuizQuestion] === null) {
        const qFeedback = document.getElementById('qFeedback');
        if (qFeedback) {
            qFeedback.className = 'mt-3 p-2.5 rounded text-xs bg-amber-100 text-amber-800';
            qFeedback.textContent = 'Escolha uma alternativa antes de continuar.';
        }
        return;
    }

    if (currentQuizQuestion < quizQuestions.length - 1) {
        currentQuizQuestion++;
        renderQuiz();
        return;
    }

    currentQuizQuestion = 0;
    quizAnswers.fill(null);
    updateQuizScore();
    renderQuiz();
}

function prevQuizQuestion() {
    if (currentQuizQuestion > 0) {
        currentQuizQuestion--;
        renderQuiz();
    }
}

function toggleTeacherAnswers() {
    const answersContent = document.getElementById('answersContent');
    const button = document.getElementById('btnToggleAnswers');
    if (!answersContent) return;

    const hidden = answersContent.classList.toggle('hidden');
    if (button) button.textContent = hidden ? '🔒 Revelar Gabarito' : '🔓 Ocultar Gabarito';
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
renderQuiz();