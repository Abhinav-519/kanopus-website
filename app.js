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
// Full-bleed hero background video (decorative).
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileHeroQuery=window.matchMedia('(max-width: 768px)');
const heroSection=document.querySelector('#home.hero');
const heroVideo=document.querySelector('#hero-video');
const HERO_DESKTOP_SRC='/videos/hero.mp4';
const HERO_MOBILE_SRC='/videos/hero-mobile.mp4';
const HERO_POSTER='/videos/hero-poster.jpg';

function heroSourceForViewport(){
  return mobileHeroQuery.matches?HERO_MOBILE_SRC:HERO_DESKTOP_SRC;
}

function showHeroPosterFallback(){
  if(!heroVideo||!heroSection)return;
  heroVideo.dataset.reduced='true';
  heroSection.dataset.reduced='true';
  heroVideo.pause();
  heroVideo.removeAttribute('autoplay');
  heroVideo.setAttribute('poster',HERO_POSTER);
}

async function keepHeroVideoPlaying(){
  if(!heroVideo||motionPreference.matches||document.visibilityState==='hidden')return;
  try{
    heroVideo.muted=true;
    await heroVideo.play();
  }catch{
    showHeroPosterFallback();
  }
}

function startHeroVideo(){
  if(!heroVideo||!heroSection)return;
  heroVideo.setAttribute('aria-hidden','true');
  heroVideo.muted=true;
  heroVideo.defaultMuted=true;
  heroVideo.loop=true;
  heroVideo.playsInline=true;
  heroVideo.setAttribute('playsinline','');
  heroVideo.setAttribute('webkit-playsinline','');
  heroVideo.preload='auto';
  heroVideo.poster=HERO_POSTER;

  if(motionPreference.matches){
    showHeroPosterFallback();
    return;
  }

  heroVideo.dataset.reduced='false';
  heroSection.dataset.reduced='false';

  // Prefer the right file for the viewport; media on <source> is inconsistently supported.
  const desired=heroSourceForViewport();
  if(!heroVideo.currentSrc.includes(desired)){
    heroVideo.src=desired;
    heroVideo.load();
  }

  // Seamless loop fallback — avoid a visible hitch at the clip end.
  heroVideo.addEventListener('timeupdate',()=>{
    if(!heroVideo.duration||motionPreference.matches)return;
    if(heroVideo.currentTime>heroVideo.duration-0.1){
      heroVideo.currentTime=0;
      keepHeroVideoPlaying();
    }
  });
  heroVideo.addEventListener('ended',()=>{
    heroVideo.currentTime=0;
    keepHeroVideoPlaying();
  });

  keepHeroVideoPlaying();
  heroVideo.addEventListener('canplay',()=>keepHeroVideoPlaying(),{once:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')keepHeroVideoPlaying();
  });
  window.addEventListener('pageshow',()=>keepHeroVideoPlaying());
  mobileHeroQuery.addEventListener('change',()=>{
    if(motionPreference.matches)return;
    const next=heroSourceForViewport();
    if(!heroVideo.currentSrc.includes(next)){
      const t=heroVideo.currentTime;
      heroVideo.src=next;
      heroVideo.load();
      heroVideo.addEventListener('loadeddata',()=>{
        try{heroVideo.currentTime=t}catch{}
        keepHeroVideoPlaying();
      },{once:true});
    }
  });
}

startHeroVideo();
motionPreference.addEventListener('change',()=>{
  if(!heroVideo||!heroSection)return;
  if(motionPreference.matches){
    showHeroPosterFallback();
    return;
  }
  heroVideo.dataset.reduced='false';
  heroSection.dataset.reduced='false';
  const desired=heroSourceForViewport();
  if(!heroVideo.currentSrc.includes(desired)){
    heroVideo.src=desired;
    heroVideo.load();
  }
  keepHeroVideoPlaying();
});

// Animate every illustration as it enters view; pause motion offscreen.
const illustrations=[...document.querySelectorAll('img:not(.brand-logo)')];
if('IntersectionObserver' in window){
 const imageObserver=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('motion-visible');target.classList.remove('motion-paused')}else if(target.classList.contains('motion-visible')){target.classList.add('motion-paused')}})},{threshold:.15});
 illustrations.forEach(image=>{image.classList.add('motion-ready');imageObserver.observe(image)});
 const syncMotion=()=>{illustrations.forEach(image=>{if(motionPreference.matches)image.classList.add('motion-visible')})};
 motionPreference.addEventListener('change',syncMotion);syncMotion();
}
