// script.js - slideshow, countdown and confetti
(() => {
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
    showSlide(0);
  }

  // start
  startCountdown();

  // allow skipping
  overlay.addEventListener('click', ()=>{ clearInterval(countdownInterval); closeOverlay(); });
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { clearInterval(countdownInterval); closeOverlay(); }});

  // slide navigation: click to advance
  document.getElementById('nextBtn').addEventListener('click', ()=> showSlide(1));
  document.getElementById('slides').addEventListener('click', (e)=>{
    // avoid clicks on links
    if(e.target.tagName.toLowerCase() === 'a' || e.target.closest('.btn')) return;
    showSlide(Math.min(idx+1, slides.length-1));
  });

  // keyboard navigation
  window.addEventListener('keydown', (e)=>{
    if(document.getElementById('overlay')) return; // don't nav while overlay
    if(e.key === 'ArrowRight') showSlide(Math.min(idx+1, slides.length-1));
    if(e.key === 'ArrowLeft') showSlide(Math.max(idx-1, 0));
  });

  // simple confetti (CSS-particles)
  document.getElementById('confetti').addEventListener('click', ()=>{
    launchConfetti(50);
  });

  function launchConfetti(n){
    const container = document.getElementById('confettiCanvas');
    for(let i=0;i<n;i++){
      const el = document.createElement('div');
      el.className = 'c-piece';
      el.style.left = Math.random()*100 + '%';
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

  // initial positioning
  showSlide(0);
})();
