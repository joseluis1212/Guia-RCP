// ========================
//  GUÍA DE RCP - ARGENTINA 2026
//  Basada en la guía oficial resumida por el usuario
//  Adulto: solo compresiones + DEA
//  Niño/Bebé: compresiones + ventilaciones opcionales
// ========================

const stepsAdulto = [
  { title: "Paso 1: Seguridad", text: "Verificá que la escena sea segura.", metronome: false },
  { title: "Paso 2: Evaluación", text: "Evaluá respuesta hablándole y moviéndole suavemente los hombros.", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Llamá al 107, 911 o al sistema local de emergencias.", metronome: false },
  { title: "Paso 4: Posición de manos", text: "Colocá el talón de una mano en el centro inferior del esternón y la otra mano encima.", metronome: true },
  { title: "Paso 5: Profundidad y ritmo", text: "Comprimí el tórax entre 5 y 6 cm, a 100 a 120 por minuto.", metronome: true },
  { title: "Paso 6: Compresiones (30)", text: "Hacé 30 compresiones ininterrumpidas, liberando por completo el tórax entre una y otra.", metronome: true },
  { title: "Paso 7: Continuar ciclos", text: "Continuá ciclos de RCP hasta que llegue ayuda o la víctima recupere conciencia.", metronome: true },
  { title: "Paso 8: Uso del DEA", text: "Si hay DEA, encendelo y seguí sus instrucciones.", metronome: false },
  { title: "Paso 9: Posición de recuperación", text: "Si la persona recupera el pulso o la conciencia, colocala de costado en posición de recuperación.", metronome: false }
];

const stepsNiño = [
  { title: "Paso 1: Seguridad", text: "Confirmá seguridad de la escena.", metronome: false },
  { title: "Paso 2: Evaluación", text: "Revisá si responde y si respira normalmente.", metronome: false },
  { title: "Paso 3: Llamar a emergencias", text: "Llamá a emergencias y pedí un DEA si está disponible.", metronome: false },
  { title: "Paso 4: RCP inicial (si estás solo)", text: "Si estás solo, hacé 2 minutos de RCP antes de alejarte a llamar, según la guía oficial.", metronome: true },
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
  { title: "Paso 4: RCP inicial (si estás solo)", text: "Si estás solo, la guía oficial indica hacer 2 minutos de RCP antes de ir a pedir ayuda.", metronome: true },
  { title: "Paso 5: Posición", text: "Colocá al bebé boca arriba sobre superficie firme.", metronome: false },
  { title: "Paso 6: Compresiones (30)", text: "Hacé 30 compresiones con dos dedos en el centro del esternón, entre los pezones.", metronome: true },
  { title: "Paso 7: Profundidad y ritmo", text: "La profundidad aproximada es de 4 cm, con ritmo de 100 a 120 por minuto.", metronome: true },
  { title: "Paso 8: Ventilaciones suaves", text: "Luego hacé 2 insuflaciones suaves, cubriendo boca y nariz del bebé con tu boca.", metronome: false },
  { title: "Paso 9: Duración de la insuflación", text: "Cada insuflación debe durar alrededor de 1 segundo y solo lo suficiente para elevar el tórax.", metronome: false },
  { title: "Paso 10: Continuar", text: "Repetí el ciclo hasta que llegue ayuda o el bebé se recupere.", metronome: true }
];

// ========================
//  LÓGICA DE LA APLICACIÓN
// ========================

let currentSteps = [];
let currentStep = 0;
let rcpType = null;
let voiceEnabled = false;
let metronomeInterval = null;
let audioCtx = null;

const typeButtons = document.querySelectorAll('.type-btn');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const voiceBtn = document.getElementById('voice-btn');
const stepNum = document.getElementById('step-number');
const stepText = document.getElementById('step-text');
const metroStart = document.getElementById('metro-start');
const metroStop = document.getElementById('metro-stop');
const metronomeBox = document.getElementById('metronome-box');

// Voz
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

// Metrónomo
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

// Mostrar paso
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

// Selección de tipo
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

// Eventos
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

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Error SW:', err));
  });
}
