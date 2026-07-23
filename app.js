// ========================
//  GUARDIANES DE LA VIDA — vFinal con vida (respiración + habla)
// ========================

const IMG_EXT = 'webp';             // Cambiar a 'png' si tus imágenes son .png
const FOLDER_NAMES = {
  hoodie: 'Hoodie',
  pulse:  'Pulse',
  astro:  'Astro',
  bunny:  'Bunny'
};

const GUARDIANS = [
  { id: 'hoodie', name: 'Hoodie', role: 'Calma bajo presión', accent: '#ff4fa0', greet: 'Estoy aquí para guiarte. Mantené la calma.' },
  { id: 'pulse',  name: 'Pulse',  role: 'Ritmo y precisión',   accent: '#3ddaf0', greet: 'Vamos a seguir el ritmo correcto.' },
  { id: 'astro',  name: 'Astro',  role: 'Guía sereno',          accent: '#ff8a3d', greet: 'Respirá hondo, yo me encargo de los pasos.' },
  { id: 'bunny',  name: 'Bunny',  role: 'Voz suave y clara',    accent: '#ffb347', greet: 'Te voy a guiar con mucha claridad.' }
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
  guardian: GUARDIANS[0],
  age: 'adulto',
  stepIndex: 0,
  voiceOn: true,
  running: false,
  metronomeTimer: null
};

const $ = (sel) => document.querySelector(sel);

/* ── Rutas de imágenes ── */
function getAssetPath(guardianId, pose) {
  const folder = FOLDER_NAMES[guardianId] || guardianId;
  return `assets/guardians/${folder}/${pose}.${IMG_EXT}`;
}

function setAvatar(imgElement, guardianId, pose) {
  if (!imgElement) return;
  const primary = getAssetPath(guardianId, pose);
  const fallback = getAssetPath(guardianId, 'idle');
  imgElement.onerror = function() {
    if (this.src !== fallback) {
      this.onerror = null;
      this.src = fallback;
    }
  };
  imgElement.src = primary;
}

/* ── Animación de habla ── */
function setSpeaking(guardianId, isSpeaking) {
  const guideImg = $('#guide-avatar');
  if (guideImg) {
    guideImg.classList.toggle('speaking', isSpeaking);
  }
  // Opcional: también en la pantalla de emergencia
  const emImg = $('#em-avatar');
  if (emImg) {
    emImg.classList.toggle('speaking', isSpeaking);
  }
}

/* ── Pantallas ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ── Guardián ── */
function setGuardian(g, speakGreeting = false) {
  state.guardian = g;
  setAvatar($('#em-avatar'), g.id, 'idle');
  setAvatar($('#guide-avatar'), g.id, 'idle');
  const emName = $('#em-name');
  const emText = $('#em-text');
  if (emName) emName.textContent = g.name;
  if (emText) emText.textContent = g.greet;
  document.querySelectorAll('.glow-ring').forEach(ring => ring.style.background = g.accent);
  if (speakGreeting && state.voiceOn) speak(g.greet);
}

function renderGuardianGrid() {
  const grid = $('#guardian-grid');
  if (!grid) return;
  grid.innerHTML = '';
  GUARDIANS.forEach(g => {
    const card = document.createElement('button');
    card.className = 'guardian-card';
    card.dataset.accent = g.id;
    const imgPath = getAssetPath(g.id, 'idle');
    card.innerHTML = `
      <img src="${imgPath}" alt="${g.name}" onerror="this.onerror=null;this.src='${g.id}.png';" class="guardian-img">
      <div class="g-name">${g.name}</div>
      <div class="g-role">${g.role}</div>
    `;
    card.addEventListener('click', () => {
      setGuardian(g, true);
      showScreen('screen-emergency');
    });
    grid.appendChild(card);
  });
}

/* ── Pasos ── */
function renderStep() {
  if (!state.running) return;
  const s = STEPS[state.stepIndex];
  const stepTag = $('#step-tag');
  const stepTitle = $('#step-title');
  const stepDesc = $('#step-desc');
  if (stepTag) stepTag.textContent = `Paso ${state.stepIndex + 1} de ${STEPS.length}`;
  if (stepTitle) stepTitle.textContent = s.title;
  if (stepDesc) stepDesc.textContent = s[state.age];
  const progress = ((state.stepIndex + 1) / STEPS.length) * 100;
  const progressFill = $('#progress-fill');
  if (progressFill) progressFill.style.width = progress + '%';
  const pose = `step${state.stepIndex + 1}`;
  setAvatar($('#guide-avatar'), state.guardian.id, pose);
  if (state.voiceOn) speak(s.title + '. ' + s[state.age]);
}

