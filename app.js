/* ============================================================
   GUARDIANES DE LA VIDA - APP COMPLETA (VERSIÓN CORREGIDA)
   ============================================================ */

// -------- ESTADO GLOBAL --------
const state = {
    guardian: null,
    type: null,
    conciencia: false,
    respiracion: false,
    currentStep: 0,
    totalSteps: 10,
    voiceEnabled: true,
    metronomeInterval: null,
    metronomeRunning: false,
    _steps: [],
};

// -------- DATOS DE LOS GUARDIANES --------
const GUARDIAN_DATA = {
    bunny: {
        name: 'Pandi',
        role: 'Calma y contención',
        avatarClass: 'av-bunny',
        message: 'Hola, soy Pandi. Vamos a mantener la calma y salvar una vida.'
    },
    astro: {
        name: 'Astro',
        role: 'Precisión técnica',
        avatarClass: 'av-astro',
        message: 'Astro aquí. Sigue mis instrucciones al pie de la letra.'
    },
    pulse: {
        name: 'Pulse',
        role: 'Ritmo y energía',
        avatarClass: 'av-pulse',
        message: '¡Soy Pulse! Mantén el ritmo, no te detengas.'
    },
    hoodie: {
        name: 'Hoodie',
        role: 'Firme y directo',
        avatarClass: 'av-hoodie',
        message: 'Hola, soy Hoodie. Estás en una emergencia, pero yo te guío paso a paso.'
    }
};

// -------- PASOS DE RCP (adaptados a edad) --------
function getStepsForType(type) {
    const base = [
        'Asegurate de que la escena es segura.',
        'Verifica si la persona responde y respira.',
        'Pide ayuda a alguien cercano y llama al 107.',
        'Coloca a la persona boca arriba sobre una superficie firme.',
        'Arrodíllate junto a su pecho, entrelaza tus manos.',
        'Comprime el centro del pecho, con los brazos rectos, a 100-120 compresiones por minuto.',
        'Después de 30 compresiones, inclina la cabeza y levanta el mentón para abrir la vía aérea.',
        'Da 2 respiraciones de rescate (si estás entrenado).',
        'Continúa con el ciclo de 30 compresiones y 2 respiraciones.',
        'No pares hasta que llegue la ayuda o la persona reaccione.'
    ];
    if (type === 'niño') {
        base[4] = 'Arrodíllate junto al niño, usa una sola mano (o dos si es necesario).';
        base[5] = 'Comprime el pecho unos 5 cm de profundidad, a 100-120 por minuto.';
    } else if (type === 'bebe') {
        base[4] = 'Coloca al bebé sobre una superficie firme, usa dos dedos en el centro del pecho.';
        base[5] = 'Comprime el pecho unos 4 cm de profundidad, a 100-120 por minuto.';
        base[7] = 'Da 2 respiraciones suaves (cubriendo boca y nariz).';
    }
    return base;
}

// -------- DOM REFS --------
const $ = id => document.getElementById(id);
const screens = {
    select: $('screen-select'),
    type: $('screen-type'),
    detect: $('screen-detect'),
    guide: $('screen-guide'),
};
const guardianGrid = $('guardian-grid');
const typeGrid = $('type-grid');
const toTypeBtn = $('to-type-btn');
const toDetectBtn = $('to-detect-btn');
const backToSelectBtn = $('back-to-select-btn');
const startRcpBtn = $('start-rcp-btn');
const nextBtn = $('next-btn');
const voiceBtn = $('voice-btn');
const metroStart = $('metro-start');
const metroStop = $('metro-stop');
const avatarDetect = $('avatar-detect');
const avatarGuide = $('avatar-guide');
const detectBubble = $('detect-bubble-text');
const guideBubble = $('guide-bubble-text');
const guideStepLabel = $('guide-step-label');
const statusConciencia = $('status-conciencia');
const statusRespiracion = $('status-respiracion');
const quickcheckDate = $('quickcheck-date');
const metronomeBox = $('metronome-box');
const signalQuality = $('signal-quality');

// -------- FUNCIONES DE NAVEGACIÓN --------
function showScreen(name) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.toggle('active', key === name);
    });
    // Detener metrónomo al salir de la guía
    if (name !== 'guide') {
        stopMetronome();
    }
}

