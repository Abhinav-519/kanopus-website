const services=[
  ['Market Intelligence','Understand your audience, competitors, and the opportunities between them.','INSIGHTS','brain'],
  ['Conversion Optimization','Turn the right attention into meaningful customer action.','RESULTS','funnel'],
  ['Performance Marketing','Connect campaign strategy, creative, and measurement.','RESULTS','bulb'],
  ['SEO Entity Mapping','Make your expertise easier to discover and understand.','FINDABILITY','compass'],
  ['Conversion Rate Optimization','Find friction in the customer journey and improve each step.','RESULTS','search'],
  ['Predictive Analytics','Use patterns in your data to inform your next move.','INSIGHTS','growth']
];

const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileHeroQuery=window.matchMedia('(max-width: 768px)');
const header=document.querySelector('#site-header');
const navToggle=document.querySelector('#nav-toggle');
const siteNav=document.querySelector('#site-nav');
const modal=document.querySelector('#modal');

function show(title,text,tag){
  document.querySelector('#modal-title').textContent=title;
  document.querySelector('#modal-text').textContent=text;
  document.querySelector('#modal-tag').textContent=tag;
  modal.showModal();
}

const serviceGrid=document.querySelector('#service-grid');
services.forEach(([title,description,category,img],index)=>{
  const button=document.createElement('button');
  button.className='service-card reveal tilt-3d';
  button.style.setProperty('--i',String(index%3));
  button.type='button';
  button.innerHTML=`<h3>${title}</h3><span class="arrow">↗</span><p>${description}</p><span class="category">${category}</span><span class="media-3d media-3d--service float-3d" data-media style="animation-delay:${(index%3)*0.35}s"><img src="/assets/${img}.png" alt=""><span class="media-shine" aria-hidden="true"></span></span>`;
  button.addEventListener('click',()=>show(
    title,
    `${description} Start with a growth audit to identify where this capability can support your business.`,
    category
  ));
  serviceGrid.append(button);
});