/* ── Voz ── */
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-AR';
  u.rate = 1;

  setSpeaking(state.guardian.id, true);
  u.onend = () => setSpeaking(state.guardian.id, false);
  u.onerror = () => setSpeaking(state.guardian.id, false);
  window.speechSynthesis.speak(u);
}

function toggleVoice() {
  state.voiceOn = !state.voiceOn;
  const btn = $('#btn-voice');
  if (!btn) return;
  btn.textContent = state.voiceOn ? '🔊 Voz: activada' : '🔇 Voz: desactivada';
  btn.classList.toggle('on', state.voiceOn);
  if (!state.voiceOn) {
    window.speechSynthesis.cancel();
    setSpeaking(state.guardian.id, false);
  }
}

/* ── Navegación ── */
function nextStep() {
  state.stepIndex = (state.stepIndex + 1) % STEPS.length;
  renderStep();
}
function repeatStep() { renderStep(); }

/* ── Metrónomo ── */
let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
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

/* ── Control de la guía ── */
function startStopGuide() {
  const btn = $('#btn-startstop');
  if (!btn) return;
  state.running = !state.running;
  if (state.running) {
    btn.textContent = '⏹ Detener guía';
    btn.classList.add('btn-stop'); btn.classList.remove('btn-start');
    const next = $('#btn-next-step'); if (next) next.disabled = false;
    const repeat = $('#btn-repeat-step'); if (repeat) repeat.disabled = false;
    renderStep(); startMetronome();
  } else {
    btn.textContent = '▶ Iniciar guía';
    btn.classList.add('btn-start'); btn.classList.remove('btn-stop');
    const next = $('#btn-next-step'); if (next) next.disabled = true;
    const repeat = $('#btn-repeat-step'); if (repeat) repeat.disabled = true;
    stopMetronome(); window.speechSynthesis.cancel();
    setSpeaking(state.guardian.id, false);
    setAvatar($('#guide-avatar'), state.guardian.id, 'idle');
  }
}

function exitGuide() {
  state.running = false;
  stopMetronome(); window.speechSynthesis.cancel();
  setSpeaking(state.guardian.id, false);
  const btn = $('#btn-startstop');
  if (btn) {
    btn.textContent = '▶ Iniciar guía';
    btn.classList.add('btn-start'); btn.classList.remove('btn-stop');
  }
  const next = $('#btn-next-step'); if (next) next.disabled = true;
  const repeat = $('#btn-repeat-step'); if (repeat) repeat.disabled = true;
  setAvatar($('#guide-avatar'), state.guardian.id, 'idle');
  showScreen('screen-emergency');
}

/* ── Inicialización ── */
function init() {
  setGuardian(GUARDIANS[0], false);
  renderGuardianGrid();

  // Intro
  const introStartBtn = $('#intro-start-btn');
  if (introStartBtn) {
    introStartBtn.addEventListener('click', () => {
      const intro = document.getElementById('intro-screen');
      const main = document.getElementById('main-app');
      if (intro) intro.classList.add('hidden');
      if (main) main.style.display = 'block';
    });
  }

  // Eventos de botones
  const btnIniciar = $('#btn-iniciar-rcp');
  if (btnIniciar) btnIniciar.addEventListener('click', () => {
    state.stepIndex = 0;
    showScreen('screen-guide');
    renderStep();
  });
  const btnSwitch = $('#btn-switch');
  if (btnSwitch) btnSwitch.addEventListener('click', () => showScreen('screen-select'));
  const btnBack = $('#btn-back-emergency');
  if (btnBack) btnBack.addEventListener('click', () => showScreen('screen-emergency'));
  const btnExit = $('#btn-exit-guide');
  if (btnExit) btnExit.addEventListener('click', exitGuide);
  const btnVoice = $('#btn-voice');
  if (btnVoice) btnVoice.addEventListener('click', toggleVoice);
  const btnNext = $('#btn-next-step');
  if (btnNext) btnNext.addEventListener('click', nextStep);
  const btnRepeat = $('#btn-repeat-step');
  if (btnRepeat) btnRepeat.addEventListener('click', repeatStep);
  const btnStartStop = $('#btn-startstop');
  if (btnStartStop) btnStartStop.addEventListener('click', startStopGuide);

  // Selector de edad
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.age = btn.dataset.age;
      if (state.running) renderStep();
    });
  });

  // Desbloquear audio en iOS
  document.body.addEventListener('touchstart', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);
