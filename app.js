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
  button.innerHTML=`<h3>${title}</h3><span class="arrow">↗</span><p>${description}</p><span class="category">${category}</span><img class="float-3d" src="/assets/${img}.png" alt="" style="animation-delay:${(index%3)*0.35}s">`;
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
document.querySelectorAll('.sectors button').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.sectors button').forEach(b=>b.classList.remove('selected'));
    button.classList.add('selected');
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
const HERO_DESKTOP_SRC='/videos/hero.mp4';
const HERO_MOBILE_SRC='/videos/hero-mobile.mp4';

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
  }else{
    initTilts();
    startHeroParallax();
  }
});