document.querySelector('#close-modal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
document.querySelector('#modal-cta').addEventListener('click',()=>modal.close());
document.querySelector('#cases').addEventListener('click',()=>show(
  'Case studies, coming next.',
  'This storyboard does not include verified client case studies. This space is ready for your real projects, outcomes, and customer stories.',
  'OUR WORK'
));

/* Audit form */
const form=document.querySelector('#audit-form');
const websiteInput=document.querySelector('#website');
const nameInput=document.querySelector('#name');
const emailInput=document.querySelector('#email');
const detailsStep=document.querySelector('#details');
const goalsStep=document.querySelector('#goals');
const detailsError=document.querySelector('#details-error');
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWebsite(){
  const value=websiteInput.value.trim();
  if(!value)return;
  websiteInput.value=/^[a-z][a-z0-9+.-]*:/i.test(value)?value:`https://${value}`;
}
function showDetailsError(message,input){
  detailsError.hidden=!message;
  detailsError.textContent=message||'';
  input?.focus();
}
function detailsAreValid(){
  normalizeWebsite();
  const name=nameInput.value.trim();
  const email=emailInput.value.trim();
  const website=websiteInput.value.trim();
  if(!name){showDetailsError('Please enter your name.',nameInput);return false}
  if(!emailPattern.test(email)){showDetailsError('Please enter a valid work email.',emailInput);return false}
  if(!website){showDetailsError('Please enter your website.',websiteInput);return false}
  showDetailsError('');
  return true;
}
function step(two){
  detailsStep.hidden=two;
  goalsStep.hidden=!two;
  form.dataset.step=two?'2':'1';
  document.querySelector('#step-one').classList.toggle('active',!two);
  document.querySelector('#step-two').classList.toggle('active',two);
  if(two)goalsStep.querySelector('select')?.focus();
  else nameInput.focus();
}
function goToGoals(event){
  event?.preventDefault();
  if(detailsAreValid())step(true);
}
document.querySelector('#next').addEventListener('click',goToGoals);
websiteInput.addEventListener('blur',normalizeWebsite);
document.querySelector('#back').addEventListener('click',()=>step(false));
detailsStep.addEventListener('keydown',e=>{if(e.key==='Enter')goToGoals(e)});
form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form);
  const brief=`KANOPUS ENTITY — GROWTH AUDIT BRIEF\n\nName: ${data.get('name')}\nWork email: ${data.get('email')}\nWebsite: ${data.get('website')}\nPriority: ${data.get('goal')}\nGoals: ${data.get('context')||'Not specified'}\n\nPrepared locally. No details have been submitted.\n`;
  const url=URL.createObjectURL(new Blob([brief],{type:'text/plain'}));
  const link=document.createElement('a');
  link.href=url;
  link.download='kanopus-growth-audit.txt';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  form.hidden=true;
  document.querySelector('#success').hidden=false;
});
document.querySelector('#reset').addEventListener('click',()=>{
  form.reset();
  step(false);
  form.hidden=false;
  document.querySelector('#success').hidden=true;
  showDetailsError('');
});
const sectorData = {
  retail: { roi: 240, suffix: '%', spend: 500, prefix: '$', spendSuffix: 'M+' },
  tech: { roi: 380, suffix: '%', spend: 850, prefix: '$', spendSuffix: 'M+' },
  finance: { roi: 195, suffix: '%', spend: 1.4, prefix: '$', spendSuffix: 'B+' }
};
document.querySelectorAll('.sectors button').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.sectors button').forEach(b=>b.classList.remove('selected'));
    button.classList.add('selected');
    const key=button.dataset.sector||'retail';
    const data=sectorData[key];
    if(data){
      const roiEl=document.querySelector('.ticker strong[data-suffix="%"]');
      const spendEl=document.querySelector('.ticker strong[data-prefix="$"]');
      if(roiEl){
        roiEl.dataset.count=data.roi;
        roiEl.dataset.suffix=data.suffix;
        roiEl.dataset.counted='false';
        animateCount(roiEl);
      }
      if(spendEl){
        spendEl.dataset.count=data.spend;
        spendEl.dataset.prefix=data.prefix;
        spendEl.dataset.suffix=data.spendSuffix;
        spendEl.dataset.counted='false';
        animateCount(spendEl);
      }
    }
  });
});
document.querySelector('#year').textContent=new Date().getFullYear();

/* Mobile navigation */
function setNavOpen(open){
  document.body.classList.toggle('nav-open',open);
  navToggle?.setAttribute('aria-expanded',open?'true':'false');
  navToggle?.setAttribute('aria-label',open?'Close menu':'Open menu');
}
navToggle?.addEventListener('click',()=>{
  setNavOpen(!document.body.classList.contains('nav-open'));
});
siteNav?.querySelectorAll('[data-nav]').forEach(item=>{
  item.addEventListener('click',()=>setNavOpen(false));
});
header?.addEventListener('click',e=>{
  if(e.target===header&&document.body.classList.contains('nav-open'))setNavOpen(false);
});
window.addEventListener('keydown',e=>{
  if(e.key==='Escape')setNavOpen(false);
});

/* Sticky header elevation */
function syncHeader(){
  header?.classList.toggle('is-scrolled',window.scrollY>12);
}
syncHeader();
window.addEventListener('scroll',syncHeader,{passive:true});

/* Active nav by section */
const navLinks=[...document.querySelectorAll('.site-nav a[href^="#"]')];
const watchedSections=navLinks
  .map(link=>document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
function syncActiveNav(){
  const marker=window.scrollY+window.innerHeight*0.35;
  let current=null;
  for(const section of watchedSections){
    if(section.offsetTop<=marker)current=section;
  }
  navLinks.forEach(link=>{
    const href=link.getAttribute('href');
    const isHome=href==='#home'||href==='#';
    link.classList.toggle('is-active',current?href===`#${current.id}`:isHome);
  });
}
syncActiveNav();
window.addEventListener('scroll',syncActiveNav,{passive:true});

/* Scroll reveals */
const revealNodes=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting){
        target.classList.add('is-in');
        revealObserver.unobserve(target);
      }
    });
  },{threshold:.16,rootMargin:'0px 0px -8% 0px'});
  revealNodes.forEach(node=>revealObserver.observe(node));
}else{
  revealNodes.forEach(node=>node.classList.add('is-in'));
}
if(motionPreference.matches)revealNodes.forEach(node=>node.classList.add('is-in'));

