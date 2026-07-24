// ========================
//  GUÍA DE RCP - LÓGICA
// ========================

const stepsAdulto = [
  { title: "Paso 1: Consciencia", text: "Sacude suavemente a la persona y pregúntale en voz alta: ¿Estás bien?", metronome: false },
  { title: "Paso 2: Llamar a emergencias", text: "Si no responde, llama al 911 (o a tu número local de emergencias). Pon el altavoz y pide un desfibrilador (DEA).", metronome: false },
  { title: "Paso 3: Vía aérea", text: "Abre la vía aérea: inclina la cabeza hacia atrás y eleva el mentón.", metronome: false },
  { title: "Paso 4: Verificar respiración", text: "Mira, escucha y siente si respira normalmente durante 10 segundos.", metronome: false },
  { title: "Paso 5: Compresiones", text: "Si no respira normalmente, inicia compresiones torácicas. Coloca el talón de una mano en el centro del pecho, la otra encima. Brazos rectos.", metronome: true },
  { title: "Paso 6: Ritmo y profundidad", text: "Comprime fuerte y rápido: al menos 5 cm de profundidad, a un ritmo de 100-120 por minuto. Deja que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 7: Ventilaciones (opcional)", text: "Si estás entrenado, tras 30 compresiones da 2 ventilaciones boca a boca. Si no, continúa solo con compresiones.", metronome: false },
  { title: "Paso 8: Continuar", text: "Alterna 30 compresiones y 2 ventilaciones. No pares hasta que llegue ayuda profesional o la persona reaccione.", metronome: true }
];

const stepsNino = [
  { title: "Paso 1: Consciencia", text: "Sacude suavemente al niño y pregúntale en voz alta: ¿Estás bien? Si no responde, pide ayuda.", metronome: false },
  { title: "Paso 2: Llamar a emergencias", text: "Llama al 911 (o número local de emergencias). Pon el altavoz y solicita un DEA.", metronome: false },
  { title: "Paso 3: Vía aérea", text: "Inclina la cabeza hacia atrás suavemente y eleva el mentón.", metronome: false },
  { title: "Paso 4: Verificar respiración", text: "Mira, escucha y siente la respiración durante no más de 10 segundos.", metronome: false },
  { title: "Paso 5: Compresiones", text: "Usa una o dos manos (según el tamaño del niño) en el centro del pecho. Comprime al menos 5 cm.", metronome: true },
  { title: "Paso 6: Ritmo", text: "Mantén un ritmo de 100-120 compresiones por minuto. Deja que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 7: Ventilaciones", text: "Tras 30 compresiones, da 2 ventilaciones suaves (cubre boca del niño con la tuya, pellizca la nariz).", metronome: false },
  { title: "Paso 8: Continuar", text: "Alterna 30 compresiones y 2 ventilaciones. No pares hasta que llegue ayuda o el niño reaccione.", metronome: true }
];

const stepsBebe = [
  { title: "Paso 1: Consciencia", text: "Sacude suavemente o palmotea la planta del pie. Observa si reacciona.", metronome: false },
  { title: "Paso 2: Llamar a emergencias", text: "Si no responde, llama al 911 (o número local). Pon el altavoz y pide un DEA pediátrico si es posible.", metronome: false },
  { title: "Paso 3: Vía aérea", text: "Coloca la cabeza en posición neutra (sin extender demasiado) y eleva el mentón con cuidado.", metronome: false },
  { title: "Paso 4: Verificar respiración", text: "Mira, escucha y siente la respiración durante 10 segundos.", metronome: false },
  { title: "Paso 5: Compresiones", text: "Usa dos dedos en el centro del pecho, justo debajo de la línea de los pezones. Comprime al menos 4 cm.", metronome: true },
  { title: "Paso 6: Ritmo", text: "Realiza 100-120 compresiones por minuto. Deja que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 7: Ventilaciones", text: "Cubre boca y nariz del bebé con tu boca. Da 2 ventilaciones suaves (solo un soplo de aire).", metronome: false },
  { title: "Paso 8: Continuar", text: "Alterna 30 compresiones y 2 ventilaciones. No pares hasta que llegue ayuda profesional.", metronome: true }
];

// Estado
let currentSteps = [];
let currentStep = 0;
let rcpType = null;
let voiceEnabled = false;
let metronomeInterval = null;
let audioCtx = null;

// Elementos del DOM
const typeButtons = document.querySelectorAll('.type-btn');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const voiceBtn = document.getElementById('voice-btn');
const stepNum = document.getElementById('step-number');
const stepText = document.getElementById('step-text');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');

// --- Voz ---
function speak(text, title = '') {
  if (!voiceEnabled) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(title + '. ' + text);
  utterance.lang = 'es-ES';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  if (voiceEnabled) {
    voiceBtn.textContent = '🔊 Voz activada';
    voiceBtn.classList.remove('secondary');
    voiceBtn.classList.add('primary');
    const step = currentSteps[currentStep];
    if (step) speak(step.text, step.title);
  } else {
    voiceBtn.textContent = '🔇 Voz apagada';
    voiceBtn.classList.remove('primary');
    voiceBtn.classList.add('secondary');
    window.speechSynthesis.cancel();
  }
}

// --- Metrónomo ---
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

// --- Mostrar paso ---
function showStep(index) {
  if (index < currentSteps.length) {
    const step = currentSteps[index];
    stepNum.textContent = step.title;
    stepText.textContent = step.text;
    speak(step.text, step.title);

    if (step.metronome) {
      metronomeBox.style.display = 'block';
    } else {
      metronomeBox.style.display = 'none';
      stopMetronome();
    }

    nextBtn.textContent = (index === currentSteps.length - 1) ? '🔄 Repetir guía' : '⏭ Siguiente paso';
    nextBtn.disabled = false;
  } else {
    currentStep = 0;
    showStep(0);
  }
}

// --- Selección de tipo ---
const typeLabels = {
  adulto: 'Adulto',
  'niño': 'Niño (1-8 años)',
  bebe: 'Bebé (< 1 año)'
};

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    rcpType = btn.getAttribute('data-type');

    startBtn.disabled = false;
    stepText.textContent = `Modo ${typeLabels[rcpType]} seleccionado. Presiona "Iniciar guía".`;

    stopMetronome();
    currentStep = 0;
    nextBtn.disabled = true;
    metronomeBox.style.display = 'none';
  });
});

// --- Eventos principales ---
startBtn.addEventListener('click', () => {
  if (!rcpType) return;
  if (rcpType === 'adulto') currentSteps = stepsAdulto;
  else if (rcpType === 'niño') currentSteps = stepsNino;
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

// --- Service Worker (offline) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Error SW:', err));
  });
}
