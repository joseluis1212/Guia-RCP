// ========================
//  GUARDIANES DE LA VIDA — vFINAL corregido
// ========================

const GUARDIANS = [
  { id:'hoodie', name:'Hoodie', role:'Calma bajo presión', accent:'#ff4fa0', greet:'Estoy aquí para guiarte. Mantené la calma.' },
  { id:'pulse', name:'Pulse', role:'Ritmo y precisión', accent:'#3ddaf0', greet:'Vamos a seguir el ritmo correcto.' },
  { id:'astro', name:'Astro', role:'Guía sereno', accent:'#ff8a3d', greet:'Respirá hondo, yo me encargo de los pasos.' },
  { id:'bunny', name:'Bunny', role:'Voz suave y clara', accent:'#ffb347', greet:'Te voy a guiar con mucha claridad.' }
];

const STEPS = [
  { title:'Verificar la escena', adulto:'Confirmá que el lugar es seguro antes de acercarte.', nino:'Confirmá que el lugar es seguro antes de acercarte.', bebe:'Confirmá que el lugar es seguro antes de acercarte.' },
  { title:'Verificar respuesta', adulto:'Tocá los hombros y preguntá en voz alta si está bien.', nino:'Llamalo por su nombre y estimulalo suavemente.', bebe:'Dale palmaditas en la planta del pie para estimular respuesta.' },
  { title:'Pedir ayuda', adulto:'Llamá al 107 o pedí a alguien que lo haga. Si hay un DEA cerca, pedí que lo traigan.', nino:'Llamá al 107 o pedí a alguien que lo haga de inmediato.', bebe:'Llamá al 107 o pedí a alguien que lo haga de inmediato.' },
  { title:'Verificar la respiración', adulto:'Acercate y observá si el pecho sube y baja durante unos segundos.', nino:'Acercate y observá si el pecho sube y baja durante unos segundos.', bebe:'Acercate y observá si el pecho sube y baja durante unos segundos.' },
  { title:'Posicionar las manos', adulto:'Colocá el talón de una mano en el centro del pecho y la otra encima, dedos entrelazados.', nino:'Usá el talón de una mano (o ambas si hace falta) en el centro del pecho.', bebe:'Usá dos dedos en el centro del pecho, justo debajo de la línea de los pezones.' },
  { title:'Postura de compresión', adulto:'Brazos rectos, hombros directamente sobre las manos, rodillas firmes.', nino:'Brazos rectos, hombros sobre las manos, postura estable.', bebe:'Postura relajada, dedos firmes y controlados sobre el pecho.' },
  { title:'Compresión activa', adulto:'Empujá fuerte y rápido, al menos 5 cm de profundidad, a 100–120 por minuto.', nino:'Comprimí unos 5 cm de profundidad, a 100–120 por minuto.', bebe:'Comprimí unos 4 cm de profundidad, a 100–120 por minuto, con movimientos suaves.' },
  { title:'Retroceso completo', adulto:'Dejá que el pecho suba por completo entre una compresión y otra.', nino:'Permití que el pecho se expanda entre cada compresión.', bebe:'Permití que el pecho se expanda entre cada compresión.' },
  { title:'Ventilación de rescate', adulto:'Si estás entrenado: inclina la cabeza hacia atrás y da dos respiraciones de rescate cada 30 compresiones.', nino:'Inclina la cabeza con cuidado hacia atrás y da respiraciones suaves.', bebe:'Inclina la cabeza con mucho cuidado y da respiraciones muy suaves.' },
  { title:'Continuar / DEA', adulto:'Seguí sin parar hasta que llegue ayuda profesional o la persona reaccione. Usá el DEA si está disponible.', nino:'Seguí sin parar hasta que llegue ayuda profesional o el niño reaccione.', bebe:'Seguí sin parar hasta que llegue ayuda profesional o el bebé reaccione.' }
];

let state = {
  guardian: GUARDIANS[0], // Hoodie por defecto
  age: 'adulto',
  stepIndex: 0,
  voiceOn: true,
  running: false,
  metronomeTimer: null
};

const $ = (sel) => document.querySelector(sel);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

