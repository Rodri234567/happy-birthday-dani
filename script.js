// script.js (updated) - YouTube IFrame API controls, enhanced effects
let GATE_CODE = 'DANI2026'; // default code; change if you want
(() => {
  // Gate handling
  const gate = document.getElementById('gate');
  const gateBtn = document.getElementById('gateBtn');
  const gateInput = document.getElementById('gateCode');
  gateBtn.addEventListener('click', ()=>{
    if(gateInput.value.trim() === GATE_CODE){
      gate.remove();
      showOverlayAndStart();
    } else {
      gateInput.value='';
      gateInput.placeholder='Código incorrecto';
      gateInput.focus();
    }
  });
  gateInput.addEventListener('keydown',(e)=>{ if(e.key==='Enter') gateBtn.click(); });

  // overlay and slideshow
  const overlay = document.getElementById('overlay');
  const countEl = document.getElementById('count');
  let count = 10;
  let countdownInterval = null;
  const slides = document.querySelectorAll('.slide');
  let idx = 0;

  function showSlide(i){
    slides.forEach((s, n)=>{
      s.style.transform = `translateY(${(n - i) * 100}vh)`;
    });
    idx = i;
  }

  function startCountdown(){
    countEl.textContent = count;
    countdownInterval = setInterval(()=>{
      count--;
      if(count <= 0){
        clearInterval(countdownInterval);
        closeOverlay();
      }
      countEl.textContent = count;
    },1000);
  }

  function closeOverlay(){
    overlay.style.transition = 'opacity .5s ease';
    overlay.style.opacity = 0;
    setTimeout(()=>overlay.remove(),550);
    document.getElementById('slides').classList.remove('hidden');
    showSlide(0);
  }

  function showOverlayAndStart(){
    overlay.classList.remove('hidden');
    document.getElementById('slides').classList.add('hidden');
    startCountdown();
  }

  // start when gate removed otherwise wait

  // allow skipping
  overlay.addEventListener('click', ()=>{ clearInterval(countdownInterval); closeOverlay(); });
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { clearInterval(countdownInterval); closeOverlay(); }});

  // slide navigation: click to advance
  document.getElementById('nextBtn').addEventListener('click', ()=> showSlide(1));
  document.getElementById('slides').addEventListener('click', (e)=>{
    // avoid clicks on links or controls
    if(e.target.tagName.toLowerCase() === 'a' || e.target.closest('.btn') || e.target.closest('.controls')) return;
    showSlide(Math.min(idx+1, slides.length-1));
  });

  // keyboard navigation
  window.addEventListener('keydown', (e)=>{
    if(document.getElementById('overlay')) return; // don't nav while overlay
    if(e.key === 'ArrowRight') showSlide(Math.min(idx+1, slides.length-1));
    if(e.key === 'ArrowLeft') showSlide(Math.max(idx-1, 0));
  });

  // confetti
  document.getElementById('confetti').addEventListener('click', ()=>{
    launchConfetti(60);
    launchFireworks();
  });

  function launchConfetti(n){
    const container = document.getElementById('fireworks');
    for(let i=0;i<n;i++){
      const el = document.createElement('div');
      el.className = 'c-piece';
      el.style.left = Math.random()*100 + '%';
      el.style.top = Math.random()*40 + '%';
      el.style.width = (6+Math.random()*8)+'px';
      el.style.height = el.style.width;
      el.style.background = ['#ff7aa2','#ffd166','#90e0ef','#bde0fe'][Math.floor(Math.random()*4)];
      container.appendChild(el);
      // animate
      el.animate([
        {transform: 'translateY(0) rotate(0)', opacity:1},
        {transform: `translateY(${200+Math.random()*400}px) rotate(${Math.random()*720}deg)`, opacity:0}
      ],{duration:1500+Math.random()*1200,easing:'cubic-bezier(.2,.7,.2,1)'});
      setTimeout(()=>el.remove(),3000);
    }
  }

  function launchFireworks(){
    const body = document.body;
    for(let i=0;i<6;i++){
      const fx = document.createElement('div');
      fx.className = 'fw';
      fx.style.position='fixed';
      fx.style.left = (10 + Math.random()*80) + '%';
      fx.style.top = (10 + Math.random()*60) + '%';
      fx.style.pointerEvents='none';
      body.appendChild(fx);
      // create particles
      for(let p=0;p<12;p++){
        const part = document.createElement('div');
        part.style.position='absolute';
        part.style.width='6px'; part.style.height='6px'; part.style.borderRadius='50%';
        part.style.left='0'; part.style.top='0';
        part.style.background = ['#ff7aa2','#ffd166','#90e0ef','#bde0fe'][Math.floor(Math.random()*4)];
        fx.appendChild(part);
        const angle = Math.random()*Math.PI*2;
        const dist = 40 + Math.random()*120;
        part.animate([
          {transform: 'translate(0,0) scale(1)', opacity:1},
          {transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(.6)`, opacity:0}
        ],{duration:800+Math.random()*600,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
      setTimeout(()=>fx.remove(),1200);
    }
  }

  // cake hover movement is CSS (see styles)

  // YouTube Player (custom controls)
  let player;
  let playerReady = false;
  let duration = 0;
  const YOUTUBE_ID = 'T89IqbAF9Ik'; // from your link

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '120', width: '220',
      videoId: YOUTUBE_ID,
      playerVars: { 'playsinline': 1, 'controls': 0, 'rel': 0 },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerReady(e){
    playerReady = true;
    duration = player.getDuration();
    document.getElementById('dur').textContent = formatTime(duration || 0);
    // update loop
    setInterval(()=>{
      if(playerReady && (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState()===YT.PlayerState.PAUSED)){
        const cur = player.getCurrentTime();
        const pct = (duration>0)?(cur/duration*100):0;
        document.getElementById('seek').style.width = pct + '%';
        document.getElementById('cur').textContent = formatTime(cur);
      }
    },300);
  }

  function onPlayerStateChange(e){
    const btn = document.getElementById('playPause');
    if(e.data === YT.PlayerState.PLAYING) btn.textContent = 'Pausar';
    else btn.textContent = 'Play';
    if(e.data === YT.PlayerState.ENDED){ launchConfetti(80); launchFireworks(); }
  }

  document.getElementById('playPause').addEventListener('click', ()=>{
    if(!playerReady) return;
    const state = player.getPlayerState();
    if(state === YT.PlayerState.PLAYING){ player.pauseVideo(); }
    else { player.playVideo(); }
  });

  // seek by clicking the bar
  document.getElementById('bar').addEventListener('click',(e)=>{
    if(!playerReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const t = pct * duration;
    player.seekTo(t, true);
  });

  function formatTime(t){
    t = Math.floor(t||0);
    const m = Math.floor(t/60); const s = t%60;
    return m + ':' + (s<10? '0'+s : s);
  }

  // initial slide position
  showSlide(0);

})();