/* Ticker count-up */
function animateCount(el){
  const end=Number(el.dataset.count||0);
  const prefix=el.dataset.prefix||'';
  const suffix=el.dataset.suffix||'';
  if(motionPreference.matches){
    el.textContent=`${prefix}${end}${suffix}`;
    return;
  }
  const duration=1200;
  const start=performance.now();
  const tick=now=>{
    const p=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-p,3);
    el.textContent=`${prefix}${Math.round(end*eased)}${suffix}`;
    if(p<1)requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countEls=[...document.querySelectorAll('[data-count]')];
if('IntersectionObserver' in window&&countEls.length){
  const countObserver=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(!isIntersecting||target.dataset.counted==='true')return;
      target.dataset.counted='true';
      animateCount(target);
      countObserver.unobserve(target);
    });
  },{threshold:.5});
  countEls.forEach(el=>countObserver.observe(el));
}

/* Illustration motion */
const illustrations=[...document.querySelectorAll('img:not(.brand-logo)')];
if('IntersectionObserver' in window){
  const imageObserver=new IntersectionObserver(entries=>{
    entries.forEach(({target,isIntersecting})=>{
      if(isIntersecting){
        target.classList.add('motion-visible');
        target.classList.remove('motion-paused');
      }else if(target.classList.contains('motion-visible')){
        target.classList.add('motion-paused');
      }
    });
  },{threshold:.15});
  illustrations.forEach(image=>{
    image.classList.add('motion-ready');
    imageObserver.observe(image);
  });
  const syncMotion=()=>{
    illustrations.forEach(image=>{
      if(motionPreference.matches)image.classList.add('motion-visible');
    });
  };
  motionPreference.addEventListener('change',syncMotion);
  syncMotion();
}

/* Hero background video (decorative) */
const heroSection=document.querySelector('#home.hero');
const heroVideo=document.querySelector('#hero-video');
const HERO_DESKTOP_SRC='/videos/Animated_Earth_connecting_to_brain_20261014092310.mp4';
const HERO_MOBILE_SRC='/videos/Animated_Earth_connecting_to_brain_20261014092310.mp4';

