const GUARDIANS = [
  { id:'hoodie', name:'Hoodie', role:'Calma bajo presión', accent:'#ff4fa0', accentGlow:'rgba(255,79,160,0.5)',
    greet:'Estás en una emergencia, pero yo te guío paso a paso.', hasPoses:true, poseSteps:{1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1}, hasIdle:true },
  { id:'pulse', name:'Pulse', role:'Ritmo y precisión', accent:'#3ddaf0', accentGlow:'rgba(61,218,240,0.5)',
    greet:'Estás en una emergencia, pero yo te guío paso a paso.', hasPoses:true, poseSteps:{1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1}, hasIdle:true },
  { id:'astro', name:'Astro', role:'Guía sereno', accent:'#ff8a3d', accentGlow:'rgba(255,138,61,0.5)',
    greet:'Estás en una emergencia, pero yo te guío paso a paso.', hasPoses:true, poseSteps:{1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1}, hasIdle:true },
  { id:'bunny', name:'Bunny', role:'Voz suave y clara', accent:'#ffb347', accentGlow:'rgba(255,179,71,0.5)',
    greet:'Estás en una emergencia, pero yo te guío paso a paso.', hasPoses:true, poseSteps:{1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1}, hasIdle:true }
];

// Static fallback avatar (used when a specific pose file doesn't exist yet)
function staticAvatar(id){ return `assets/guardians/${id}.jpg`; }
// Pose image for guardians with hasPoses = true. poseKey: 'greet' | 'idle' | 'step1'..'step10'
function poseAvatar(id, poseKey){ return `assets/guardians/${id}/${poseKey}.webp`; }

// Resolves the best available image for a given guardian + pose, falling back to static avatar
function resolveAvatar(g, poseKey){
  if (!g.hasPoses) return staticAvatar(g.id);
  if (poseKey === 'greet') return poseAvatar(g.id, 'greet');
  if (poseKey === 'idle') return g.hasIdle ? poseAvatar(g.id, 'idle') : staticAvatar(g.id);
  const stepNum = parseInt(poseKey.replace('step',''), 10);
  if (g.poseSteps && g.poseSteps[stepNum]) return poseAvatar(g.id, poseKey);
  return staticAvatar(g.id);
}

// Sets an <img> src with automatic fallback to the guardian's static avatar if the
// pose file is missing or fails to load (e.g. a future pose not yet uploaded to the repo).
function setAvatarSrc(imgEl, g, poseKey){
  const url = resolveAvatar(g, poseKey);
  const fallback = staticAvatar(g.id);
  imgEl.onerror = () => {
    if (imgEl.src.indexOf(fallback) === -1){
      imgEl.onerror = null;
      imgEl.src = fallback;
    }
  };
  imgEl.src = url;
}