function setGuardian(g) {
  state.guardian = g;
  $('#em-avatar').src = g.id + '.png';
  $('#em-name').textContent = g.name;
  $('#em-text').textContent = g.greet;
  $('#guide-avatar').src = g.id + '.png';
  // Actualizar fecha en emergencia
  const now = new Date();
  $('#qc-date').textContent = now.toLocaleString('es-AR', { month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' });
}

function renderGuardianGrid() {
  const grid = $('#guardian-grid');
  grid.innerHTML = '';
  GUARDIANS.forEach(g => {
    const card = document.createElement('button');
    card.className = 'guardian-card';
    card.dataset.accent = g.id;
    card.innerHTML = `
      <img src="${g.id}.png" alt="${g.name}">
      <div class="g-name">${g.name}</div>
      <div class="g-role">${g.role}</div>
    `;
    card.addEventListener('click', () => {
      setGuardian(g);
      showScreen('screen-emergency');
    });
    grid.appendChild(card);
  });
}

function renderStep() {
  const s = STEPS[state.stepIndex];
  $('#step-tag').textContent = `Paso ${state.stepIndex + 1} de ${STEPS.length}`;
  $('#step-title').textContent = s.title;
  $('#step-desc').textContent = s[state.age];
  // Actualizar barra de progreso
  const progress = ((state.stepIndex + 1) / STEPS.length) * 100;
  $('#progress-fill').style.width = progress + '%';
  if (state.voiceOn) speak(s.title + '. ' + s[state.age]);
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-AR';
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

function nextStep() {
  state.stepIndex = (state.stepIndex + 1) % STEPS.length;
  renderStep();
}

function toggleVoice() {
  state.voiceOn = !state.voiceOn;
  const btn = $('#btn-voice');
  btn.textContent = state.voiceOn ? '🔊 Voz: activada' : '🔇 Voz: desactivada';
  btn.classList.toggle('on', state.voiceOn);
  if (!state.voiceOn) window.speechSynthesis.cancel();
}

function startStopGuide() {
  const btn = $('#btn-startstop');
  state.running = !state.running;
  if (state.running) {
    btn.textContent = '⏹ Detener guía';
    btn.classList.add('btn-stop');
    btn.classList.remove('btn-start');
    $('#btn-next-step').disabled = false;
    $('#btn-repeat-step').disabled = false;
    renderStep();
    startMetronome();
  } else {
    btn.textContent = '▶ Iniciar guía';
    btn.classList.add('btn-start');
    btn.classList.remove('btn-stop');
    $('#btn-next-step').disabled = true;
    $('#btn-repeat-step').disabled = true;
    stopMetronome();
    window.speechSynthesis.cancel();
  }
}

let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch(e) {}
}

function startMetronome() {
  stopMetronome();
  state.metronomeTimer = setInterval(beep, 60000 / 110);
}
function stopMetronome() {
  if (state.metronomeTimer) clearInterval(state.metronomeTimer);
  state.metronomeTimer = null;
}

function exitGuide() {
  state.running = false;
  stopMetronome();
  window.speechSynthesis.cancel();
  $('#btn-startstop').textContent = '▶ Iniciar guía';
  $('#btn-startstop').classList.add('btn-start');
  $('#btn-startstop').classList.remove('btn-stop');
  $('#btn-next-step').disabled = true;
  $('#btn-repeat-step').disabled = true;
  showScreen('screen-emergency');
}

function init() {
  // Configurar Hoodie como predeterminado
  setGuardian(GUARDIANS[0]);
  renderGuardianGrid();

  // Simulación de signos vitales educativa
  setInterval(() => {
    if (document.querySelector('#screen-emergency.active')) {
      $('#hr-value').textContent = (68 + Math.floor(Math.random() * 10)) + ' bpm';
    }
  }, 3000);

  // Eventos de botones
  $('#btn-iniciar-rcp').addEventListener('click', () => {
    state.stepIndex = 0;
    showScreen('screen-guide');
    renderStep();
  });

  $('#btn-switch').addEventListener('click', () => showScreen('screen-select'));
  $('#btn-back-emergency').addEventListener('click', () => showScreen('screen-emergency'));
  $('#btn-exit-guide').addEventListener('click', exitGuide);
  $('#btn-voice').addEventListener('click', toggleVoice);
  $('#btn-next-step').addEventListener('click', nextStep);
  $('#btn-repeat-step').addEventListener('click', () => renderStep());
  $('#btn-startstop').addEventListener('click', startStopGuide);

  // Selector de edad
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.age = btn.dataset.age;
      if (state.running) renderStep();
    });
  });

  // Solución para iOS: al primer toque en cualquier botón, desbloquear audio
  document.body.addEventListener('touchstart', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);
