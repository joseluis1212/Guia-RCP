// ========================
//  GUARDIANES DE LA VIDA ✨ (v7 – Asignación fija + retroceso)
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
    adulto: 'bunny',   // Instructor cálido
    niño: 'hoodie',    // Entrenador energético
    bebe: 'pulse'      // Asistente tecnológico
};

const guardianVoices = {
    bunny: { pitch: 1.2, rate: 0.9 },
    hoodie: { pitch: 1.5, rate: 1.1 },
    astro: { pitch: 0.9, rate: 0.85 },
    pulse: { pitch: 1.0, rate: 0.95 }
};

let currentSteps = [], currentStep = 0, rcpType = 'adulto', rcpGender = 'masculino';
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

function switchGuardian(guardian) {
    document.querySelectorAll('.guardian').forEach(g => g.style.display = 'none');
    document.getElementById(guardian).style.display = 'block';
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
        // Habilitar botón atrás si no es el primer paso
        backBtn.disabled = (currentStep === 0);
        // Ajuste visual de botón inicio (siempre visible durante la guía)
    }
}

function goToHome() {
    // Volver al estado inicial
    guideStarted = false;
    currentSteps = [];
    currentStep = 0;
    stopMetronome();
    // Mostrar pantalla de selección
    startBtn.style.display = 'block';
    navBtns.style.display = 'none';
    homeBtn.style.display = 'none';
    // Mostrar guardian predeterminado (Hoodie para adulto por defecto, pero como adulto está seleccionado, debería mostrar Bunny según la asignación)
    // Como rcpType puede haber sido cambiado, mostramos el guardian correspondiente al tipo actual
    const guardian = guardianByType[rcpType];
    switchGuardian(guardian);
    bubbleText.textContent = `Soy ${guardian === 'bunny' ? 'Bunny' : guardian === 'hoodie' ? 'Hoodie' : guardian === 'pulse' ? 'Pulse' : 'Astro'}, tu asistente. Seleccioná el tipo de RCP.`;
    // Ocultar metrónomo
    metronomeBox.style.display = 'none';
    // Asegurar que los botones de tipo/género estén activos
}

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        rcpType = btn.dataset.type;
        // Si la guía no ha comenzado, cambiar inmediatamente el guardián
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
        // Si es el último paso y presiona "Repetir", ir al paso 0
        showStep(0);
    }
});

backBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        showStep(currentStep - 1);
    }
});

homeBtn.addEventListener('click', () => {
    goToHome();
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

// Inicialización
window.addEventListener('load', () => {
    // Hoodie es el personaje predeterminado (para Niño), pero como adulto está seleccionado por defecto, mostramos el guardian correspondiente a adulto.
    // Para cumplir con el requisito de que Hoodie sea el predeterminado, debemos forzar que el tipo seleccionado por defecto sea "niño" en lugar de "adulto".
    // Cambiamos: seleccionar "niño" por defecto en los botones.
    // Así que vamos a modificar el HTML inicial: en los botones, "niño" tendrá la clase 'selected' y adulto no.
    // En el index.html ya cambié a que el botón "niño" tenga selected (ver arriba).
    // Pero también necesitamos que el código refleje eso. La variable rcpType inicial está en 'adulto', la pasamos a 'niño'.
    // Lo haré aquí.
    rcpType = 'niño';  // Forzar a niño al inicio
    // Actualizar botones: marcar niño como selected (ya está en HTML pero por las dudas)
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector('.type-btn[data-type="niño"]').classList.add('selected');
    const guardian = guardianByType[rcpType]; // 'hoodie'
    switchGuardian(guardian);
    const msg = `¡Hola! Soy Hoodie, tu entrenador personal. Seleccioná el tipo de RCP y presioná "Iniciar Guía".`;
    bubbleText.textContent = msg;
    setTimeout(() => { if (voiceEnabled) speak(msg, guardianVoices.hoodie.pitch, guardianVoices.hoodie.rate); }, 600);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
