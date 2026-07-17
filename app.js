// ========================
//  RCP CON PERSONAJES AMIGABLES
// ========================

// Pasos (adulto, niño, bebé) – mismos que en la versión oficial argentina
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

// Configuración de personajes (imágenes y voces)
const characters = {
    adulto: {
        img: 'adulto.png',
        name: 'Dr. Woof',
        greeting: '¡Guau! Soy el Dr. Woof. Vamos a ayudar a un adulto. ¡Tú puedes!',
        pitch: 1.0,
        rate: 0.9,
        bg: '#e3f2fd'
    },
    niño: {
        img: 'niño.png',
        name: 'Pandi',
        greeting: '¡Hola! Soy Pandi. ¡Elegiste ayudar a un niño! ¡Qué valiente!',
        pitch: 1.6,
        rate: 1.0,
        bg: '#fff3e0'
    },
    bebe: {
        img: 'bebe.png',
        name: 'Pío',
        greeting: '¡Pío pío! Soy Pío. Vamos a cuidar a un bebé con mucho amor.',
        pitch: 2.0,
        rate: 0.9,
        bg: '#fce4ec'
    }
};

// Estado de la app
let currentSteps = [];
let currentStep = 0;
let rcpType = 'niño'; // Por defecto
let voiceEnabled = true; // Voz activada para niños
let metronomeInterval = null;
let audioCtx = null;

// Elementos DOM
const avatarImg = document.getElementById('avatar-img');
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
    // Cambiar la imagen
    avatarImg.src = char.img;
    avatarImg.alt = char.name;
    // Color de fondo del contenedor (por si la imagen tarda)
    document.getElementById('character-avatar').style.background = char.bg;
    // Saludo en el bocadillo
    bubbleText.textContent = char.greeting;
    // Voz
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

// Al tocar el avatar, repite el paso actual o el saludo
document.getElementById('character-avatar').addEventListener('click', () => {
    const char = characters[rcpType];
    if (currentSteps.length > 0 && currentStep < currentSteps.length) {
        const step = currentSteps[currentStep];
        speak(step.text, char.pitch, char.rate);
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

// Inicializar con Pandi (niño) seleccionado
setCharacter('niño');
document.querySelector('.type-btn[data-type="niño"]').classList.add('selected');

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW registrado'))
            .catch(err => console.error('Error SW', err));
    });
}
