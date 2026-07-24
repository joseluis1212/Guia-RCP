// GUARDIANES DE LA VIDA — CON NOVA ACCESIBLE v2
const IMG_EXT = 'webp';
const FOLDER_NAMES = { hoodie:'Hoodie', pulse:'Pulse', astro:'Astro', bunny:'Bunny', nova:'NOVA' };

const GUARDIANS = [
  { id:'nova', name:'NOVA', role:'Accesible · Voz + Ritmo', accent:'#00E5FF', greet:'Hola, soy NOVA. Te guío con voz clara y te marco el ritmo. Tranquilo, lo hacemos juntos.', accessible:true },
  { id:'hoodie', name:'Hoodie', role:'Calma bajo presión', accent:'#ff4fa0', greet:'Estoy aquí para guiarte. Mantené la calma.' },
  { id:'pulse', name:'Pulse', role:'Ritmo y precisión', accent:'#3ddaf0', greet:'Vamos a seguir el ritmo correcto.' },
  { id:'astro', name:'Astro', role:'Guía sereno', accent:'#ff8a3d', greet:'Respirá hondo, yo me encargo de los pasos.' },
  { id:'bunny', name:'Bunny', role:'Voz suave y clara', accent:'#ffb347', greet:'Te voy a guiar con mucha claridad.' }
];

const STEPS = [
  { title:'Verificar la escena', adulto:'Confirmá que el lugar es seguro. Mirá a tu alrededor.', nino:'Confirmá que el lugar es seguro.', bebe:'Confirmá que el lugar es seguro.' },
  { title:'Verificar respuesta', adulto:'Tocá los hombros y preguntá fuerte: ¿Me escuchás?', nino:'Llamalo por su nombre y estimulalo.', bebe:'Palmaditas suaves en la planta del pie.' },
  { title:'Pedir ayuda', adulto:'Llamá al 107. Poné altavoz. Pedí un DEA si hay cerca.', nino:'Llamá al 107 ya mismo.', bebe:'Llamá al 107 ya mismo.' },
  { title:'Verificar respiración', adulto:'Mirá si el pecho sube y baja por 10 segundos.', nino:'Mirá si respira.', bebe:'Mirá si respira.' },
  { title:'Posicionar manos', adulto:'Talón de una mano en el centro del pecho, otra encima, dedos entrelazados.', nino:'Una mano en el centro del pecho.', bebe:'Dos dedos en el centro del pecho.' },
  { title:'Postura correcta', adulto:'Brazos rectos, hombros sobre manos.', nino:'Brazos rectos.', bebe:'Dedos firmes.' },
  { title:'30 Compresiones', adulto:'Fuerte y rápido: 5 cm, 100 a 120 por minuto. Yo marco el ritmo.', nino:'5 cm de profundidad, 100 a 120 por minuto.', bebe:'4 cm, 100 a 120 por minuto.' },
  { title:'Dejá que suba', adulto:'Dejá que el pecho suba entre compresiones.', nino:'Dejá que el pecho suba.', bebe:'Dejá que suba.' },
  { title:'2 Ventilaciones', adulto:'Si sabés: 2 soplidos suaves cada 30 compresiones.', nino:'2 respiraciones suaves.', bebe:'2 respiraciones muy suaves.' },
  { title:'Seguí sin parar', adulto:'No pares hasta que llegue ayuda o respire. Usá el DEA si está.', nino:'Seguí hasta que llegue ayuda.', bebe:'Seguí hasta que llegue ayuda.' }
];

let state = { guardian: GUARDIANS[0], age:'adulto', stepIndex:0, voiceOn:true, running:false, metronomeTimer:null, easyMode:false };
const $ = s=>document.querySelector(s);

