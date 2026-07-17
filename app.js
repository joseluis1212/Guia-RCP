// ========================
//  RCP COMPANIONS ✨
// ========================

// Pasos de RCP (adulto, niño, bebé)
const stepsAdulto = [
  { title: "Paso 1: Seguridad", text: "Verificá que la escena sea segura.", metronome: false },
  { title: "Paso 2: Evaluación", text: "Evaluá respuesta hablándole y moviéndole suavemente los hombros.", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Llamá al 107, 911 o al sistema local de emergencias.", metronome: false },
  { title: "Paso 4: Posición de manos", text: "Colocá el talón de una mano en el centro inferior del esternón y la otra mano encima.", metronome: true },
  { title: "Paso 5: Profundidad y ritmo", text: "Comprimí el tórax entre 5 y 6 cm, a 100 a 120 por minuto.", metronome: true },
  { title: "Paso 6: Compresiones (30)", text: "Hacé 30 compresiones ininterrumpidas, liberando por completo el tórax entre una y otra.", metronome: true },
  { title: "Paso 7: Continuar ciclos", text: "Continuá ciclos de RCP hasta que llegue ayuda o la víctima recupere conciencia.", metronome: true },
  { title: "Paso 8: Ventilaciones", text: "Realizá 2 insuflaciones (sellando la nariz) solo si tenés entrenamiento y una máscara de protección. Si no, continuá con las compresiones.", metronome: false },
  { title: "Paso 9: Uso del DEA", text: "Si hay DEA, encendelo y seguí sus instrucciones.", metronome: false },
  { title: "Paso 10: Posición de recuperación", text: "Si la persona recupera el pulso o la conciencia, colocala de costado en posición de recuperación.", metronome: false }
];

const stepsNiño = [
  { title: "Paso 1: Seguridad", text: "Confirmá seguridad de la escena.", metronome: false },
  { title: "Paso 2: Evaluación", text: "Revisá si responde y si respira normalmente.", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Llamá a emergencias y pedí un DEA si está disponible.", metronome: false },
  { title: "Paso 4: RCP inicial", text: "Si estás solo, hacé 2 minutos de RCP antes de alejarte a llamar, según la guía oficial.", metronome: true },
  { title: "Paso 5: Compresiones (30)", text: "Realizá 30 compresiones en el centro del pecho, a 100 a 120 por minuto.", metronome: true },
  { title: "Paso 6: Profundidad", text: "La compresión debe hundir el tórax aproximadamente 5 cm.", metronome: true },
  { title: "Paso 7: Ventilaciones (si sabés)", text: "Si sabés hacerlo, agregá 2 ventilaciones boca a boca después de las compresiones.", metronome: false },
  { title: "Paso 8: Técnica de ventilación", text: "Para la ventilación, tapá ambas fosas nasales y soplá una bocanada breve de alrededor de 1 segundo.", metronome: false },
  { title: "Paso 9: Manos según tamaño", text: "En niños pequeños se usa una mano; en niños más grandes o de complexión grande, dos manos.", metronome: false },
  { title: "Paso 10: Continuar", text: "Repetí ciclos de 30 compresiones (y 2 ventilaciones si las estás haciendo) hasta que llegue ayuda.", metronome: true }
];

const stepsBebe = [
  { title: "Paso 1: Seguridad", text: "Verificá que el lugar sea seguro.", metronome: false },
  { title: "Paso 2: Evaluación", text: "Evaluá si el bebé responde y si mueve o no el pecho al respirar.", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Llamá a emergencias y pedí un DEA.", metronome: false },
  { title: "Paso 4: RCP inicial", text: "Si estás solo, la guía oficial indica hacer 2 minutos de RCP antes de ir a pedir ayuda.", metronome: true },
  { title: "Paso 5: Posición", text: "Colocá al bebé boca arriba sobre superficie firme.", metronome: false },
  { title: "Paso 6: Compresiones (30)", text: "Hacé 30 compresiones con dos dedos en el centro del esternón, entre los pezones.", metronome: true },
  { title: "Paso 7: Profundidad y ritmo", text: "La profundidad aproximada es de 4 cm, con ritmo de 100 a 120 por minuto.", metronome: true },
  { title: "Paso 8: Ventilaciones suaves", text: "Luego hacé 2 insuflaciones suaves, cubriendo boca y nariz del bebé con tu boca.", metronome: false },
  { title: "Paso 9: Duración de la insuflación", text: "Cada insuflación debe durar alrededor de 1 segundo y solo lo suficiente para elevar el tórax.", metronome: false },
  { title: "Paso 10: Continuar", text: "Repetí el ciclo hasta que llegue ayuda o el bebé se recupere.", metronome: true }
];

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
//  VOZ CON ANIMACIÓN
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

// ========================
//  SEGUIMIENTO DE OJOS
// ========================
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    pupils.forEach(p => p.style.transform = `translate(${x}px, ${y}px)`);
});
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const x = (touch.clientX / window.innerWidth - 0.5) * 4;
    const y = (touch.clientY / window.innerHeight - 0.5) * 4;
    pupils.forEach(p => p.style.transform = `translate(${x}px, ${y}px)`);
});

// Al tocar el avatar repite el mensaje
avatarHead.addEventListener('click', () => {
    const char = characters[rcpType];
    if (currentSteps.length && currentStep < currentSteps.length) {
        speak(currentSteps[currentStep].text, char.pitch, char.rate);
    } else {
        speak(bubbleText.textContent, char.pitch, char.rate);
    }
});

// ========================
//  METRÓNOMO
// ========================
function beep(duration = 80, frequency = 880) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    gainNode.gain.value = 0.4;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function startMetronome() {
    if (metronomeInterval) return;
    beep(100, 880);
    metronomeInterval = setInterval(() => beep(100, 880), 545);
    metroStart.disabled = true;
    metroStop.disabled = false;
}

function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }
    metroStart.disabled = false;
    metroStop.disabled = true;
}

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
    else currentSteps = stepsBebe;
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

// ========================
//  MENSAJE DE BIENVENIDA
// ========================
window.addEventListener('load', () => {
    // Iniciar con Pandi (niño)
    setCharacterAppearance('niño');
    const defaultChar = characters.niño;
    bubbleText.textContent = defaultChar.emergencyGreeting;
    setTimeout(() => {
        if (voiceEnabled) speak(defaultChar.emergencyGreeting, defaultChar.pitch, defaultChar.rate);
    }, 600);
});

// Service Worker (con versión nueva para forzar actualización)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                console.log('SW registrado');
                // Limpiar caché antigua si es necesario
                caches.keys().then(keys => {
                    keys.forEach(key => {
                        if (key !== 'rcp-guide-v3') {
                            caches.delete(key);
                        }
                    });
                });
            })
            .catch(err => console.error('Error SW', err));
    });
}
