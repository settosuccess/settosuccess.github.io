const themeStyles=document.createElement('link');
themeStyles.rel='stylesheet';
themeStyles.href='css/theme.css';
document.head.appendChild(themeStyles);

const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.primary-nav');
menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!open));
  menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');
  nav.classList.toggle('open');
  document.body.classList.toggle('menu-open',!open);
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
}));

const navActions=document.querySelector('.nav-actions');
const themeButton=document.createElement('button');
themeButton.className='theme-button';
themeButton.type='button';
themeButton.title='Light / dark mode';
themeButton.innerHTML='<span class="sun" aria-hidden="true">☀</span><span class="moon" aria-hidden="true">☾</span>';
navActions.prepend(themeButton);
const savedTheme=localStorage.getItem('sts-theme');
const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
function setTheme(theme){
  document.documentElement.dataset.theme=theme;
  themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');
  themeButton.classList.toggle('is-dark',theme==='dark');
  localStorage.setItem('sts-theme',theme);
}
setTheme(savedTheme||(prefersDark?'dark':'light'));
themeButton.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));

const languageButton=document.querySelector('.language-button');
let language=localStorage.getItem('sts-language')||'en';
function setLanguage(next){
  language=next;
  document.documentElement.lang=next==='hi'?'hi':'en';
  document.querySelectorAll('[data-en][data-hi]').forEach(el=>{el.textContent=el.dataset[next]});
  languageButton.children[0].classList.toggle('active',next==='en');
  languageButton.children[1].classList.toggle('active',next==='hi');
  languageButton.setAttribute('aria-label',next==='en'?'हिंदी में देखें':'View in English');
  localStorage.setItem('sts-language',next);
}
languageButton.addEventListener('click',()=>setLanguage(language==='en'?'hi':'en'));
setLanguage(language);

document.getElementById('year').textContent=new Date().getFullYear();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,index)=>{
  el.style.transitionDelay=`${Math.min(index%3,2)*80}ms`;
  observer.observe(el);
});

const floatingTop=document.createElement('button');
floatingTop.type='button';
floatingTop.className='floating-top';
floatingTop.setAttribute('aria-label','Back to top');
floatingTop.title='Back to top';
floatingTop.textContent='↑';
document.body.appendChild(floatingTop);
const scrollTop=()=>window.scrollTo({top:0,left:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
document.querySelector('.back-top').addEventListener('click',event=>{event.preventDefault();scrollTop()});
floatingTop.addEventListener('click',scrollTop);
window.addEventListener('scroll',()=>floatingTop.classList.toggle('visible',window.scrollY>500),{passive:true});

const galleryItems=[...document.querySelectorAll('.gallery-item')];
const featuredItem=document.querySelector('.gallery-featured');
function selectGalleryItem(item){
  if(item===featuredItem)return;
  const mainImage=featuredItem.querySelector('img');
  const selectedImage=item.querySelector('img');
  const mainCaption=featuredItem.querySelector('figcaption');
  const selectedCaption=item.querySelector('figcaption');
  const mainData={src:mainImage.src,alt:mainImage.alt,en:mainCaption.dataset.en,hi:mainCaption.dataset.hi,text:mainCaption.textContent};
  mainImage.src=selectedImage.src;mainImage.alt=selectedImage.alt;
  mainCaption.dataset.en=selectedCaption.dataset.en;mainCaption.dataset.hi=selectedCaption.dataset.hi;mainCaption.textContent=selectedCaption.textContent;
  selectedImage.src=mainData.src;selectedImage.alt=mainData.alt;
  selectedCaption.dataset.en=mainData.en;selectedCaption.dataset.hi=mainData.hi;selectedCaption.textContent=mainData.text;
  featuredItem.classList.remove('gallery-swap');
  void featuredItem.offsetWidth;
  featuredItem.classList.add('gallery-swap');
}
let galleryTimer;
let galleryStep=1;
const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function stopGalleryShuffle(){clearInterval(galleryTimer)}
function startGalleryShuffle(){
  stopGalleryShuffle();
  if(motionReduced)return;
  galleryTimer=setInterval(()=>{
    selectGalleryItem(galleryItems[galleryStep]);
    galleryStep=galleryStep===galleryItems.length-1?1:galleryStep+1;
  },5000);
}
galleryItems.forEach((item,index)=>{
  item.tabIndex=0;
  item.setAttribute('role','button');
  item.setAttribute('aria-label',index===0?'Main gallery image':'Show this image as main image');
  item.addEventListener('click',()=>{selectGalleryItem(item);startGalleryShuffle()});
  item.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectGalleryItem(item);startGalleryShuffle()}});
});
const galleryGrid=document.querySelector('.gallery-grid');
galleryGrid.addEventListener('mouseenter',stopGalleryShuffle);
galleryGrid.addEventListener('mouseleave',startGalleryShuffle);
galleryGrid.addEventListener('focusin',stopGalleryShuffle);
galleryGrid.addEventListener('focusout',event=>{if(!galleryGrid.contains(event.relatedTarget))startGalleryShuffle()});
document.addEventListener('visibilitychange',()=>document.hidden?stopGalleryShuffle():startGalleryShuffle());
startGalleryShuffle();

const sectionLinks=[...document.querySelectorAll('.primary-nav a[href^="#"]')];
const sectionMap=new Map(sectionLinks.map(link=>[link.getAttribute('href').slice(1),link]));
const trackedSections=[...sectionMap.keys()].map(id=>document.getElementById(id)).filter(Boolean);
function activateSection(id){sectionLinks.forEach(link=>link.classList.toggle('active',link===sectionMap.get(id)))}
const sectionObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(visible[0])activateSection(visible[0].target.id);
},{rootMargin:'-32% 0px -55% 0px',threshold:[0,.15,.4,.7]});
trackedSections.forEach(section=>sectionObserver.observe(section));
sectionLinks.forEach(link=>link.addEventListener('click',()=>activateSection(link.getAttribute('href').slice(1))));