function heroSrc(){
  return mobileHeroQuery.matches?HERO_MOBILE_SRC:HERO_DESKTOP_SRC;
}
function armHeroVideo(){
  if(!heroVideo)return;
  heroVideo.muted=true;
  heroVideo.defaultMuted=true;
  heroVideo.loop=true;
  heroVideo.playsInline=true;
  heroVideo.setAttribute('muted','');
  heroVideo.setAttribute('playsinline','');
  heroVideo.setAttribute('webkit-playsinline','');
  heroVideo.setAttribute('autoplay','');
  heroVideo.removeAttribute('poster');
  heroVideo.preload='auto';
}
function applyHeroSource(){
  if(!heroVideo)return false;
  const src=heroSrc();
  if(heroVideo.dataset.activeSrc===src&&heroVideo.getAttribute('src')===src)return false;
  heroVideo.dataset.activeSrc=src;
  heroVideo.removeAttribute('poster');
  while(heroVideo.firstChild)heroVideo.removeChild(heroVideo.firstChild);
  heroVideo.src=src;
  heroVideo.load();
  return true;
}
function setHeroReduced(reduced){
  if(!heroVideo||!heroSection)return;
  heroVideo.dataset.reduced=reduced?'true':'false';
  heroSection.dataset.reduced=reduced?'true':'false';
  if(reduced){
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    return;
  }
  armHeroVideo();
}
async function playHeroVideo(){
  if(!heroVideo||!heroSection)return false;
  if(motionPreference.matches||document.visibilityState==='hidden')return false;
  if(heroVideo.dataset.reduced==='true')return false;
  armHeroVideo();
  if(!heroVideo.getAttribute('src'))applyHeroSource();
  try{
    const playPromise=heroVideo.play();
    if(playPromise!==undefined)await playPromise;
    heroVideo.removeAttribute('poster');
    heroSection.dataset.video=heroVideo.paused?'idle':'playing';
    return !heroVideo.paused;
  }catch{
    heroSection.dataset.video='blocked';
    return false;
  }
}
function startHeroVideo(){
  if(!heroVideo||!heroSection)return;
  armHeroVideo();
  if(motionPreference.matches){
    setHeroReduced(true);
    return;
  }
  setHeroReduced(false);
  applyHeroSource();
  heroVideo.addEventListener('playing',()=>{
    heroVideo.removeAttribute('poster');
    heroVideo.poster='';
    heroSection.dataset.video='playing';
  });
  heroVideo.addEventListener('timeupdate',()=>{
    if(!heroVideo.duration||heroVideo.paused||motionPreference.matches)return;
    if(heroVideo.currentTime>heroVideo.duration-0.12){
      heroVideo.currentTime=0.001;
      playHeroVideo();
    }
  });
  heroVideo.addEventListener('ended',()=>{
    heroVideo.currentTime=0.001;
    playHeroVideo();
  });
  const tryPlay=()=>playHeroVideo().then(ok=>{
    if(ok)return;
    const resume=()=>{playHeroVideo()};
    ['pointerdown','touchstart','keydown'].forEach(type=>{
      window.addEventListener(type,resume,{once:true,passive:true});
    });
  });
  if(heroVideo.readyState>=2)tryPlay();
  else{
    heroVideo.addEventListener('loadeddata',tryPlay,{once:true});
    heroVideo.addEventListener('canplay',tryPlay,{once:true});
  }
  tryPlay();
  window.setInterval(()=>{
    if(motionPreference.matches||document.visibilityState==='hidden')return;
    if(heroVideo.paused||heroVideo.currentTime<0.05)playHeroVideo();
  },1500);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')playHeroVideo();
  });
  mobileHeroQuery.addEventListener('change',()=>{
    if(motionPreference.matches)return;
    applyHeroSource();
    heroVideo.addEventListener('loadeddata',()=>playHeroVideo(),{once:true});
  });
}
startHeroVideo();
motionPreference.addEventListener('change',()=>{
  if(!heroVideo||!heroSection)return;
  if(motionPreference.matches){
    setHeroReduced(true);
    return;
  }
  setHeroReduced(false);
  applyHeroSource();
  playHeroVideo();
});