// 10-step guide, shared pose across ages, text adapts per age where medically relevant
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
  guardian: null,
  age: 'adulto',
  stepIndex: 0,
  voiceOn: true,
  running: false,
  metronomeTimer: null
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showScreen(id){
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

function setAccent(g){
  document.documentElement.style.setProperty('--g-accent', g.accent);
  document.documentElement.style.setProperty('--g-accent-glow', g.accentGlow);
}

function renderGuardianGrid(){
  const grid = $('#guardian-grid');
  grid.innerHTML = '';
  GUARDIANS.forEach(g => {
    const card = document.createElement('button');
    card.className = 'guardian-card';
    card.dataset.accent = g.id;
    card.style.setProperty('--accent', g.accent);
    const img = resolveAvatar(g, 'greet');
    const fallback = staticAvatar(g.id);
    card.innerHTML = `
      <img src="${img}" data-fallback="${fallback}" alt="${g.name}" loading="lazy" onerror="if(this.src.indexOf(this.dataset.fallback)===-1){this.onerror=null;this.src=this.dataset.fallback;}">
      <div class="g-name">${g.name}</div>
      <div class="g-role">${g.role}</div>
    `;
    card.addEventListener('click', () => selectGuardian(g.id));
    grid.appendChild(card);
  });
}

function selectGuardian(id){
  const g = GUARDIANS.find(x => x.id === id);
  state.guardian = g;
  setAccent(g);

  setAvatarSrc($('#em-avatar'), g, 'greet');
  $('#em-name').textContent = `¡Hola! Soy ${g.name}.`;
  $('#em-text').textContent = g.greet;

  setAvatarSrc($('#guide-avatar'), g, 'idle');
  $('#guide-name').textContent = g.name;

  const now = new Date();
  const opts = { month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' };
  $('#qc-date').textContent = now.toLocaleString('es-AR', opts);

  showScreen('screen-emergency');
}

function renderStepNav(){
  const nav = $('#step-nav');
  nav.innerHTML = '';
  STEPS.forEach((s, i) => {
    const chip = document.createElement('button');
    chip.className = 'step-chip' + (i === state.stepIndex ? ' active' : '');
    chip.textContent = `${i+1}`;
    chip.title = s.title;
    chip.addEventListener('click', () => { state.stepIndex = i; renderStep(); });
    nav.appendChild(chip);
  });
}

function renderStep(){
  const s = STEPS[state.stepIndex];
  $('#step-tag').textContent = `Paso ${state.stepIndex + 1} de ${STEPS.length}`;
  $('#step-title').textContent = s.title;
  $('#step-desc').textContent = s[state.age];
  renderStepNav();

  const g = state.guardian;
  if (g) {
    setAvatarSrc($('#guide-avatar'), g, `step${state.stepIndex + 1}`);
  }

  if (state.voiceOn) speak(s.title + '. ' + s[state.age]);
}

function speak(text){
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-AR';
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

function nextStep(){
  state.stepIndex = (state.stepIndex + 1) % STEPS.length;
  renderStep();
}

function toggleVoice(){
  state.voiceOn = !state.voiceOn;
  const btn = $('#btn-voice');
  btn.textContent = state.voiceOn ? '🔊 Voz: activada' : '🔇 Voz: desactivada';
  btn.classList.toggle('on', state.voiceOn);
  if (!state.voiceOn) window.speechSynthesis.cancel();
}

function startStopGuide(){
  const btn = $('#btn-startstop');
  state.running = !state.running;
  if (state.running){
    btn.textContent = '⏹ Detener guía';
    btn.classList.add('stop');
    renderStep();
    startMetronome();
  } else {
    btn.textContent = '▶ Iniciar guía';
    btn.classList.remove('stop');
    stopMetronome();
    window.speechSynthesis.cancel();
    const g = state.guardian;
    if (g) {
      setAvatarSrc($('#guide-avatar'), g, 'idle');
    }
  }
}

let audioCtx = null;
function beep(){
  try{
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
  } catch(e){}
}

function startMetronome(){
  stopMetronome();
  const bpm = 110;
  const interval = 60000 / bpm;
  state.metronomeTimer = setInterval(beep, interval);
}
function stopMetronome(){
  if (state.metronomeTimer) clearInterval(state.metronomeTimer);
  state.metronomeTimer = null;
}

function initAgeSelect(){
  $$('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.age-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.age = btn.dataset.age;
      renderStep();
    });
  });
}

function init(){
  renderGuardianGrid();
  initAgeSelect();

  $('#btn-iniciar-rcp').addEventListener('click', () => {
    state.stepIndex = 0;
    showScreen('screen-guide');
    const g = state.guardian;
    if (g) { setAvatarSrc($('#guide-avatar'), g, 'idle'); }
    $('#step-tag').textContent = `Paso 1 de ${STEPS.length}`;
    $('#step-title').textContent = STEPS[0].title;
    $('#step-desc').textContent = STEPS[0][state.age];
    renderStepNav();
  });
  $('#btn-switch').addEventListener('click', () => showScreen('screen-select'));
  $('#btn-back-emergency').addEventListener('click', () => {
    state.running = false;
    stopMetronome();
    window.speechSynthesis.cancel();
    const btn = $('#btn-startstop');
    btn.textContent = '▶ Iniciar guía';
    btn.classList.remove('stop');
    showScreen('screen-emergency');
  });
  $('#btn-voice').addEventListener('click', toggleVoice);
  $('#btn-next-step').addEventListener('click', nextStep);
  $('#btn-startstop').addEventListener('click', startStopGuide);

  setInterval(() => {
    const base = 68 + Math.floor(Math.random()*10);
    $('#hr-value').textContent = base + ' bpm';
  }, 2600);
}

document.addEventListener('DOMContentLoaded', init);