// -------- AVATAR BUILDER --------
function buildAvatarHTML(guardianKey, size = 'normal') {
    const data = GUARDIAN_DATA[guardianKey];
    if (!data) return '<div style="color:#fff;">👤</div>';
    const base = data.avatarClass;
    const scale = size === 'lg' ? 'scale(1.4)' : 'scale(1.2)';
    let html = `<div class="mini-avatar ${base}" style="transform:${scale};margin:0 auto;">`;

    switch (guardianKey) {
        case 'bunny':
            html += `
                <div class="g-ear l"></div>
                <div class="g-ear r"></div>
                <div class="g-helmet">
                    <div class="g-star">✦</div>
                    <div class="g-visor">
                        <span class="g-eye talk"></span>
                        <span class="g-eye talk"></span>
                    </div>
                </div>
            `;
            break;
        case 'astro':
            html += `
                <div class="g-helmet">
                    <div class="g-visor">
                        <span class="g-eye talk"></span>
                        <span class="g-eye talk"></span>
                    </div>
                </div>
            `;
            break;
        case 'pulse':
            html += `
                <div class="g-locs"></div>
                <div class="g-hp"></div>
                <div class="g-helmet">
                    <div class="g-visor">
                        <span class="g-eye talk"></span>
                        <span class="g-eye talk"></span>
                    </div>
                </div>
            `;
            break;
        case 'hoodie':
            html += `
                <div class="g-antenna l"></div>
                <div class="g-antenna r"></div>
                <div class="g-hood">
                    <div class="g-visor">
                        <span class="g-eye talk"></span>
                        <span class="g-eye talk"></span>
                    </div>
                </div>
            `;
            break;
        default:
            html += `<div style="color:#fff;font-size:2rem;text-align:center;padding-top:20px;">👤</div>`;
    }
    html += `</div>`;
    return html;
}

function renderAvatar(container, guardianKey, size = 'normal') {
    if (!container) return;
    container.innerHTML = buildAvatarHTML(guardianKey, size);
}

// -------- ACTUALIZAR BURBUJAS Y VOZ --------
let speechTimeout = null;

function speakText(text, force = false) {
    if (!state.voiceEnabled && !force) return;
    if (!window.speechSynthesis) return;
    
    // Limpiar cualquier speech pendiente
    window.speechSynthesis.cancel();
    if (speechTimeout) {
        clearTimeout(speechTimeout);
        speechTimeout = null;
    }
    
    // Pequeño delay para evitar que se encolen mensajes vacíos
    speechTimeout = setTimeout(() => {
        if (text && text.trim().length > 0) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.95;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
        speechTimeout = null;
    }, 100);
}

function updateDetectBubble(text) {
    detectBubble.textContent = text;
    speakText(text);
}

function updateGuideBubble(text) {
    guideBubble.textContent = text;
    speakText(text);
}

// -------- GUARDIAN SELECTION --------
let selectedGuardianCard = null;
guardianGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.guardian-card');
    if (!card) return;
    const key = card.dataset.guardian;
    if (!key) return;
    if (selectedGuardianCard) {
        selectedGuardianCard.classList.remove('selected');
    }
    card.classList.add('selected');
    selectedGuardianCard = card;
    state.guardian = key;
    toTypeBtn.disabled = false;
});

toTypeBtn.addEventListener('click', () => {
    if (!state.guardian) return;
    showScreen('type');
    // Pre-seleccionar adulto por defecto
    const defaultType = document.querySelector('.type-card[data-type="adulto"]');
    if (defaultType) {
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
        defaultType.classList.add('selected');
        state.type = 'adulto';
    }
});

// -------- TYPE SELECTION --------
typeGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.type-card');
    if (!card) return;
    const type = card.dataset.type;
    if (!type) return;
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.type = type;
});

toDetectBtn.addEventListener('click', () => {
    if (!state.type) {
        alert('Por favor, seleccioná la edad de la víctima.');
        return;
    }
    // Reiniciar estado de detección
    state.conciencia = false;
    state.respiracion = false;
    statusConciencia.textContent = '● No respondida';
    statusConciencia.classList.remove('ok');
    statusRespiracion.textContent = '● No respondida';
    statusRespiracion.classList.remove('ok');
    startRcpBtn.disabled = true;
    startRcpBtn.textContent = 'INICIAR RCP';

    renderAvatar(avatarDetect, state.guardian, 'normal');
    const data = GUARDIAN_DATA[state.guardian];
    const msg = data ? data.message : '¡Vamos a salvar una vida!';
    updateDetectBubble(msg);

    const now = new Date();
    quickcheckDate.textContent = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    signalQuality.textContent = Math.floor(80 + Math.random() * 19);

    showScreen('detect');
});

backToSelectBtn.addEventListener('click', () => {
    showScreen('select');
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    state.type = null;
});

