const services=[['Market Intelligence','Understand your audience, competitors, and the opportunities between them.','INSIGHTS','brain'],['Conversion Optimization','Turn the right attention into meaningful customer action.','RESULTS','funnel'],['Performance Marketing','Connect campaign strategy, creative, and measurement.','RESULTS','bulb'],['SEO Entity Mapping','Make your expertise easier to discover and understand.','FINDABILITY','compass'],['Conversion Rate Optimization','Find friction in the customer journey and improve each step.','RESULTS','search'],['Predictive Analytics','Use patterns in your data to inform your next move.','INSIGHTS','growth']];
const modal=document.querySelector('#modal');function show(title,text,tag){document.querySelector('#modal-title').textContent=title;document.querySelector('#modal-text').textContent=text;document.querySelector('#modal-tag').textContent=tag;modal.showModal()}
services.forEach(([title,description,category,img])=>{const button=document.createElement('button');button.className='service-card';button.innerHTML=`<h3>${title}</h3><span class="arrow">↗</span><p>${description}</p><span class="category">${category}</span><img src="/assets/${img}.png" alt="">`;button.onclick=()=>show(title,description+' Start with a growth audit to identify where this capability can support your business.',category);document.querySelector('#service-grid').append(button)});
document.querySelector('#close-modal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});document.querySelector('#modal-cta').onclick=()=>modal.close();document.querySelector('#cases').onclick=()=>show('Case studies, coming next.','This storyboard does not include verified client case studies. This space is ready for your real projects, outcomes, and customer stories.','OUR WORK');
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
detailsStep.addEventListener('keydown',e=>{
  if(e.key==='Enter')goToGoals(e);
});
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
document.querySelectorAll('.sectors button').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.sectors button').forEach(b=>b.classList.remove('selected'));
  button.classList.add('selected');
}));
document.querySelector('#year').textContent=new Date().getFullYear();
// Full-bleed hero background video (decorative). Never use a poster attribute —
// browsers keep showing it when autoplay is blocked or delayed.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileHeroQuery=window.matchMedia('(max-width: 768px)');
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
    const resume=()=>{playHeroVideo();};
    ['pointerdown','touchstart','keydown'].forEach(type=>{
      window.addEventListener(type,resume,{once:true,passive:true});
    });
  });

  if(heroVideo.readyState>=2)tryPlay();
  else{
    heroVideo.addEventListener('loadeddata',tryPlay,{once:true});
    heroVideo.addEventListener('canplay',tryPlay,{once:true});
  }
  // Kick load/play immediately as well.
  tryPlay();

  window.setInterval(()=>{
    if(motionPreference.matches||document.visibilityState==='hidden')return;
    if(heroVideo.paused||heroVideo.currentTime<0.05)playHeroVideo();
  },1200);

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
// Animate every illustration as it enters view; pause motion offscreen.
const illustrations=[...document.querySelectorAll('img:not(.brand-logo)')];
if('IntersectionObserver' in window){
 const imageObserver=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('motion-visible');target.classList.remove('motion-paused')}else if(target.classList.contains('motion-visible')){target.classList.add('motion-paused')}})},{threshold:.15});
 illustrations.forEach(image=>{image.classList.add('motion-ready');imageObserver.observe(image)});
 const syncMotion=()=>{illustrations.forEach(image=>{if(motionPreference.matches)image.classList.add('motion-visible')})};
 motionPreference.addEventListener('change',syncMotion);syncMotion();
}