/* Pointer-driven 3D tilt */
const finePointer=window.matchMedia('(pointer:fine)');
function resetTilt(el){
  el.classList.remove('is-tilting');
  el.style.setProperty('--tilt-x','0deg');
  el.style.setProperty('--tilt-y','0deg');
  el.style.setProperty('--tilt-lift','0px');
  el.style.setProperty('--tilt-z','0px');
}
function bindTilt(el,max=10){
  if(!finePointer.matches||motionPreference.matches)return;
  el.addEventListener('pointermove',e=>{
    const rect=el.getBoundingClientRect();
    const px=(e.clientX-rect.left)/rect.width-0.5;
    const py=(e.clientY-rect.top)/rect.height-0.5;
    el.classList.add('is-tilting');
    el.style.setProperty('--tilt-x',`${(-py*max).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y',`${(px*max).toFixed(2)}deg`);
    el.style.setProperty('--tilt-lift','-6px');
    el.style.setProperty('--tilt-z','18px');
    el.style.setProperty('--mouse-x',`${(e.clientX-rect.left).toFixed(1)}px`);
    el.style.setProperty('--mouse-y',`${(e.clientY-rect.top).toFixed(1)}px`);
  });
  el.addEventListener('pointerleave',()=>resetTilt(el));
}
function initTilts(){
  document.querySelectorAll('.tilt-3d').forEach(el=>{
    resetTilt(el);
    bindTilt(el, el.classList.contains('service-card')?12: el.classList.contains('form-panel')?6:9);
  });
}
initTilts();

/* Rich 3D FX for logo + pictures */
function bindLogoFx(mark){
  if(!finePointer.matches||motionPreference.matches||!mark)return;
  const logo=mark.querySelector('.brand-logo');
  mark.addEventListener('pointerenter',()=>mark.classList.add('is-hot'));
  mark.addEventListener('pointermove',e=>{
    const rect=mark.getBoundingClientRect();
    const px=(e.clientX-rect.left)/rect.width-0.5;
    const py=(e.clientY-rect.top)/rect.height-0.5;
    mark.style.setProperty('--lx',`${(-py*22).toFixed(2)}deg`);
    mark.style.setProperty('--ly',`${(px*26).toFixed(2)}deg`);
    mark.style.setProperty('--lz',`${(18+Math.abs(px)*10).toFixed(1)}px`);
    if(logo){
      logo.style.transform=`rotateX(${(-py*22).toFixed(2)}deg) rotateY(${(px*26).toFixed(2)}deg) translateZ(${(18+Math.abs(px)*10).toFixed(1)}px) scale(1.06)`;
    }
  });
  mark.addEventListener('pointerleave',()=>{
    mark.classList.remove('is-hot');
    mark.style.setProperty('--lx','0deg');
    mark.style.setProperty('--ly','0deg');
    mark.style.setProperty('--lz','0px');
    if(logo)logo.style.transform='';
  });
}
function bindMediaFx(stage){
  if(!finePointer.matches||motionPreference.matches||!stage)return;
  const img=stage.querySelector('img');
  stage.addEventListener('pointerenter',()=>stage.classList.add('is-hot'));
  stage.addEventListener('pointermove',e=>{
    const rect=stage.getBoundingClientRect();
    const px=(e.clientX-rect.left)/rect.width-0.5;
    const py=(e.clientY-rect.top)/rect.height-0.5;
    const rx=(-py*28).toFixed(2);
    const ry=(px*32).toFixed(2);
    const z=(34+Math.abs(px)*16).toFixed(1);
    stage.style.setProperty('--mx',`${rx}deg`);
    stage.style.setProperty('--my',`${ry}deg`);
    stage.style.setProperty('--mz',`${z}px`);
    if(img){
      img.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${z}px) scale(1.08)`;
    }
  });
  stage.addEventListener('pointerleave',()=>{
    stage.classList.remove('is-hot');
    stage.style.setProperty('--mx','0deg');
    stage.style.setProperty('--my','0deg');
    stage.style.setProperty('--mz', stage.classList.contains('media-3d--service')?'36px':'28px');
    if(img)img.style.transform='';
  });
}
function initMediaFx(){
  document.querySelectorAll('[data-logo]').forEach(bindLogoFx);
  document.querySelectorAll('[data-media]').forEach(bindMediaFx);
}
initMediaFx();

/* Hero 3D parallax */
const heroMedia=document.querySelector('.hero-media');
const heroContent=document.querySelector('.hero-content');
let heroParallaxX=0;
let heroParallaxY=0;
let heroTargetX=0;
let heroTargetY=0;
let heroRaf=0;

function renderHeroParallax(){
  heroParallaxX+=(heroTargetX-heroParallaxX)*0.08;
  heroParallaxY+=(heroTargetY-heroParallaxY)*0.08;
  if(heroMedia){
    heroMedia.style.transform=`translate3d(${heroParallaxX*18}px,${heroParallaxY*14}px,0) scale(1.06)`;
  }
  if(heroContent){
    heroContent.style.transform=`perspective(1100px) rotateX(${(-heroParallaxY*3).toFixed(2)}deg) rotateY(${(heroParallaxX*3.5).toFixed(2)}deg) translate3d(${(-heroParallaxX*10).toFixed(1)}px,${(-heroParallaxY*8).toFixed(1)}px,0)`;
  }
  heroRaf=requestAnimationFrame(renderHeroParallax);
}

