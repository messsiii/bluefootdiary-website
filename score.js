(() => {
 document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>a.closest('details').removeAttribute('open')));
 const hero=document.querySelector('.hero');
 const chapters=[...document.querySelectorAll('[data-chapter]')];
 const lines=[...document.querySelectorAll('.bridge span')];
 document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{const gallery=document.querySelector('.reward-gallery');gallery.scrollBy({left:Number(button.dataset.gallery)*Math.min(gallery.clientWidth*.8,616),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 let frame=0;
 function render(){
  frame=0;if(reduced.matches)return;
  const h=innerHeight,r=hero.getBoundingClientRect(),p=clamp(-r.top/(r.height-h));
  const intro=clamp(p/.35),reveal=clamp((p-.18)/.45);
  hero.style.setProperty('--title-opacity',1-intro);
  hero.style.setProperty('--title-y',`${-intro*100}px`);
  hero.style.setProperty('--title-scale',1-intro*.12);
  hero.style.setProperty('--product-opacity',reveal);
  hero.style.setProperty('--product-y',`${(1-reveal)*h*.6}px`);
  hero.style.setProperty('--product-scale',.75+reveal*.25);
  hero.style.setProperty('--phone-rotation',`${-25+reveal*25}deg`);
  hero.style.setProperty('--phone-tilt',`${-10+reveal*10}deg`);
  hero.style.setProperty('--space-scale',1+p*.3);
  hero.style.setProperty('--space-opacity',1-p*.55);
  const hidden=intro>.95;
  const copy=hero.querySelector('.hero-copy');
  copy.inert=hidden;copy.setAttribute('aria-hidden',String(hidden));
  hero.querySelector('.hero-product').setAttribute('aria-hidden',String(reveal<.1));
  chapters.forEach(el=>{const r=el.getBoundingClientRect();el.style.setProperty('--p',clamp((h-r.top)/(h+r.height)).toFixed(4));});
  lines.forEach(el=>{const y=el.getBoundingClientRect().top;el.style.setProperty('--line-color',y<h*.72?'#e6f0f4':'#45555e');});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render)}
 function configure(){document.body.classList.toggle('motion',!reduced.matches);if(reduced.matches){hero.querySelector('.hero-copy').inert=false;hero.querySelectorAll('[aria-hidden]').forEach(el=>{if(!el.classList.contains('sound-space'))el.removeAttribute('aria-hidden')});}else schedule()}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',configure);configure();
})();
