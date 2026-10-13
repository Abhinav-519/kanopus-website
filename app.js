const services=[['Market Intelligence','Understand your audience, competitors, and the opportunities between them.','INSIGHTS','brain'],['Conversion Optimization','Turn the right attention into meaningful customer action.','RESULTS','funnel'],['Performance Marketing','Connect campaign strategy, creative, and measurement.','RESULTS','bulb'],['SEO Entity Mapping','Make your expertise easier to discover and understand.','FINDABILITY','compass'],['Conversion Rate Optimization','Find friction in the customer journey and improve each step.','RESULTS','search'],['Predictive Analytics','Use patterns in your data to inform your next move.','INSIGHTS','growth']];
const modal=document.querySelector('#modal');function show(title,text,tag){document.querySelector('#modal-title').textContent=title;document.querySelector('#modal-text').textContent=text;document.querySelector('#modal-tag').textContent=tag;modal.showModal()}
services.forEach(([title,description,category,img])=>{const button=document.createElement('button');button.className='service-card';button.innerHTML=`<h3>${title}</h3><span class="arrow">↗</span><p>${description}</p><span class="category">${category}</span><img src="assets/${img}.png" alt="">`;button.onclick=()=>show(title,description+' Start with a growth audit to identify where this capability can support your business.',category);document.querySelector('#service-grid').append(button)});
document.querySelector('#close-modal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});document.querySelector('#modal-cta').onclick=()=>modal.close();document.querySelector('#cases').onclick=()=>show('Case studies, coming next.','This storyboard does not include verified client case studies. This space is ready for your real projects, outcomes, and customer stories.','OUR WORK');
const form=document.querySelector('#audit-form');
const websiteInput=document.querySelector('#website');
const detailsStep=document.querySelector('#details');
const goalsStep=document.querySelector('#goals');
function normalizeWebsite(){
  const value=websiteInput.value.trim();
  if(!value)return;
  websiteInput.value=/^[a-z][a-z0-9+.-]*:/i.test(value)?value:`https://${value}`;
}
function detailsAreValid(){
  normalizeWebsite();
  for(const input of detailsStep.querySelectorAll('input')){
    if(!input.checkValidity()){
      input.reportValidity();
      return false;
    }
  }
  return true;
}
function step(two){
  detailsStep.hidden=two;
  goalsStep.hidden=!two;
  document.querySelector('#step-one').classList.toggle('active',!two);
  document.querySelector('#step-two').classList.toggle('active',two);
  (two?goalsStep:detailsStep).querySelector('input,select,textarea')?.focus();
}
document.querySelector('#next').addEventListener('click',()=>{if(detailsAreValid())step(true)});
websiteInput.addEventListener('blur',normalizeWebsite);
document.querySelector('#back').addEventListener('click',()=>step(false));
detailsStep.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    if(detailsAreValid())step(true);
  }
});
form.onsubmit=e=>{e.preventDefault();const data=new FormData(form);const brief=`KANOPUS ENTITY — GROWTH AUDIT BRIEF\n\nName: ${data.get('name')}\nWork email: ${data.get('email')}\nWebsite: ${data.get('website')}\nPriority: ${data.get('goal')}\nGoals: ${data.get('context')||'Not specified'}\n\nPrepared locally. No details have been submitted.\n`;const url=URL.createObjectURL(new Blob([brief],{type:'text/plain'}));const link=document.createElement('a');link.href=url;link.download='kanopus-growth-audit.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);form.hidden=true;document.querySelector('#success').hidden=false};document.querySelector('#reset').onclick=()=>{form.reset();step(false);form.hidden=false;document.querySelector('#success').hidden=true};document.querySelectorAll('.sectors button').forEach(button=>button.onclick=()=>{document.querySelectorAll('.sectors button').forEach(b=>b.classList.remove('selected'));button.classList.add('selected')});document.querySelector('#year').textContent=new Date().getFullYear();
// Animate every illustration as it enters view; pause motion offscreen.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const illustrations=[...document.querySelectorAll('img')];
if('IntersectionObserver' in window){
 const imageObserver=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('motion-visible');target.classList.remove('motion-paused')}else if(target.classList.contains('motion-visible')){target.classList.add('motion-paused')}})},{threshold:.15});
 illustrations.forEach(image=>{image.classList.add('motion-ready');imageObserver.observe(image)});
 const syncMotion=()=>{illustrations.forEach(image=>{if(motionPreference.matches)image.classList.add('motion-visible')})};
 motionPreference.addEventListener('change',syncMotion);syncMotion();
}