function getAssetPath(id, pose){
  const folder = FOLDER_NAMES[id]||id;
  return `assets/guardians/${folder}/${pose}.${IMG_EXT}`;
}
function setAvatar(imgEl, id, pose){
  if(!imgEl) return;
  const primary = getAssetPath(id, pose);
  const fallback = getAssetPath(id, 'idle');
  imgEl.onerror = function(){ if(this.src!==fallback){ this.onerror=null; this.src=fallback; } };
  imgEl.src = primary;
}
function setSpeaking(isSpeaking){
  const guide = $('#guide-avatar'); const em = $('#em-avatar');
  if(guide) guide.classList.toggle('speaking', isSpeaking);
  if(em) em.classList.toggle('speaking', isSpeaking);
}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const t=document.getElementById(id); if(t) t.classList.add('active');
}
function setGuardian(g, speakGreet=false){
  state.guardian=g;
  setAvatar($('#em-avatar'), g.id, 'idle');
  setAvatar($('#guide-avatar'), g.id, 'idle');
  const emName=$('#em-name'); const emText=$('#em-text');
  if(emName) emName.textContent=g.name;
  if(emText) emText.textContent=g.greet;
  document.querySelectorAll('.glow-ring').forEach(r=>r.style.background=g.accent);
  if(speakGreet && state.voiceOn) speak(g.greet);
}
function renderGuardianGrid(){
  const grid=$('#guardian-grid'); if(!grid) return;
  grid.innerHTML='';
  GUARDIANS.forEach(g=>{
    const card=document.createElement('button');
    card.className='guardian-card';
    card.dataset.accent=g.id;
    const imgPath=getAssetPath(g.id,'idle');
    card.innerHTML=`<img src="${imgPath}" alt="${g.name}" class="guardian-img" onerror="this.src='${imgPath}'"><div class="g-name">${g.name} ${g.accessible?'♿':''}</div><div class="g-role">${g.role}</div>`;
    card.addEventListener('click',()=>{ setGuardian(g,true); showScreen('screen-emergency'); });
    grid.appendChild(card);
  });
}
function renderStep(){
  if(!state.running) return;
  const s=STEPS[state.stepIndex];
  const tag=$('#step-tag'); const title=$('#step-title'); const desc=$('#step-desc');
  if(tag) tag.textContent=`Paso ${state.stepIndex+1} de ${STEPS.length} ${state.easyMode?'(FÁCIL)':''}`;
  if(title) title.textContent=s.title;
  let texto=s[state.age];
  if(state.easyMode) texto=texto.split('.')[0]+'. Corto y claro.';
  if(desc) desc.textContent=texto;
  const prog=((state.stepIndex+1)/STEPS.length)*100;
  const fill=$('#progress-fill'); if(fill) fill.style.width=prog+'%';
  const pose=`step${state.stepIndex+1}`;
  setAvatar($('#guide-avatar'), state.guardian.id, pose);
  // Mostrar botón ritmo solo en compresiones
  const btnRitmo=$('#btn-ritmo'); if(btnRitmo) btnRitmo.style.display=(state.stepIndex===6)?'block':'none';
  if(state.voiceOn) speak(s.title+'. '+texto);
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='es-AR'; u.rate=state.easyMode?0.85:0.95; u.pitch=1.1;
  setSpeaking(true);
  u.onend=()=>{ setSpeaking(false); document.getElementById('ritmo-visual')?.classList.remove('active'); };
  u.onerror=()=>setSpeaking(false);
  window.speechSynthesis.speak(u);
  const bubble=$('#speech-bubble'); if(bubble){ bubble.style.outline='2px solid var(--cyan)'; setTimeout(()=>bubble.style.outline='none', 800); }
}
function toggleVoice(){
  state.voiceOn=!state.voiceOn;
  const btn=$('#btn-voice'); if(!btn) return;
  btn.textContent=state.voiceOn?'🔊 Voz: activada':'🔇 Voz: desactivada';
  btn.classList.toggle('on', state.voiceOn);
  if(!state.voiceOn){ window.speechSynthesis.cancel(); setSpeaking(false); }
}
let audioCtx=null;
function beep(){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(); const gain=audioCtx.createGain();
    osc.type='sine'; osc.frequency.value=880;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+0.09);
    osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+0.1);
  }catch(e){}
}
function startMetronome(){
  stopMetronome();
  let count=0;
  const visual=$('#ritmo-visual'); const avatar=$('#guide-avatar');
  if(visual) visual.style.display='block';
  if(avatar) avatar.classList.add('ritmo');
  state.metronomeTimer=setInterval(()=>{
    count++; beep();
    if(visual) visual.textContent=`● RITMO 110 - ${count}`;
    if(navigator.vibrate) navigator.vibrate(40);
    const bubble=$('#step-desc'); if(bubble && count%5===0) bubble.textContent=`Vas ${count}... ¡Seguí fuerte!`;
    if(count>=30){ stopMetronome(); speak('¡Treinta! Si no respira, seguí.'); }
  }, 545);
}
function stopMetronome(){
  if(state.metronomeTimer) clearInterval(state.metronomeTimer);
  state.metronomeTimer=null;
  const visual=$('#ritmo-visual'); if(visual) visual.style.display='none';
  const avatar=$('#guide-avatar'); if(avatar) avatar.classList.remove('ritmo');
}
function startStopGuide(){
  const btn=$('#btn-startstop'); if(!btn) return;
  state.running=!state.running;
  if(state.running){
    btn.textContent='⏹ Detener guía'; btn.classList.add('btn-stop'); btn.classList.remove('btn-start');
    $('#btn-next-step').disabled=false; $('#btn-repeat-step').disabled=false;
    renderStep();
  }else{
    btn.textContent='▶ Iniciar guía con voz'; btn.classList.add('btn-start'); btn.classList.remove('btn-stop');
    $('#btn-next-step').disabled=true; $('#btn-repeat-step').disabled=true;
    stopMetronome(); window.speechSynthesis.cancel(); setSpeaking(false);
    setAvatar($('#guide-avatar'), state.guardian.id, 'idle');
  }
}
function exitGuide(){
  state.running=false; stopMetronome(); window.speechSynthesis.cancel(); setSpeaking(false);
  const btn=$('#btn-startstop'); if(btn){ btn.textContent='▶ Iniciar guía con voz'; btn.classList.add('btn-start'); btn.classList.remove('btn-stop'); }
  $('#btn-next-step').disabled=true; $('#btn-repeat-step').disabled=true;
  setAvatar($('#guide-avatar'), state.guardian.id, 'idle');
  showScreen('screen-emergency');
}
function init(){
  setGuardian(GUARDIANS[0], false); renderGuardianGrid();
  $('#intro-start-btn')?.addEventListener('click', ()=>{
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('main-app').style.display='block';
    if(state.voiceOn) setTimeout(()=>speak('Hola, soy NOVA, tu guardián accesible. Estoy listo para guiarte en RCP con voz y ritmo.'), 600);
  });
  $('#btn-iniciar-rcp')?.addEventListener('click', ()=>{ state.stepIndex=0; showScreen('screen-guide'); state.running=false; startStopGuide(); });
  $('#btn-switch')?.addEventListener('click', ()=>showScreen('screen-select'));
  $('#btn-back-emergency')?.addEventListener('click', ()=>showScreen('screen-emergency'));
  $('#btn-exit-guide')?.addEventListener('click', exitGuide);
  $('#btn-voice')?.addEventListener('click', toggleVoice);
  $('#btn-next-step')?.addEventListener('click', ()=>{ state.stepIndex=(state.stepIndex+1)%STEPS.length; renderStep(); });
  $('#btn-repeat-step')?.addEventListener('click', ()=>renderStep());
  $('#btn-startstop')?.addEventListener('click', startStopGuide);
  $('#btn-ritmo')?.addEventListener('click', ()=>{ if(state.metronomeTimer) stopMetronome(); else startMetronome(); });
  $('#btn-quick-voice')?.addEventListener('click', ()=>{ const t=$('#em-text').textContent; speak(t); });
  $('#btn-quick-easy')?.addEventListener('click', ()=>{
    state.easyMode=!state.easyMode;
    alert(state.easyMode?'Modo fácil activado: frases cortas y lentas':'Modo fácil desactivado');
    if(state.running) renderStep();
  });
  document.querySelectorAll('.age-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.age-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); state.age=btn.dataset.age;
      if(state.running) renderStep();
    });
  });
  document.body.addEventListener('touchstart', ()=>{ if(audioCtx && audioCtx.state==='suspended') audioCtx.resume(); }, {once:true});
}
document.addEventListener('DOMContentLoaded', init);
