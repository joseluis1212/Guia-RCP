// ========================
//  RCP COMPANIONS – MENSAJE DE EMERGENCIA
// ========================

// Configuración de personajes
const characters = {
    adulto: {
        name: 'Dr. Woof',
        skin: '#e6c9a8',
        accessory: '🩺',
        emergencyGreeting: 'Hola. Sé que estás pasando por un momento difícil. Respirá hondo. Estoy aquí para ayudarte. Seleccioná "Adulto" y empecemos juntos.',
        pitch: 1.0, rate: 0.9
    },
    niño: {
        name: 'Pandi',
        skin: '#fce0c6',
        accessory: '🐼',
        emergencyGreeting: 'Hola. Entiendo que estás en una emergencia. No estás solo. Respiramos juntos. Seleccioná "Niño" y te guío paso a paso.',
        pitch: 1.6, rate: 1.0
    },
    bebe: {
        name: 'Pío',
        skin: '#ffebd2',
        accessory: '🐣',
        emergencyGreeting: 'Hola... Sé que tenés miedo. Estoy aquí para ayudarte con el bebé. Respiramos juntos. Seleccioná "Bebé" y empecemos.',
        pitch: 2.0, rate: 0.85
    }
};

// Estado
let currentSteps = [];
let currentStep = 0;
let rcpType = 'niño';
let voiceEnabled = true;
let metronomeInterval = null;
let audioCtx = null;

// DOM
const avatarHead = document.getElementById('avatar-head');
const avatarMouth = document.getElementById('avatar-mouth');
const avatarAccessory = document.getElementById('avatar-accessory');
const bubbleText = document.getElementById('bubble-text');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const voiceBtn = document.getElementById('voice-btn');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');
const typeButtons = document.querySelectorAll('.type-btn');
const pupils = document.querySelectorAll('.pupil');

// ========================
//  FUNCIÓN DE BIENVENIDA AL CARGAR
// ========================
function mostrarMensajeEmergencia() {
    const char = characters[rcpType]; // Por defecto Pandi (niño)
    setCharacterAppearance(rcpType);
    bubbleText.textContent = char.emergencyGreeting;
    if (voiceEnabled) speak(char.emergencyGreeting, char.pitch, char.rate);
}

// ========================
//  CAMBIAR PERSONAJE
// ========================
function setCharacterAppearance(type) {
    const char = characters[type];
    avatarHead.style.background = `radial-gradient(circle at 30% 20%, ${char.skin}, #d4a373)`;
    avatarAccessory.textContent = char.accessory;
}

function setCharacter(type) {
    setCharacterAppearance(type);
    const char = characters[type];
    bubbleText.textContent = char.emergencyGreeting;
    if (voiceEnabled) speak(char.emergencyGreeting, char.pitch, char.rate);
}

// ========================
//  VOZ CON ANIMACIÓN DE BOCA
// ========================
function speak(text, pitch = 1.5, rate = 1.0) {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = 'es-AR';
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.includes('es-AR')) || voices.find(v => v.lang.includes('es-ES'));
    if (pref) utterance.voice = pref;
    
    avatarMouth.classList.add('speaking');
    utterance.onend = () => avatarMouth.classList.remove('speaking');
    utterance.onerror = () => avatarMouth.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? '🔊 Voz: Activada' : '🔇 Voz: Apagada';
    if (!voiceEnabled) {
        window.speechSynthesis.cancel();
        avatarMouth.classList.remove('speaking');
    }
}

// Seguimiento de ojos... (igual)
// Metrónomo... (igual)
// Pasos... (igual)
// Eventos...

// ========================
//  INICIO
// ========================
window.addEventListener('load', () => {
    // Pequeña pausa para que carguen las voces
    setTimeout(() => {
        mostrarMensajeEmergencia();
    }, 800);
});

// Service Worker...