function startHeroParallax(){
  if(!heroSection||motionPreference.matches||!finePointer.matches)return;
  if(heroRaf)return;
  heroSection.addEventListener('pointermove',e=>{
    const rect=heroSection.getBoundingClientRect();
    heroTargetX=(e.clientX-rect.left)/rect.width-0.5;
    heroTargetY=(e.clientY-rect.top)/rect.height-0.5;
  },{passive:true});
  heroSection.addEventListener('pointerleave',()=>{
    heroTargetX=0;
    heroTargetY=0;
  });
  // Subtle scroll depth
  window.addEventListener('scroll',()=>{
    if(!heroSection)return;
    const rect=heroSection.getBoundingClientRect();
    if(rect.bottom<0||rect.top>window.innerHeight)return;
    const progress=Math.min(1,Math.max(0,-rect.top/(rect.height||1)));
    if(heroMedia){
      heroMedia.style.filter=`brightness(${1-progress*0.12})`;
    }
  },{passive:true});
  renderHeroParallax();
}
startHeroParallax();

motionPreference.addEventListener('change',()=>{
  if(motionPreference.matches){
    cancelAnimationFrame(heroRaf);
    heroRaf=0;
    if(heroMedia){heroMedia.style.transform='';heroMedia.style.filter=''}
    if(heroContent)heroContent.style.transform='';
    document.querySelectorAll('.tilt-3d').forEach(resetTilt);
    stopVfx();
  }else{
    initTilts();
    initMediaFx();
    startHeroParallax();
    startVfx();
  }
});

/* Global VFX: Synaptic neural field + cursor spotlight */
const particleCanvas=document.querySelector('#vfx-particles');
const spot=document.querySelector('#vfx-spot');
const cursorGlow=document.querySelector('#cursor-glow');
const scrollProgress=document.querySelector('#scroll-progress');
let particleRaf=0;
let particleCtx=null;
let particles=[];
let neuralPulses=[];
let spotX=window.innerWidth*0.5;
let spotY=window.innerHeight*0.4;
let spotTX=spotX;
let spotTY=spotY;
let cursorX=spotX;
let cursorY=spotY;

function resizeParticles(){
  if(!particleCanvas)return;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);
  particleCanvas.width=Math.floor(window.innerWidth*dpr);
  particleCanvas.height=Math.floor(window.innerHeight*dpr);
  particleCanvas.style.width=`${window.innerWidth}px`;
  particleCanvas.style.height=`${window.innerHeight}px`;
  particleCtx=particleCanvas.getContext('2d');
  particleCtx.setTransform(dpr,0,0,dpr,0,0);
  const count=window.innerWidth<760?32:58;
  particles=Array.from({length:count},(_,i)=>({
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    r:Math.random()*2+0.6,
    vx:(Math.random()-0.5)*0.38,
    vy:(Math.random()-0.5)*0.32,
    a:Math.random()*0.55+0.2,
    type:i%4===0?'cyan':'gold'
  }));
}