// -------- QUICK-CHECK INTERACTIVO --------
function handleQuickCheck(element, checkType) {
    if (state[checkType]) return; // ya está respondido
    
    state[checkType] = true;
    element.textContent = '● Respondida';
    element.classList.add('ok');
    
    const msg = checkType === 'conciencia' 
        ? '✅ La persona responde. Si no hay lesión, mantenela tranquila. Si no responde, continuá.'
        : '✅ La persona respira. Colocala en posición lateral de seguridad. Si no respira, iniciá RCP.';
    updateDetectBubble(msg);
    evaluateRCPReady();
}

statusConciencia.addEventListener('click', () => {
    handleQuickCheck(statusConciencia, 'conciencia');
});

statusRespiracion.addEventListener('click', () => {
    handleQuickCheck(statusRespiracion, 'respiracion');
});

function evaluateRCPReady() {
    if (state.conciencia && state.respiracion) {
        startRcpBtn.disabled = false;
        startRcpBtn.textContent = '✅ LISTO - INICIAR RCP';
        updateDetectBubble('✅ Todo verificado. ¡Estás listo para iniciar RCP!');
    } else {
        startRcpBtn.disabled = true;
        startRcpBtn.textContent = 'INICIAR RCP';
    }
}

// -------- START RCP --------
startRcpBtn.addEventListener('click', () => {
    if (startRcpBtn.disabled) return;
    state.currentStep = 0;
    const steps = getStepsForType(state.type);
    state._steps = steps;
    renderAvatar(avatarGuide, state.guardian, 'lg');
    showStep(0);
    metronomeBox.classList.add('show');
    showScreen('guide');
});

// -------- GUIDE STEPS --------
function showStep(index) {
    const steps = state._steps || getStepsForType(state.type);
    const total = steps.length;
    if (index >= total) {
        guideStepLabel.textContent = '✅ COMPLETADO';
        const msg = '¡Excelente! Has completado todos los pasos. No pares hasta que llegue la ayuda.';
        guideBubble.textContent = msg;
        speakText(msg);
        nextBtn.textContent = '🔄 Reiniciar';
        nextBtn.onclick = () => {
            // Reiniciar completamente la guía
            state.currentStep = 0;
            state._steps = getStepsForType(state.type);
            showStep(0);
            nextBtn.textContent = 'Siguiente ⏭';
            nextBtn.onclick = nextStep;
            // Detener metrónomo al reiniciar
            stopMetronome();
        };
        return;
    }
    state.currentStep = index;
    guideStepLabel.textContent = `Paso ${index + 1} / ${total}`;
    const text = steps[index];
    updateGuideBubble(text);
    nextBtn.textContent = index === total - 1 ? '✅ Finalizar' : 'Siguiente ⏭';
    nextBtn.onclick = nextStep;
}

function nextStep() {
    const steps = state._steps || getStepsForType(state.type);
    if (state.currentStep + 1 >= steps.length) {
        showStep(steps.length);
    } else {
        showStep(state.currentStep + 1);
    }
}

// -------- METRONOME (Web Audio) --------
let audioCtx = null;

function playTick() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0.15;
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
        // Silencioso fallback
    }
}

function startMetronome() {
    if (state.metronomeRunning) return;
    state.metronomeRunning = true;
    metroStart.disabled = true;
    metroStop.disabled = false;
    const interval = 60000 / 110; // 110 BPM
    state.metronomeInterval = setInterval(() => {
        playTick();
        metroStart.style.transform = 'scale(0.95)';
        setTimeout(() => { metroStart.style.transform = 'scale(1)'; }, 100);
    }, interval);
}

function stopMetronome() {
    if (state.metronomeInterval) {
        clearInterval(state.metronomeInterval);
        state.metronomeInterval = null;
    }
    state.metronomeRunning = false;
    metroStart.disabled = false;
    metroStop.disabled = true;
    metroStart.style.transform = 'scale(1)';
}

metroStart.addEventListener('click', startMetronome);
metroStop.addEventListener('click', stopMetronome);

// -------- VOICE TOGGLE --------
voiceBtn.addEventListener('click', () => {
    state.voiceEnabled = !state.voiceEnabled;
    voiceBtn.classList.toggle('muted', !state.voiceEnabled);
    voiceBtn.textContent = state.voiceEnabled ? '🔊' : '🔇';
    if (state.voiceEnabled) {
        const currentText = guideBubble.textContent;
        if (currentText && currentText.length > 0) {
            speakText(currentText);
        }
    } else {
        window.speechSynthesis.cancel();
    }
});

// -------- INICIALIZACIÓN --------
function init() {
    const now = new Date();
    quickcheckDate.textContent = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    toTypeBtn.disabled = true;
    showScreen('select');

    window.addEventListener('beforeunload', () => {
        stopMetronome();
        window.speechSynthesis.cancel();
    });
}

init();
console.log('🚀 Guardianes de la Vida (versión corregida) cargado correctamente.');
