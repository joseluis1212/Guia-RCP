// ========================
//  GUARDIANES DE LA VIDA ✨ (v10 final)
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

// Asignación fija de guardián por tipo de paciente
const guardianByType = {
    adulto: 'bunny',
    niño: 'hoodie',
    bebe: 'pulse'
};

const guardianVoices = {
    bunny: { pitch: 1.2, rate: 0.9 },
    hoodie: { pitch: 1.5, rate: 1.1 },
    astro: { pitch: 0.9, rate: 0.85 },
    pulse: { pitch: 1.0, rate: 0.95 }
};

let currentSteps = [], currentStep = 0, rcpType = 'niño', rcpGender = 'masculino';
let voiceEnabled = true, metronomeInterval = null, audioCtx = null, guideStarted = false;

const avatarContainer = document.getElementById('avatar-container');
const bubbleText = document.getElementById('bubble-text');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const homeBtn = document.getElementById('home-btn');
const voiceBtn = document.getElementById('voice-btn');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');
const typeBtns = document.querySelectorAll('.type-btn');
const genderBtns = document.querySelectorAll('.gender-btn');
const pupils = document.querySelectorAll('.pupil');
const navBtns = document.getElementById('nav-btns');
const introScreen = document.getElementById('intro-screen');
const mainApp = document.getElementById('main-app');
const introStartBtn = document.getElementById('intro-start-btn');

function switchGuardian(guardian) {
    document.querySelectorAll('.guardian').forEach(g => g.style.display = 'none');
    const active = document.getElementById(guardian);
    if (active) active.style.display = 'block';
}

function updateMouth(guardian, state) {
    const mouth = document.querySelector(`#${guardian} .guardian-mouth`);
    if (mouth) {
        mouth.classList.remove('speaking');
        if (state === 'speaking') mouth.classList.add('speaking');
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

    const currentGuardian = guardianByType[rcpType];
    updateMouth(currentGuardian, 'speaking');

    utterance.onend = () => {
        updateMouth(currentGuardian, 'idle');
        if (guideStarted && currentStep < currentSteps.length) {
            const step = currentSteps[currentStep];
            if (step && step.metronome) {
                avatarContainer.classList.add('compress');
            } else {
                avatarContainer.classList.remove('compress');
            }
        }
    };
    utterance.onerror = () => updateMouth(currentGuardian, 'idle');
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
    if (index >= 0 && index < currentSteps.length) {
        currentStep = index;
        const step = currentSteps[currentStep];
        const guardian = guardianByType[rcpType];
        switchGuardian(guardian);
        bubbleText.textContent = step.text;
        const voice = guardianVoices[guardian];
        speak(step.text, voice.pitch, voice.rate);
        if (step.metronome) { startMetronome(); avatarContainer.classList.add('compress'); }
        else { stopMetronome(); avatarContainer.classList.remove('compress'); }
        metronomeBox.style.display = step.metronome ? 'block' : 'none';
        nextBtn.textContent = (currentStep === currentSteps.length - 1) ? '🔄 Repetir' : '⏭ Siguiente';
        nextBtn.disabled = false;
        backBtn.disabled = (currentStep === 0);
    }
}

function goToHome() {
    guideStarted = false;
    currentSteps = [];
    currentStep = 0;
    stopMetronome();
    startBtn.style.display = 'block';
    navBtns.style.display = 'none';
    homeBtn.style.display = 'none';
    const guardian = guardianByType[rcpType];
    switchGuardian(guardian);
    const names = { adulto: 'Bunny', niño: 'Hoodie', bebe: 'Pulse' };
    bubbleText.textContent = `Soy ${names[rcpType]}, tu asistente para ${rcpType === 'adulto' ? 'Adulto' : rcpType === 'niño' ? 'Niño' : 'Bebé'}. Presioná "Iniciar Guía".`;
    metronomeBox.style.display = 'none';
}

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        rcpType = btn.dataset.type;
        if (!guideStarted) {
            const guardian = guardianByType[rcpType];
            switchGuardian(guardian);
            const names = { adulto: 'Bunny', niño: 'Hoodie', bebe: 'Pulse' };
            bubbleText.textContent = `Soy ${names[rcpType]}, tu asistente para ${rcpType === 'adulto' ? 'Adulto' : rcpType === 'niño' ? 'Niño' : 'Bebé'}. Presioná "Iniciar Guía".`;
            if (voiceEnabled) speak(bubbleText.textContent, guardianVoices[guardian].pitch, guardianVoices[guardian].rate);
        }
    });
});

genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        rcpGender = btn.dataset.gender;
    });
});

startBtn.addEventListener('click', () => {
    guideStarted = true;
    startBtn.style.display = 'none';
    navBtns.style.display = 'flex';
    homeBtn.style.display = 'block';
    if (rcpType === 'adulto') currentSteps = stepsAdulto;
    else if (rcpType === 'niño') currentSteps = stepsNiño;
    else currentSteps = stepsBebe;
    currentStep = 0;
    showStep(currentStep);
});

nextBtn.addEventListener('click', () => {
    if (currentStep < currentSteps.length - 1) {
        showStep(currentStep + 1);
    } else {
        showStep(0);
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
});

homeBtn.addEventListener('click', goToHome);

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

// Inicio de la aplicación
window.addEventListener('load', () => {
    // Mostrar intro
    introScreen.classList.remove('hidden');
    mainApp.style.display = 'none';

    introStartBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        mainApp.style.display = 'block';
        // Inicializar con Hoodie (niño) como predeterminado
        rcpType = 'niño';
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
        document.querySelector('.type-btn[data-type="niño"]').classList.add('selected');
        const guardian = guardianByType[rcpType];
        switchGuardian(guardian);
        const msg = `¡Hola! Soy Hoodie, tu entrenador personal. Seleccioná el tipo de RCP y presioná "Iniciar Guía".`;
        bubbleText.textContent = msg;
        setTimeout(() => { if (voiceEnabled) speak(msg, guardianVoices.hoodie.pitch, guardianVoices.hoodie.rate); }, 600);
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