function drawParticles(){
  if(!particleCtx||motionPreference.matches)return;
  const w=window.innerWidth;
  const h=window.innerHeight;
  particleCtx.clearRect(0,0,w,h);

  for(const p of particles){
    const toCursor=Math.hypot(p.x-spotX,p.y-spotY);
    if(toCursor<180&&toCursor>10){
      const force=(1-toCursor/180)*0.08;
      p.vx+=((spotX-p.x)/toCursor)*force;
      p.vy+=((spotY-p.y)/toCursor)*force;
      p.vx*=0.98;
      p.vy*=0.98;
    }
    p.x+=p.vx;
    p.y+=p.vy;
    if(p.x<-20)p.x=w+20;
    if(p.x>w+20)p.x=-20;
    if(p.y<-20)p.y=h+20;
    if(p.y>h+20)p.y=-20;

    particleCtx.beginPath();
    if(p.type==='cyan'){
      particleCtx.fillStyle=`rgba(78, 243, 210, ${p.a*0.9})`;
      particleCtx.shadowColor='rgba(78, 243, 210, 0.4)';
    }else{
      particleCtx.fillStyle=`rgba(200, 150, 78, ${p.a})`;
      particleCtx.shadowColor='rgba(200, 150, 78, 0.3)';
    }
    particleCtx.shadowBlur=4;
    particleCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    particleCtx.fill();
    particleCtx.shadowBlur=0;
  }

  const activeLinks=[];
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i];
      const b=particles[j];
      const dx=a.x-b.x;
      const dy=a.y-b.y;
      const dist=Math.hypot(dx,dy);
      if(dist>130)continue;
      const midX=(a.x+b.x)/2;
      const midY=(a.y+b.y)/2;
      const toSpot=Math.hypot(midX-spotX,midY-spotY);
      const isNearCursor=toSpot<240;
      const alpha=isNearCursor?(1-dist/130)*0.28:(1-dist/130)*0.12;

      particleCtx.strokeStyle=a.type==='cyan'||b.type==='cyan'
        ?`rgba(78, 243, 210, ${alpha})`
        :`rgba(224, 179, 106, ${alpha})`;
      particleCtx.lineWidth=isNearCursor?1.2:0.8;
      particleCtx.beginPath();
      particleCtx.moveTo(a.x,a.y);
      particleCtx.lineTo(b.x,b.y);
      particleCtx.stroke();

      if(dist<100&&(isNearCursor||Math.random()<0.003)){
        activeLinks.push({a,b,dist});
      }
    }
  }

  if(neuralPulses.length<8&&activeLinks.length&&Math.random()<0.15){
    const link=activeLinks[Math.floor(Math.random()*activeLinks.length)];
    neuralPulses.push({
      a:link.a,
      b:link.b,
      progress:0,
      speed:0.02+Math.random()*0.03,
      color:Math.random()>0.4?'rgba(78, 243, 210, 0.9)':'rgba(255, 230, 160, 0.9)'
    });
  }

  for(let k=neuralPulses.length-1;k>=0;k--){
    const pulse=neuralPulses[k];
    pulse.progress+=pulse.speed;
    if(pulse.progress>=1){
      neuralPulses.splice(k,1);
      continue;
    }
    const px=pulse.a.x+(pulse.b.x-pulse.a.x)*pulse.progress;
    const py=pulse.a.y+(pulse.b.y-pulse.a.y)*pulse.progress;
    particleCtx.beginPath();
    particleCtx.fillStyle=pulse.color;
    particleCtx.shadowColor=pulse.color;
    particleCtx.shadowBlur=6;
    particleCtx.arc(px,py,2.2,0,Math.PI*2);
    particleCtx.fill();
    particleCtx.shadowBlur=0;
  }

  spotX+=(spotTX-spotX)*0.1;
  spotY+=(spotTY-spotY)*0.1;
  if(spot){
    spot.style.left=`${spotX}px`;
    spot.style.top=`${spotY}px`;
  }
  if(cursorGlow&&finePointer.matches){
    cursorX+=(spotTX-cursorX)*0.18;
    cursorY+=(spotTY-cursorY)*0.18;
    cursorGlow.style.transform=`translate3d(${cursorX}px, ${cursorY}px, 0)`;
  }

  particleRaf=requestAnimationFrame(drawParticles);
}

function startVfx(){
  if(motionPreference.matches||!particleCanvas)return;
  if(particleRaf)return;
  resizeParticles();
  document.body.classList.add('is-spot-on');
  window.addEventListener('resize',resizeParticles);
  window.addEventListener('pointermove',e=>{
    spotTX=e.clientX;
    spotTY=e.clientY;
  },{passive:true});
  drawParticles();
}

function stopVfx(){
  cancelAnimationFrame(particleRaf);
  particleRaf=0;
  document.body.classList.remove('is-spot-on');
  if(particleCtx)particleCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
}
startVfx();

