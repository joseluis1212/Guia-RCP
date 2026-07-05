// ========================
//  GUÍA DE RCP - ARGENTINA 2026
//  Fuente: Argentina.gob.ar (actualizado a agosto 2025)
//  Secuencia 30:2 para Adulto, Niño y Bebé
// ========================

const stepsAdulto = [
  { title: "Paso 1: Seguridad", text: "Verificá que la escena sea segura para vos y la víctima (sin fuego, electricidad, gases).", metronome: false },
  { title: "Paso 2: Consciencia", text: "Sacudí suavemente los hombros y preguntale en voz alta: ¿Estás bien?", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Si no responde, llamá al 107 (SAME) o 911. Poné el altavoz y pedí un Desfibrilador Externo Automático (DEA).", metronome: false },
  { title: "Paso 4: Vía aérea", text: "Abrí la vía aérea: incliná la cabeza hacia atrás y elevá el mentón.", metronome: false },
  { title: "Paso 5: Verificar respiración", text: "Mirá, escuchá y sentí la respiración durante 10 segundos. Si no respira normalmente (jadeo/boqueo), iniciá RCP.", metronome: false },
  { title: "Paso 6: Compresiones (30)", text: "Colocá el talón de una mano en el centro del esternón, la otra encima. Brazos rectos. Comprimí entre 5 y 6 cm.", metronome: true },
  { title: "Paso 7: Ritmo", text: "Realizá 30 compresiones a un ritmo de 100-120 por minuto. Dejá que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 8: Ventilaciones (2)", text: "Si estás entrenado, realizá 2 insuflaciones boca a boca (sellá la nariz). Si no, continuá con solo compresiones.", metronome: false },
  { title: "Paso 9: Continuar", text: "Alterná 30 compresiones y 2 ventilaciones. Si hay un DEA, encendelo, colocá los parches y seguí sus instrucciones. No pares hasta que llegue ayuda o la persona reaccione.", metronome: true },
  { title: "Paso 10: Posición de seguridad", text: "Si la persona recupera la conciencia, colocala de costado (posición lateral de seguridad) y vigilá su respiración hasta que llegue la ayuda.", metronome: false }
];

const stepsNiño = [
  { title: "Paso 1: Seguridad", text: "Asegurate de que la zona sea segura.", metronome: false },
  { title: "Paso 2: Consciencia", text: "Sacudí suavemente al niño y preguntale: ¿Estás bien?", metronome: false },
  { title: "Paso 3: Primeros 2 min. de RCP", text: "Si estás solo, iniciá 2 minutos de RCP (30 compresiones + 2 ventilaciones) antes de llamar.", metronome: true },
  { title: "Paso 4: Llamar a emergencias", text: "Después de los 2 minutos (o si hay otra persona), llamá al 107 o 911 y pedí un DEA.", metronome: false },
  { title: "Paso 5: Vía aérea", text: "Incliná la cabeza hacia atrás suavemente y elevá el mentón.", metronome: false },
  { title: "Paso 6: Verificar respiración", text: "Mirá, escuchá y sentí la respiración durante no más de 10 segundos.", metronome: false },
  { title: "Paso 7: Compresiones (30)", text: "Usá una mano (niños pequeños) o dos manos (niños grandes) en el centro del pecho. Comprimí cerca de 5 cm.", metronome: true },
  { title: "Paso 8: Ritmo", text: "Realizá 30 compresiones a 100-120 por minuto. Dejá que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 9: Ventilaciones (2)", text: "Dales 2 insuflaciones boca a boca (tapando la nariz) de 1 segundo cada una. Si no estás entrenado, continuá solo con compresiones.", metronome: false },
  { title: "Paso 10: Continuar", text: "Alterná 30 compresiones y 2 ventilaciones. Si hay un DEA, usalo apenas llegue. No pares hasta que llegue ayuda o el niño reaccione.", metronome: true },
  { title: "Paso 11: Posición de seguridad", text: "Si el niño recupera la conciencia, colocalo de costado en posición lateral de seguridad y vigilá su respiración.", metronome: false }
];

const stepsBebe = [
  { title: "Paso 1: Seguridad", text: "Asegurate de que la escena sea segura.", metronome: false },
  { title: "Paso 2: Consciencia", text: "Sacudí suavemente o palmoteá la planta del pie. Observá si reacciona.", metronome: false },
  { title: "Paso 3: Primeros 2 min. de RCP", text: "Si estás solo, iniciá 2 minutos de RCP (30 compresiones + 2 ventilaciones) antes de llamar.", metronome: true },
  { title: "Paso 4: Llamar a emergencias", text: "Después de los 2 minutos (o si hay otra persona), llamá al 107 o 911 y pedí un DEA pediátrico si es posible.", metronome: false },
  { title: "Paso 5: Vía aérea", text: "Colocá la cabeza en posición neutra (sin extender demasiado) y elevá el mentón con cuidado.", metronome: false },
  { title: "Paso 6: Verificar respiración", text: "Mirá, escuchá y sentí la respiración durante 10 segundos.", metronome: false },
  { title: "Paso 7: Compresiones (30)", text: "Usá dos dedos en el centro del esternón, justo debajo de la línea de los pezones. Comprimí hasta 4 cm.", metronome: true },
  { title: "Paso 8: Ritmo", text: "Realizá 30 compresiones a 100-120 por minuto. Dejá que el pecho se expanda completamente.", metronome: true },
  { title: "Paso 9: Ventilaciones (2)", text: "Cubrí boca y nariz del bebé con tu boca. Dales 2 insuflaciones suaves (solo un pequeño soplo de aire).", metronome: false },
  { title: "Paso 10: Continuar", text: "Alterná 30 compresiones y 2 ventilaciones. Si hay un DEA, usalo apenas llegue. No pares hasta que llegue ayuda profesional.", metronome: true },
  { title: "Paso 11: Posición de seguridad", text: "Si el bebé recupera la conciencia, colocalo de costado con cuidado, vigilando su respiración hasta que llegue la ayuda.", metronome: false }
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
  metronomeInterval = setInterval(() => beep(100, 880), 545); // ~110 BPM
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
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    rcpType = btn.getAttribute('data-type');

    startBtn.disabled = false;
    stepText.textContent = `Modo ${rcpType === 'adulto' ? 'Adulto' : rcpType === 'niño' ? 'Niño (1-8 años)' : 'Bebé (< 1 año)'} seleccionado. Presiona "Iniciar guía".`;

    stopMetronome();
    currentStep = 0;
    nextBtn.disabled = true;
    metronomeBox.style.display = 'none';
  });
});

// --- Eventos ---
startBtn.addEventListener('click', () => {
  if (!rcpType) return;
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

// --- Service Worker ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Error SW:', err));
  });
}
