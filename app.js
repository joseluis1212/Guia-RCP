// ========================
//  RCP CON PERSONAJES AMIGABLES
// ========================

// Pasos (idénticos a la versión anterior)
const stepsAdulto = [ /* ... mismo contenido ... */ ];
const stepsNiño = [ /* ... mismo contenido ... */ ];
const stepsBebe = [ /* ... mismo contenido ... */ ];

// (Por brevedad no copio los arrays completos, son los mismos de la última versión funcional)

// Configuración de personajes
const characters = {
    adulto: {
        emoji: '🐶',
        name: 'Dr. Woof',
        greeting: '¡Guau! Soy el Dr. Woof. Vamos a ayudar a un adulto. ¡Tú puedes!',
        pitch: 1.0,
        rate: 0.9,
        bg: '#e3f2fd'
    },
    niño: {
        emoji: '🐼',
        name: 'Pandi',
        greeting: '¡Hola! Soy Pandi. ¡Elegiste ayudar a un niño! ¡Qué valiente!',
        pitch: 1.6,
        rate: 1.0,
        bg: '#fff3e0'
    },
    bebe: {
        emoji: '🐣',
        name: 'Pío',
        greeting: '¡Pío pío! Soy Pío. Vamos a cuidar a un bebé con mucho amor.',
        pitch: 2.0,
        rate: 0.9,
        bg: '#fce4ec'
    }
};

let currentSteps = [];
let currentStep = 0;
let rcpType = 'niño';
let voiceEnabled = true;  // Iniciamos con voz activada para niños
let metronomeInterval = null;
let audioCtx = null;

// DOM
const avatarEl = document.getElementById('character-avatar');
const bubbleText = document.getElementById('bubble-text');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const voiceBtn = document.getElementById('voice-btn');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');
const typeButtons = document.querySelectorAll('.type-btn');

// ========================
//  CAMBIAR PERSONAJE
// ========================
function setCharacter(type) {
    const char = characters[type];
    avatarEl.textContent = char.emoji;
    avatarEl.style.background = char.bg;
    bubbleText.textContent = char.greeting;
    if (voiceEnabled) speak(char.greeting, char.pitch, char.rate);
}

// ========================
//  VOZ (con tono personalizado)
// ========================
function speak(text, pitch = 1.5, rate = 1.0) {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = 'es-AR';
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.includes('es-AR')) ||
                 voices.find(v => v.lang.includes('es-ES'));
    if (pref) utterance.voice = pref;
    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? '🔊 Voz: Activada' : '🔇 Voz: Apagada';
    if (!voiceEnabled) window.speechSynthesis.cancel();
}

// Al tocar el avatar, repite el mensaje actual
avatarEl.addEventListener('click', () => {
    if (currentSteps.length > 0 && currentStep < currentSteps.length) {
        const step = currentSteps[currentStep];
        const char = characters[rcpType];
        speak(step.text, char.pitch, char.rate);
    } else {
        const char = characters[rcpType];
        speak(bubbleText.textContent, char.pitch, char.rate);
    }
});

// ========================
//  METRÓNOMO (sin cambios)
// ========================
function beep(duration = 80, frequency = 880) { /* ... mismo código ... */ }
function startMetronome() { /* ... */ }
function stopMetronome() { /* ... */ }

// ========================
//  NAVEGACIÓN DE PASOS
// ========================
function showStep(index) {
    if (index < currentSteps.length) {
        const step = currentSteps[index];
        bubbleText.textContent = step.text;
        const char = characters[rcpType];
        speak(step.text, char.pitch, char.rate);

        metronomeBox.style.display = step.metronome ? 'block' : 'none';
        if (!step.metronome) stopMetronome();

        nextBtn.textContent = (index === currentSteps.length - 1) ? '🔄 Repetir' : '⏭ Siguiente';
        nextBtn.disabled = false;
    } else {
        currentStep = 0;
        showStep(0);
    }
}

// ========================
//  EVENTOS
// ========================
typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        rcpType = btn.getAttribute('data-type');
        setCharacter(rcpType);
        startBtn.disabled = false;
        nextBtn.disabled = true;
        stopMetronome();
        metronomeBox.style.display = 'none';
        currentSteps = [];
        currentStep = 0;
    });
});

startBtn.addEventListener('click', () => {
    if (rcpType === 'adulto') currentSteps = stepsAdulto;
    else if (rcpType === 'niño') currentSteps = stepsNiño;
    else if (rcpType === 'bebe') currentSteps = stepsBebe;

    currentStep = 0;
    showStep(currentStep);
    startBtn.disabled = true;
    nextBtn.disabled = false;
});

nextBtn.addEventListener('click', () => {
    currentStep++;
    if (currentStep >= currentSteps.length) currentStep = 0;
    showStep(currentStep);
});

voiceBtn.addEventListener('click', toggleVoice);
metroStart.addEventListener('click', startMetronome);
metroStop.addEventListener('click', stopMetronome);

// Inicializar con personaje niño seleccionado
setCharacter('niño');
document.querySelector('.type-btn[data-type="niño"]').classList.add('selected');

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