/* Scroll Progress Bar */
function updateScrollProgress(){
  if(!scrollProgress)return;
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const progress=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
  scrollProgress.style.transform=`scaleX(${progress})`;
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

/* Cursor Glow Hover Expansion */
if(cursorGlow&&finePointer.matches){
  const interactiveTargets='a, button, input, select, textarea, .service-card, .tilt-3d, [data-media], [data-logo]';
  document.addEventListener('mouseover',e=>{
    if(e.target.closest(interactiveTargets)){
      cursorGlow.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest(interactiveTargets)){
      cursorGlow.classList.remove('is-hovering');
    }
  });
}

/* Image Stretch Transition on Page / Section Switching */
const stretchVeil=document.querySelector('#page-stretch-veil');
const displacementEl=document.querySelector('#stretch-displacement');
let isTransitioning=false;

function triggerPageStretchTransition(targetHash,forceDirection){
  if(isTransitioning||motionPreference.matches){
    const target=document.querySelector(targetHash);
    if(target)target.scrollIntoView({behavior:'smooth'});
    return;
  }
  const targetEl=document.querySelector(targetHash);
  if(!targetEl)return;

  isTransitioning=true;
  const currentScroll=window.scrollY;
  const targetOffset=Math.max(0,targetEl.getBoundingClientRect().top+window.scrollY-74);
  const direction=forceDirection||(targetOffset>=currentScroll?'down':'up');

  if(stretchVeil){
    stretchVeil.className=`page-stretch-veil is-active direction-${direction}`;
  }
  document.body.classList.add('is-switching-page');

  if(displacementEl){
    const startTime=performance.now();
    const duration=750;
    const animateWarp=now=>{
      const p=Math.min(1,(now-startTime)/duration);
      const scale=Math.sin(p*Math.PI)*28;
      displacementEl.setAttribute('scale',scale.toFixed(1));
      if(p<1)requestAnimationFrame(animateWarp);
    };
    requestAnimationFrame(animateWarp);
  }

  const stretchClass=`is-stretching-${direction}`;
  const stretchTargets=document.querySelectorAll(
    '.media-3d img, .hero-media, .service-card, .value-grid article'
  );
  stretchTargets.forEach(el=>{
    el.classList.remove('is-stretching-down','is-stretching-up');
    void el.offsetWidth;
    el.classList.add(stretchClass);
  });

  setTimeout(()=>{
    window.scrollTo({
      top:targetOffset,
      behavior:'auto'
    });
  },350);

  setTimeout(()=>{
    if(stretchVeil){
      stretchVeil.classList.remove('is-active','direction-down','direction-up');
    }
    document.body.classList.remove('is-switching-page');
    stretchTargets.forEach(el=>el.classList.remove(stretchClass));
    if(displacementEl)displacementEl.setAttribute('scale','0');
    isTransitioning=false;
  },850);
}

// Intercept navigation link clicks to trigger image stretch page transition
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href^="#"]');
  if(!link)return;
  const href=link.getAttribute('href');
  if(!href||href==='#'||href==='#!')return;
  const target=document.querySelector(href);
  if(!target)return;

  e.preventDefault();
  setNavOpen(false);
  triggerPageStretchTransition(href);
});

/* Scroll Velocity Image Stretch */
let lastScrollPos=window.scrollY;
let lastScrollTime=performance.now();
let currentStretch=1;
let targetStretch=1;

function renderScrollStretch(){
  if(motionPreference.matches)return;
  const now=performance.now();
  const dt=Math.max(10,now-lastScrollTime);
  const currentY=window.scrollY;
  const dy=currentY-lastScrollPos;
  lastScrollPos=currentY;
  lastScrollTime=now;

  const velocity=Math.abs(dy/dt);
  if(velocity>0.3){
    targetStretch=1+Math.min(0.2,velocity*0.08);
  }else{
    targetStretch=1;
  }

  currentStretch+=(targetStretch-currentStretch)*0.15;
  if(Math.abs(currentStretch-1)>0.003){
    document.documentElement.style.setProperty('--scroll-stretch',currentStretch.toFixed(3));
  }else if(currentStretch!==1){
    currentStretch=1;
    document.documentElement.style.setProperty('--scroll-stretch','1');
  }

  requestAnimationFrame(renderScrollStretch);
}
requestAnimationFrame(renderScrollStretch);


