// ========================
//  GUÍA DE RCP INTERACTIVA
//  Con Personajes y Voces
// ========================

// --- Configuración de Personajes ---
const characters = {
    doctor: {
        emoji: '🩺',
        className: 'doctor',
        greeting: '¡Hola! Soy el Dr. López. Selecciona el tipo de RCP para empezar.',
        voiceParams: { pitch: 0.8, rate: 0.9 } // Voz grave, profesional
    },
    panda: {
        emoji: '🐼',
        className: 'panda',
        greeting: '¡Hola! Soy Panda RCP. ¡Vamos a aprender a salvar vidas jugando!',
        voiceParams: { pitch: 1.6, rate: 1.0 } // Voz aguda, amigable
    }
};

// --- Pasos de RCP (Igual que antes, sin cambios) ---
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

// --- Estado de la App ---
let currentSteps = [];
let currentStep = 0;
let rcpType = 'adulto'; // Por defecto
let currentCharacter = 'doctor'; // Por defecto
let voiceEnabled = false;
let metronomeInterval = null;
let audioCtx = null;

// --- Elementos del DOM ---
const avatarEl = document.getElementById('avatar');
const stepTextEl = document.getElementById('step-text');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const voiceBtn = document.getElementById('voice-btn');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');
const charButtons = document.querySelectorAll('.char-btn');
const typeButtons = document.querySelectorAll('.type-btn');

// ========================
//  1. LÓGICA DE PERSONAJES
// ========================
function setCharacter(charKey) {
    currentCharacter = charKey;
    const char = characters[charKey];
    
    // Actualizar botones de selección
    charButtons.forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`.char-btn[data-char="${charKey}"]`).classList.add('selected');
    
    // Actualizar avatar visual
    avatarEl.textContent = char.emoji;
    avatarEl.className = `avatar ${char.className}`;
    
    // Mostrar saludo del personaje
    if (currentStep === 0 || !currentSteps.length) {
        stepTextEl.textContent = char.greeting;
        if (voiceEnabled) speak(char.greeting);
    }
}

// ========================
//  2. LÓGICA DE VOZ (TTS)
// ========================
function speak(text) {
    if (!voiceEnabled) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const charParams = characters[currentCharacter].voiceParams;
    
    utterance.pitch = charParams.pitch;
    utterance.rate = charParams.rate;
    utterance.lang = 'es-AR'; // Priorizar español argentino
    
    // Intentar elegir una voz nativa de buena calidad
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang.includes('es-AR')) ||
                           voices.find(voice => voice.lang.includes('es-ES')) ||
                           voices.find(voice => voice.lang.includes('es-MX'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? '🔊 Voz: Activada' : '🔇 Voz: Apagada';
    
    if (voiceEnabled) {
        const step = currentSteps[currentStep];
        if (step) speak(step.text);
        else speak(characters[currentCharacter].greeting);
    } else {
        window.speechSynthesis.cancel();
    }
}

// Cargar las voces al inicio (importante para móviles)
window.speechSynthesis.onvoiceschanged = () => {
    // Se ejecuta cuando las voces están disponibles
    console.log('Voces cargadas');
};

// ========================
//  3. METRÓNOMO
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
//  4. NAVEGACIÓN DE PASOS
// ========================
function showStep(index) {
  if (index < currentSteps.length) {
    const step = currentSteps[index];
    stepTextEl.textContent = step.text;
    speak(step.text);

    // Control del metrónomo
    if (step.metronome) {
      metronomeBox.style.display = 'block';
    } else {
      metronomeBox.style.display = 'none';
      stopMetronome();
    }

    nextBtn.textContent = (index === currentSteps.length - 1) ? '🔄 Repetir Guía' : '⏭ Siguiente Paso';
    nextBtn.disabled = false;
  } else {
    currentStep = 0;
    showStep(0);
  }
}

// ========================
//  5. EVENTOS Y CONTROL
// ========================

// Selección de Personaje
charButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setCharacter(btn.getAttribute('data-char'));
    });
});

// Selección de Tipo de RCP
typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        rcpType = btn.getAttribute('data-type');
        
        // Feedback visual y de voz
        const typeNames = { adulto: 'Adulto', niño: 'Niño', bebe: 'Bebé' };
        stepTextEl.textContent = `Modo ${typeNames[rcpType]} seleccionado. Presiona "Iniciar Guía".`;
        startBtn.disabled = false;
        
        if (voiceEnabled) speak(`Modo ${typeNames[rcpType]} seleccionado`);
        stopMetronome();
        nextBtn.disabled = true;
        metronomeBox.style.display = 'none';
    });
});

// Iniciar Guía
startBtn.addEventListener('click', () => {
  if (rcpType === 'adulto') currentSteps = stepsAdulto;
  else if (rcpType === 'niño') currentSteps = stepsNiño;
  else if (rcpType === 'bebe') currentSteps = stepsBebe;

  currentStep = 0;
  showStep(currentStep);
  startBtn.disabled = true;
  nextBtn.disabled = false;
});

// Siguiente Paso
nextBtn.addEventListener('click', () => {
  currentStep++;
  if (currentStep >= currentSteps.length) currentStep = 0;
  showStep(currentStep);
});

// Eventos de Voz y Metrónomo
voiceBtn.addEventListener('click', toggleVoice);
metroStart.addEventListener('click', startMetronome);
metroStop.addEventListener('click', stopMetronome);

// --- Inicialización ---
// Iniciamos con el Doctor seleccionado y Adulto por defecto
setCharacter('doctor');
document.querySelector('.type-btn[data-type="adulto"]').classList.add('selected');
rcpType = 'adulto';
startBtn.disabled = false;

// Service Worker (Offline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registrado'))
      .catch(err => console.error('Error SW', err));
  });
}
