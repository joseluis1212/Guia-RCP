// ========================
//  RCP COMPANIONS ✨ v6.0 (Médico Chibi Asistente)
// ========================

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

const characters = {
    adulto: {
        masculino: { name:'Dr. RCP', greeting:'Soy el Dr. RCP. Sé que es difícil. Respirá hondo. Estoy aquí para ayudarte.', pitch:0.9, rate:0.9 },
        femenino: { name:'Dra. RCP', greeting:'Soy la Dra. RCP. Entiendo la situación. Vamos a superarlo juntas.', pitch:1.1, rate:0.9 }
    },
    niño: {
        masculino: { name:'Pandi', greeting:'¡Hola! Soy Pandi. Estás en una emergencia, pero yo te guío paso a paso.', pitch:1.6, rate:1.0 },
        femenino: { name:'Mika', greeting:'¡Hola! Soy Mika. No tengas miedo, juntas ayudaremos a este niño.', pitch:1.8, rate:1.0 }
    },
    bebe: {
        masculino: { name:'Pío', greeting:'Pío pío... Sé que es difícil. Vamos a cuidar al bebé juntitos.', pitch:2.0, rate:0.85 },
        femenino: { name:'Lila', greeting:'Hola... Soy Lila. Respiramos juntas. Cuidemos a este bebé con amor.', pitch:2.2, rate:0.85 }
    }
};

let currentSteps = [], currentStep = 0, rcpType = 'adulto', rcpGender = 'masculino';
let voiceEnabled = true, metronomeInterval = null, audioCtx = null, guideStarted = false;

const avatarContainer = document.getElementById('avatar-container');
const chibiMouth = document.querySelector('.chibi-mouth');
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

function updateAvatarState(state) {
    chibiMouth.classList.remove('speaking');
    if (state === 'speaking') chibiMouth.classList.add('speaking');
    if (state === 'compressing') {
        avatarContainer.classList.add('compress');
    } else {
        avatarContainer.classList.remove('compress');
    }
}

function speak(text, pitch, rate) {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch; utterance.rate = rate; utterance.lang = 'es-AR';
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.includes('es-AR')) || voices.find(v => v.lang.includes('es-ES'));
    if (pref) utterance.voice = pref;
    updateAvatarState('speaking');
    utterance.onend = () => {
        if (guideStarted && currentStep < currentSteps.length) {
            const step = currentSteps[currentStep];
            updateAvatarState(step && step.metronome ? 'compressing' : 'idle');
        } else updateAvatarState('idle');
    };
    utterance.onerror = () => updateAvatarState('idle');
    window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    voiceBtn.textContent = voiceEnabled ? '🔊 Voz: Activada' : '🔇 Voz: Apagada';
    if (!voiceEnabled) window.speechSynthesis.cancel();
}

function beep(d=80, f=880) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = f; o.type = 'square'; g.gain.value = 0.4;
    o.start(); o.stop(audioCtx.currentTime + d/1000);
}
function startMetronome() {
    if (metronomeInterval) return;
    beep(100, 880);
    metronomeInterval = setInterval(() => beep(100, 880), 545);
    avatarContainer.classList.add('compress');
    metroStart.disabled = true; metroStop.disabled = false;
}
function stopMetronome() {
    if (metronomeInterval) { clearInterval(metronomeInterval); metronomeInterval = null; }
    avatarContainer.classList.remove('compress');
    metroStart.disabled = false; metroStop.disabled = true;
}

function showStep(index) {
    if (index < currentSteps.length) {
        const step = currentSteps[index];
        bubbleText.textContent = step.text;
        const char = characters[rcpType][rcpGender];
        speak(step.text, char.pitch, char.rate);
        if (step.metronome) { startMetronome(); updateAvatarState('compressing'); }
        else { stopMetronome(); updateAvatarState('idle'); }
        metronomeBox.style.display = step.metronome ? 'block' : 'none';
        nextBtn.textContent = (index === currentSteps.length - 1) ? '🔄 Repetir' : '⏭ Siguiente';
        nextBtn.disabled = false;
    } else {
        currentStep = 0;
        showStep(0);
    }
}

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        rcpType = btn.dataset.type;
        if (!guideStarted) {
            const char = characters[rcpType][rcpGender];
            bubbleText.textContent = char.greeting;
            if (voiceEnabled) speak(char.greeting, char.pitch, char.rate);
        }
    });
});

genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        rcpGender = btn.dataset.gender;
        if (!guideStarted) {
            const char = characters[rcpType][rcpGender];
            bubbleText.textContent = char.greeting;
            if (voiceEnabled) speak(char.greeting, char.pitch, char.rate);
        }
    });
});

startBtn.addEventListener('click', () => {
    guideStarted = true;
    startBtn.classList.add('guide-active');
    nextBtn.classList.add('visible');
    nextBtn.disabled = true;
    if (rcpType === 'adulto') currentSteps = stepsAdulto;
    else if (rcpType === 'niño') currentSteps = stepsNiño;
    else currentSteps = stepsBebe;
    currentStep = 0;
    showStep(currentStep);
    startBtn.style.display = 'none';
    nextBtn.style.display = 'flex';
});

nextBtn.addEventListener('click', () => {
    currentStep++;
    if (currentStep >= currentSteps.length) currentStep = 0;
    showStep(currentStep);
});

voiceBtn.addEventListener('click', toggleVoice);
metroStart.addEventListener('click', startMetronome);
metroStop.addEventListener('click', stopMetronome);

document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * 4;
    pupils.forEach(p => p.style.transform = `translate(${x}px, ${y}px)`);
});
document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const x = (t.clientX / window.innerWidth - 0.5) * 4;
    const y = (t.clientY / window.innerHeight - 0.5) * 4;
    pupils.forEach(p => p.style.transform = `translate(${x}px, ${y}px)`);
});

window.addEventListener('load', () => {
    const char = characters[rcpType][rcpGender];
    bubbleText.textContent = char.greeting;
    setTimeout(() => { if (voiceEnabled) speak(char.greeting, char.pitch, char.rate); }, 600);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registrado'))
        .catch(err => console.error('Error SW', err));
}
