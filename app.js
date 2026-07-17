// ========================
//  RCP COMPANIONS ✨ v3.0
// ========================

const stepsAdulto = [ /* ... igual que antes ... */ ];
const stepsNiño = [ /* ... */ ];
const stepsBebe = [ /* ... */ ];

const characters = {
    adulto: {
        masculino: {
            name: 'Dr. RCP',
            skin: '#e6c9a8', accessory: '🩺',
            greeting: 'Soy el Dr. RCP. Sé que es difícil. Respirá hondo. Estoy aquí para ayudarte.',
            pitch: 0.9, rate: 0.9
        },
        femenino: {
            name: 'Dra. RCP',
            skin: '#f0d5b8', accessory: '💉',
            greeting: 'Soy la Dra. RCP. Entiendo la situación. Vamos a superarlo juntas.',
            pitch: 1.1, rate: 0.9
        }
    },
    niño: {
        masculino: {
            name: 'Pandi', skin: '#fce0c6', accessory: '🐼',
            greeting: '¡Hola! Soy Pandi. Estás en una emergencia, pero yo te guío paso a paso.',
            pitch: 1.6, rate: 1.0
        },
        femenino: {
            name: 'Mika', skin: '#ffe0d0', accessory: '🦊',
            greeting: '¡Hola! Soy Mika. No tengas miedo, juntas ayudaremos a este niño.',
            pitch: 1.8, rate: 1.0
        }
    },
    bebe: {
        masculino: {
            name: 'Pío', skin: '#ffebd2', accessory: '🐣',
            greeting: 'Pío pío... Sé que es difícil. Vamos a cuidar al bebé juntitos.',
            pitch: 2.0, rate: 0.85
        },
        femenino: {
            name: 'Lila', skin: '#ffe8f0', accessory: '🌸',
            greeting: 'Hola... Soy Lila. Respiramos juntas. Cuidemos a este bebé con amor.',
            pitch: 2.2, rate: 0.85
        }
    }
};

// Estado
let currentSteps = [], currentStep = 0, rcpType = 'niño', rcpGender = 'masculino';
let voiceEnabled = true, metronomeInterval = null, audioCtx = null;
let currentMood = 'normal'; // 'normal', 'speaking', 'worried', 'relieved'

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
const typeBtns = document.querySelectorAll('.type-btn');
const genderBtns = document.querySelectorAll('.gender-btn');
const pupils = document.querySelectorAll('.pupil');
const eyelids = document.querySelectorAll('.eyelid');
const eyebrows = document.querySelectorAll('.eyebrow');

// ========================
//  ACTUALIZAR APARIENCIA
// ========================
function updateAppearance() {
    const char = characters[rcpType][rcpGender];
    avatarHead.style.background = `radial-gradient(circle at 30% 20%, ${char.skin}, #d4a373)`;
    avatarAccessory.textContent = char.accessory;
    // Sincronizar color de párpados
    eyelids.forEach(lid => lid.style.background = char.skin);
}

function setMood(mood) {
    currentMood = mood;
    avatarMouth.className = 'avatar-mouth';
    if (mood === 'speaking') avatarMouth.classList.add('speaking');
    else if (mood === 'worried') avatarMouth.classList.add('worried');
    else if (mood === 'relieved') avatarMouth.classList.add('relieved');
    
    // Cejas según estado de ánimo
    if (mood === 'worried') {
        eyebrows[0].style.transform = 'rotate(15deg)';
        eyebrows[1].style.transform = 'rotate(-15deg)';
    } else {
        eyebrows[0].style.transform = 'rotate(0)';
        eyebrows[1].style.transform = 'rotate(0)';
    }
}

// ========================
//  VOZ
// ========================
function speak(text, pitch, rate) {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch; utterance.rate = rate; utterance.lang = 'es-AR';
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.includes('es-AR')) || voices.find(v => v.lang.includes('es-ES'));
    if (pref) utterance.voice = pref;
    setMood('speaking');
    utterance.onend = () => {
        // Vuelve al mood normal si no es paso de compresión
        if (currentSteps.length && currentStep < currentSteps.length) {
            const step = currentSteps[currentStep];
            setMood(step.metronome ? 'worried' : 'normal');
        } else setMood('normal');
    };
    utterance.onerror = () => setMood('normal');
    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? '🔊 Voz: Activada' : '🔇 Voz: Apagada';
    if (!voiceEnabled) window.speechSynthesis.cancel();
}

// Seguimiento de ojos...
// Metrónomo, mostrar paso, eventos... (similar a versiones anteriores, pero llamando a setMood según step.metronome)

// ========================
//  INICIO
// ========================
window.addEventListener('load', () => {
    updateAppearance();
    const char = characters[rcpType][rcpGender];
    bubbleText.textContent = char.greeting;
    setTimeout(() => speak(char.greeting, char.pitch, char.rate), 600);
});

// Service Worker...
