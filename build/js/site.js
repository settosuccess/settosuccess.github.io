const themeStyles=document.createElement('link');
themeStyles.rel='stylesheet';
themeStyles.href='css/theme.css';
document.head.appendChild(themeStyles);
const heroLogo=document.querySelector('.logo-card img');
heroLogo.src='img/set-to-success-logo.svg';
heroLogo.alt='Set to Success Study Centre — learning and progress logo';

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
const mobileCall=navActions.querySelector('a[href^="tel:"]').cloneNode(true);
mobileCall.className='button mobile-call';
document.body.appendChild(mobileCall);
navActions.after(menuButton);
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

const heroEnquiry=document.querySelector('.hero-actions .button');
heroEnquiry.href='#admission';
heroEnquiry.removeAttribute('target');
heroEnquiry.removeAttribute('rel');
heroEnquiry.dataset.en='Book a demo class';
heroEnquiry.dataset.hi='डेमो क्लास बुक करें';
heroEnquiry.textContent=language==='hi'?'डेमो क्लास बुक करें':'Book a demo class';

const aboutSummary=document.createElement('div');
aboutSummary.className='about-summary';
aboutSummary.innerHTML=`
  <div><span data-en="Our purpose" data-hi="हमारा उद्देश्य">${language==='hi'?'हमारा उद्देश्य':'Our purpose'}</span><p data-en="Clear concepts, responsible learning and confidence that lasts beyond exams." data-hi="स्पष्ट अवधारणाएँ, जिम्मेदार सीख और ऐसा आत्मविश्वास जो परीक्षा के बाद भी साथ रहे।">${language==='hi'?'स्पष्ट अवधारणाएँ, जिम्मेदार सीख और ऐसा आत्मविश्वास जो परीक्षा के बाद भी साथ रहे।':'Clear concepts, responsible learning and confidence that lasts beyond exams.'}</p></div>
  <div><span data-en="Learning rhythm" data-hi="सीखने का तरीका">${language==='hi'?'सीखने का तरीका':'Learning rhythm'}</span><p data-en="Understand → Practise → Reflect → Move forward" data-hi="समझें → अभ्यास करें → विचार करें → आगे बढ़ें">${language==='hi'?'समझें → अभ्यास करें → विचार करें → आगे बढ़ें':'Understand → Practise → Reflect → Move forward'}</p></div>`;
document.querySelector('.intro-copy').appendChild(aboutSummary);
const typingNote=document.createElement('div');
typingNote.className='about-typing';
typingNote.innerHTML='<p class="typing-label" data-en="One question can change everything." data-hi="एक सवाल नई राह खोल सकता है।"></p><p class="typing-line" aria-hidden="true"><span></span><i></i></p><span class="typing-accessible"></span>';
document.querySelector('#about .section-heading').appendChild(typingNote);
const typingLines={en:['Ask freely. Learn deeply.','Small steps. Strong foundations.','Grow with confidence.'],hi:['खुलकर पूछें। गहराई से सीखें।','छोटे कदम। मज़बूत नींव।','आत्मविश्वास के साथ आगे बढ़ें।']};
const typingMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer,typingVisible=false;
function resetTyping(){
  clearTimeout(typingTimer);
  const lines=typingLines[language];
  typingNote.querySelector('.typing-label').textContent=typingNote.querySelector('.typing-label').dataset[language];
  typingNote.querySelector('.typing-accessible').textContent=lines.join(' ');
  const output=typingNote.querySelector('.typing-line span');
  output.textContent=lines[0];
  if(typingMotion.matches||!typingVisible||document.hidden)return;
  let line=0,position=0,erasing=false;
  const segments=text=>typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(language,{granularity:'grapheme'}).segment(text)].map(part=>part.segment):Array.from(text);
  function tick(){
    const letters=segments(lines[line]);
    position+=erasing?-1:1;
    output.textContent=letters.slice(0,position).join('');
    let delay=erasing?40:85;
    if(position===letters.length&&!erasing){erasing=true;delay=2200}
    else if(position===0&&erasing){erasing=false;line=(line+1)%lines.length;delay=350}
    typingTimer=setTimeout(tick,delay);
  }
  output.textContent='';
  tick();
}
languageButton.addEventListener('click',resetTyping);
typingMotion.addEventListener('change',resetTyping);
document.addEventListener('visibilitychange',resetTyping);
new IntersectionObserver(entries=>{typingVisible=entries[0].isIntersecting;resetTyping()},{threshold:.15}).observe(typingNote);
resetTyping();
document.querySelector('.story').remove();

const classesNavLink=document.createElement('a');
classesNavLink.href='#classes';
classesNavLink.dataset.en='Classes';
classesNavLink.dataset.hi='कक्षाएँ';
classesNavLink.textContent=language==='hi'?'कक्षाएँ':'Classes';
document.querySelector('.primary-nav a[href="#gallery"]').before(classesNavLink);
classesNavLink.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
});

const resultsNavLink=document.createElement('a');
resultsNavLink.href='#results';
resultsNavLink.dataset.en='Results';
resultsNavLink.dataset.hi='परिणाम';
resultsNavLink.textContent=language==='hi'?'परिणाम':'Results';
document.querySelector('.primary-nav a[href="#gallery"]').before(resultsNavLink);
resultsNavLink.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
});

const careerNavLink=document.createElement('a');
careerNavLink.href='#career';
careerNavLink.dataset.en='Career';
careerNavLink.dataset.hi='करियर';
careerNavLink.textContent=language==='hi'?'करियर':'Career';
document.querySelector('.primary-nav a[href="#gallery"]').before(careerNavLink);
careerNavLink.addEventListener('click',()=>{
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
});

const classesSection=document.createElement('section');
classesSection.className='classes-section section';
classesSection.id='classes';
classesSection.innerHTML=`
  <div class="container">
    <div class="classes-heading reveal">
      <div><p class="eyebrow" data-en="Classes offered" data-hi="उपलब्ध कक्षाएँ">${language==='hi'?'उपलब्ध कक्षाएँ':'Classes offered'}</p><h2 data-en="Focused guidance for every stage." data-hi="हर स्तर के लिए केंद्रित मार्गदर्शन।">${language==='hi'?'हर स्तर के लिए केंद्रित मार्गदर्शन।':'Focused guidance for every stage.'}</h2></div>
      <p data-en="Board-aligned learning for Classes 8–10, followed by dedicated Mathematics guidance for senior secondary students." data-hi="कक्षा 8–10 के लिए बोर्ड के अनुसार पढ़ाई और वरिष्ठ माध्यमिक छात्रों के लिए समर्पित गणित मार्गदर्शन।">${language==='hi'?'कक्षा 8–10 के लिए बोर्ड के अनुसार पढ़ाई और वरिष्ठ माध्यमिक छात्रों के लिए समर्पित गणित मार्गदर्शन।':'Board-aligned learning for Classes 8–10, followed by dedicated Mathematics guidance for senior secondary students.'}</p>
    </div>
    <div class="classes-grid">
      <article class="class-card reveal"><div class="class-top"><span>8–10</span><i data-en="Bihar Board" data-hi="बिहार बोर्ड">${language==='hi'?'बिहार बोर्ड':'Bihar Board'}</i></div><h3 data-en="Classes 8th to 10th" data-hi="कक्षा 8वीं से 10वीं">${language==='hi'?'कक्षा 8वीं से 10वीं':'Classes 8th to 10th'}</h3><p data-en="Clear concepts, regular practice and board-focused academic guidance." data-hi="स्पष्ट अवधारणाएँ, नियमित अभ्यास और बोर्ड-केंद्रित शैक्षणिक मार्गदर्शन।">${language==='hi'?'स्पष्ट अवधारणाएँ, नियमित अभ्यास और बोर्ड-केंद्रित शैक्षणिक मार्गदर्शन।':'Clear concepts, regular practice and board-focused academic guidance.'}</p><ul><li data-en="Bihar Board curriculum" data-hi="बिहार बोर्ड पाठ्यक्रम">${language==='hi'?'बिहार बोर्ड पाठ्यक्रम':'Bihar Board curriculum'}</li><li data-en="Concept & exam preparation" data-hi="अवधारणा एवं परीक्षा तैयारी">${language==='hi'?'अवधारणा एवं परीक्षा तैयारी':'Concept & exam preparation'}</li></ul></article>
      <article class="class-card reveal"><div class="class-top"><span>8–10</span><i>CBSE</i></div><h3 data-en="Classes 8th to 10th" data-hi="कक्षा 8वीं से 10वीं">${language==='hi'?'कक्षा 8वीं से 10वीं':'Classes 8th to 10th'}</h3><p data-en="Structured learning designed around understanding and consistent progress." data-hi="समझ और निरंतर प्रगति पर आधारित व्यवस्थित शिक्षण।">${language==='hi'?'समझ और निरंतर प्रगति पर आधारित व्यवस्थित शिक्षण।':'Structured learning designed around understanding and consistent progress.'}</p><ul><li data-en="CBSE curriculum" data-hi="CBSE पाठ्यक्रम">${language==='hi'?'CBSE पाठ्यक्रम':'CBSE curriculum'}</li><li data-en="Practice & doubt support" data-hi="अभ्यास एवं संदेह समाधान">${language==='hi'?'अभ्यास एवं संदेह समाधान':'Practice & doubt support'}</li></ul></article>
      <article class="class-card featured-class reveal"><div class="class-top"><span>11–12</span><i data-en="Mathematics only" data-hi="केवल गणित">${language==='hi'?'केवल गणित':'Mathematics only'}</i></div><h3 data-en="Senior Secondary Mathematics" data-hi="सीनियर सेकेंडरी गणित">${language==='hi'?'सीनियर सेकेंडरी गणित':'Senior Secondary Mathematics'}</h3><p data-en="Dedicated Mathematics guidance for Classes 11th and 12th with emphasis on concepts, problem-solving and accuracy." data-hi="कक्षा 11वीं और 12वीं के लिए अवधारणाओं, समस्या-समाधान और सटीकता पर केंद्रित गणित मार्गदर्शन।">${language==='hi'?'कक्षा 11वीं और 12वीं के लिए अवधारणाओं, समस्या-समाधान और सटीकता पर केंद्रित गणित मार्गदर्शन।':'Dedicated Mathematics guidance for Classes 11th and 12th with emphasis on concepts, problem-solving and accuracy.'}</p><ul><li data-en="Mathematics only" data-hi="केवल गणित">${language==='hi'?'केवल गणित':'Mathematics only'}</li><li data-en="Classes 11th & 12th" data-hi="कक्षा 11वीं एवं 12वीं">${language==='hi'?'कक्षा 11वीं एवं 12वीं':'Classes 11th & 12th'}</li></ul></article>
    </div>
    <div class="classes-cta reveal"><p data-en="Not sure which guidance fits your student?" data-hi="सही मार्गदर्शन चुनने में सहायता चाहिए?">${language==='hi'?'सही मार्गदर्शन चुनने में सहायता चाहिए?':'Not sure which guidance fits your student?'}</p><a class="button" href="#admission" data-en="Book a demo class" data-hi="डेमो क्लास बुक करें">${language==='hi'?'डेमो क्लास बुक करें':'Book a demo class'}</a></div>
  </div>`;
document.querySelector('.approach').after(classesSection);

const resultsSection=document.createElement('section');
resultsSection.className='results-section section';
resultsSection.id='results';
resultsSection.innerHTML=`
  <div class="container">
    <div class="results-heading reveal">
      <div><p class="eyebrow" data-en="Year-wise highlights" data-hi="वर्षवार उपलब्धियाँ">${language==='hi'?'वर्षवार उपलब्धियाँ':'Year-wise highlights'}</p><h2 data-en="Results that inspire the next step." data-hi="परिणाम जो अगला कदम बढ़ाने की प्रेरणा दें।">${language==='hi'?'परिणाम जो अगला कदम बढ़ाने की प्रेरणा दें।':'Results that inspire the next step.'}</h2></div>
      <div class="result-note"><span class="demo-badge" data-en="Sample / Demo Results" data-hi="नमूना / डेमो परिणाम">${language==='hi'?'नमूना / डेमो परिणाम':'Sample / Demo Results'}</span><p data-en="Choose a year to preview student result cards." data-hi="छात्रों के परिणाम कार्ड देखने के लिए वर्ष चुनें।">${language==='hi'?'छात्रों के परिणाम कार्ड देखने के लिए वर्ष चुनें।':'Choose a year to preview student result cards.'}</p></div>
    </div>
    <div class="result-years reveal" aria-label="Result year">
      <button class="result-year" type="button" data-year="2026" aria-pressed="true">2026</button>
      <button class="result-year" type="button" data-year="2025" aria-pressed="false">2025</button>
    </div>
    <div class="results-grid">
      <article class="result-card reveal" data-year="2026"><div class="result-photo"><img src="img/demo-result-ananya.webp" alt="Demo portrait of Ananya Kumari wearing a face mask" loading="lazy"><span class="rank-chip"><b>#1</b><small data-en="Rank" data-hi="रैंक">${language==='hi'?'रैंक':'Rank'}</small></span></div><div class="result-info"><p class="result-board">2026 · Bihar Board · Class 10</p><h3>Ananya Kumari</h3><div class="score"><strong>96.4%</strong><span data-en="Marks" data-hi="अंक">${language==='hi'?'अंक':'Marks'}</span></div></div></article>
      <article class="result-card reveal" data-year="2026"><div class="result-photo"><img src="img/demo-result-aryan.webp" alt="Demo portrait of Aryan Raj" loading="lazy"><span class="rank-chip"><b>#2</b><small data-en="Rank" data-hi="रैंक">${language==='hi'?'रैंक':'Rank'}</small></span></div><div class="result-info"><p class="result-board">2026 · CBSE · Class 10</p><h3>Aryan Raj</h3><div class="score"><strong>94.8%</strong><span data-en="Marks" data-hi="अंक">${language==='hi'?'अंक':'Marks'}</span></div></div></article>
      <article class="result-card reveal" data-year="2025"><div class="result-photo"><img src="img/demo-result-sakshi.webp" alt="Demo portrait of Sakshi Singh wearing a face mask" loading="lazy"><span class="rank-chip"><b>#1</b><small data-en="Rank" data-hi="रैंक">${language==='hi'?'रैंक':'Rank'}</small></span></div><div class="result-info"><p class="result-board">2025 · CBSE · Class 10</p><h3>Sakshi Singh</h3><div class="score"><strong>95.6%</strong><span data-en="Marks" data-hi="अंक">${language==='hi'?'अंक':'Marks'}</span></div></div></article>
      <article class="result-card reveal" data-year="2025"><div class="result-photo"><img src="img/demo-result-rohan.webp" alt="Demo portrait of Rohan Kumar" loading="lazy"><span class="rank-chip"><b>#2</b><small data-en="Rank" data-hi="रैंक">${language==='hi'?'रैंक':'Rank'}</small></span></div><div class="result-info"><p class="result-board">2025 · Bihar Board · Class 10</p><h3>Rohan Kumar</h3><div class="score"><strong>93.2%</strong><span data-en="Marks" data-hi="अंक">${language==='hi'?'अंक':'Marks'}</span></div></div></article>
    </div>
    <p class="result-disclaimer reveal" data-en="Demo notice: These are fictional sample entries for design preview. Replace them with verified student results before publishing." data-hi="डेमो सूचना: ये केवल डिज़ाइन दिखाने के लिए काल्पनिक नमूना प्रविष्टियाँ हैं। प्रकाशित करने से पहले इन्हें सत्यापित छात्र परिणामों से बदलें।">${language==='hi'?'डेमो सूचना: ये केवल डिज़ाइन दिखाने के लिए काल्पनिक नमूना प्रविष्टियाँ हैं। प्रकाशित करने से पहले इन्हें सत्यापित छात्र परिणामों से बदलें।':'Demo notice: These are fictional sample entries for design preview. Replace them with verified student results before publishing.'}</p>
  </div>`;
classesSection.after(resultsSection);

const resultYearButtons=[...resultsSection.querySelectorAll('.result-year')];
const resultCards=[...resultsSection.querySelectorAll('.result-card')];
function showResultYear(year){
  resultYearButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.year===year)));
  resultCards.forEach(card=>{card.hidden=card.dataset.year!==year});
}
resultYearButtons.forEach(button=>button.addEventListener('click',()=>showResultYear(button.dataset.year)));
showResultYear('2026');

const careerSection=document.createElement('section');
careerSection.className='career-section section';
careerSection.id='career';
careerSection.innerHTML=`
  <div class="container">
    <div class="career-heading reveal">
      <div><p class="eyebrow" data-en="Explore your future" data-hi="अपने भविष्य को जानें">${language==='hi'?'अपने भविष्य को जानें':'Explore your future'}</p><h2 data-en="Career possibilities with Mathematics." data-hi="गणित के साथ करियर की संभावनाएँ।">${language==='hi'?'गणित के साथ करियर की संभावनाएँ।':'Career possibilities with Mathematics.'}</h2></div>
      <p data-en="Discover fields where mathematical thinking is valuable and understand the academic routes that can lead towards them." data-hi="उन क्षेत्रों को जानें जहाँ गणितीय सोच उपयोगी है और उन तक पहुँचने वाले शैक्षणिक रास्तों को समझें।">${language==='hi'?'उन क्षेत्रों को जानें जहाँ गणितीय सोच उपयोगी है और उन तक पहुँचने वाले शैक्षणिक रास्तों को समझें।':'Discover fields where mathematical thinking is valuable and understand the academic routes that can lead towards them.'}</p>
    </div>
    <div class="career-paths">
      <article class="career-card reveal"><span class="career-number">01</span><div class="career-icon" aria-hidden="true">⌘</div><h3 data-en="Engineering & Technology" data-hi="इंजीनियरिंग एवं टेक्नोलॉजी">${language==='hi'?'इंजीनियरिंग एवं टेक्नोलॉजी':'Engineering & Technology'}</h3><p data-en="Mathematics supports further study in engineering, computer science, architecture and other technical fields." data-hi="गणित इंजीनियरिंग, कंप्यूटर साइंस, आर्किटेक्चर और अन्य तकनीकी क्षेत्रों की आगे की पढ़ाई में सहायक है।">${language==='hi'?'गणित इंजीनियरिंग, कंप्यूटर साइंस, आर्किटेक्चर और अन्य तकनीकी क्षेत्रों की आगे की पढ़ाई में सहायक है।':'Mathematics supports further study in engineering, computer science, architecture and other technical fields.'}</p><ul><li>Engineering</li><li>Architecture</li><li>Computer Science</li></ul></article>
      <article class="career-card career-card-featured reveal"><span class="career-number">02</span><div class="career-icon" aria-hidden="true">∑</div><h3 data-en="Data, Finance & Analytics" data-hi="डेटा, फाइनेंस एवं एनालिटिक्स">${language==='hi'?'डेटा, फाइनेंस एवं एनालिटिक्स':'Data, Finance & Analytics'}</h3><p data-en="Use mathematical thinking in statistics, economics, finance, data science and business analytics." data-hi="सांख्यिकी, अर्थशास्त्र, फाइनेंस, डेटा साइंस और बिज़नेस एनालिटिक्स में गणितीय सोच का उपयोग करें।">${language==='hi'?'सांख्यिकी, अर्थशास्त्र, फाइनेंस, डेटा साइंस और बिज़नेस एनालिटिक्स में गणितीय सोच का उपयोग करें।':'Use mathematical thinking in statistics, economics, finance, data science and business analytics.'}</p><ul><li>Statistics</li><li>Economics</li><li>Data Science</li></ul></article>
      <article class="career-card reveal"><span class="career-number">03</span><div class="career-icon" aria-hidden="true">π</div><h3 data-en="Teaching & Research" data-hi="शिक्षण एवं शोध">${language==='hi'?'शिक्षण एवं शोध':'Teaching & Research'}</h3><p data-en="Go deeper into Mathematics through higher studies, academic research and teaching." data-hi="उच्च शिक्षा, अकादमिक शोध और शिक्षण के माध्यम से गणित में गहराई तक जाएँ।">${language==='hi'?'उच्च शिक्षा, अकादमिक शोध और शिक्षण के माध्यम से गणित में गहराई तक जाएँ।':'Go deeper into Mathematics through higher studies, academic research and teaching.'}</p><ul><li>B.Sc. Maths</li><li>Research</li><li>Teaching</li></ul></article>
    </div>
    <div class="career-roadmap reveal">
      <div class="roadmap-step"><b>1</b><span><strong data-en="Know your strengths" data-hi="अपनी ताकत पहचानें">${language==='hi'?'अपनी ताकत पहचानें':'Know your strengths'}</strong><small data-en="Interests, subjects and learning style" data-hi="रुचि, विषय और सीखने का तरीका">${language==='hi'?'रुचि, विषय और सीखने का तरीका':'Interests, subjects and learning style'}</small></span></div>
      <i aria-hidden="true">→</i>
      <div class="roadmap-step"><b>2</b><span><strong data-en="Explore the path" data-hi="विकल्प समझें">${language==='hi'?'विकल्प समझें':'Explore the path'}</strong><small data-en="Courses, entrance exams and opportunities" data-hi="कोर्स, प्रवेश परीक्षाएँ और अवसर">${language==='hi'?'कोर्स, प्रवेश परीक्षाएँ और अवसर':'Courses, entrance exams and opportunities'}</small></span></div>
      <i aria-hidden="true">→</i>
      <div class="roadmap-step"><b>3</b><span><strong data-en="Prepare with a plan" data-hi="योजना के साथ तैयारी करें">${language==='hi'?'योजना के साथ तैयारी करें':'Prepare with a plan'}</strong><small data-en="Clear goals and consistent practice" data-hi="स्पष्ट लक्ष्य और नियमित अभ्यास">${language==='hi'?'स्पष्ट लक्ष्य और नियमित अभ्यास':'Clear goals and consistent practice'}</small></span></div>
    </div>
    <p class="career-note reveal" data-en="These pathways are shared for general awareness; course eligibility and entrance requirements vary by institution." data-hi="ये विकल्प सामान्य जानकारी के लिए हैं; कोर्स की पात्रता और प्रवेश आवश्यकताएँ संस्थान के अनुसार अलग हो सकती हैं।">${language==='hi'?'ये विकल्प सामान्य जानकारी के लिए हैं; कोर्स की पात्रता और प्रवेश आवश्यकताएँ संस्थान के अनुसार अलग हो सकती हैं।':'These pathways are shared for general awareness; course eligibility and entrance requirements vary by institution.'}</p>
    <div class="career-cta reveal"><div><strong data-en="Want to understand the options?" data-hi="विकल्पों को बेहतर समझना चाहते हैं?">${language==='hi'?'विकल्पों को बेहतर समझना चाहते हैं?':'Want to understand the options?'}</strong><p data-en="Talk to us about subjects, study habits and possible academic routes." data-hi="विषयों, पढ़ाई की आदतों और संभावित शैक्षणिक रास्तों पर हमसे बात करें।">${language==='hi'?'विषयों, पढ़ाई की आदतों और संभावित शैक्षणिक रास्तों पर हमसे बात करें।':'Talk to us about subjects, study habits and possible academic routes.'}</p></div><a class="button" href="https://wa.me/917631422549?text=Hello%20Set%20to%20Success%2C%20I%20would%20like%20to%20discuss%20subject%20and%20study%20options." target="_blank" rel="noopener" data-en="Discuss options" data-hi="विकल्पों पर बात करें">${language==='hi'?'विकल्पों पर बात करें':'Discuss options'}</a></div>
  </div>`;
resultsSection.after(careerSection);

const admissionSection=document.createElement('section');
admissionSection.className='admission-section section';
admissionSection.id='admission';
admissionSection.innerHTML=`
  <div class="container admission-layout">
    <div class="admission-copy reveal">
      <p class="eyebrow" data-en="Admissions open" data-hi="प्रवेश जारी है">${language==='hi'?'प्रवेश जारी है':'Admissions open'}</p>
      <h2 data-en="Book a demo class." data-hi="डेमो क्लास बुक करें।">${language==='hi'?'डेमो क्लास बुक करें।':'Book a demo class.'}</h2>
      <p data-en="Tell us a few details about the student. Your enquiry will open in WhatsApp, ready to send to Set to Success." data-hi="छात्र के बारे में कुछ जानकारी दें। आपकी enquiry WhatsApp में तैयार होकर खुलेगी, जिसे आप Set to Success को भेज सकते हैं।">${language==='hi'?'छात्र के बारे में कुछ जानकारी दें। आपकी enquiry WhatsApp में तैयार होकर खुलेगी, जिसे आप Set to Success को भेज सकते हैं।':'Tell us a few details about the student. Your enquiry will open in WhatsApp, ready to send to Set to Success.'}</p>
      <ul class="admission-benefits"><li><span>✓</span><span data-en="Discuss the right class and board" data-hi="सही कक्षा और बोर्ड पर चर्चा">${language==='hi'?'सही कक्षा और बोर्ड पर चर्चा':'Discuss the right class and board'}</span></li><li><span>✓</span><span data-en="Understand the teaching approach" data-hi="पढ़ाने का तरीका समझें">${language==='hi'?'पढ़ाने का तरीका समझें':'Understand the teaching approach'}</span></li><li><span>✓</span><span data-en="Ask about batches and availability" data-hi="बैच और उपलब्धता की जानकारी लें">${language==='hi'?'बैच और उपलब्धता की जानकारी लें':'Ask about batches and availability'}</span></li></ul>
    </div>
    <form class="admission-form reveal" id="admission-form">
      <div class="form-heading"><span aria-hidden="true">✦</span><div><h3 data-en="Student enquiry" data-hi="छात्र enquiry">${language==='hi'?'छात्र enquiry':'Student enquiry'}</h3><p data-en="All fields are required" data-hi="सभी जानकारी आवश्यक है">${language==='hi'?'सभी जानकारी आवश्यक है':'All fields are required'}</p></div></div>
      <label><span data-en="Student name" data-hi="छात्र का नाम">${language==='hi'?'छात्र का नाम':'Student name'}</span><input type="text" name="studentName" autocomplete="name" required maxlength="60" placeholder="e.g. Aman Kumar"></label>
      <div class="form-row">
        <label><span data-en="Class" data-hi="कक्षा">${language==='hi'?'कक्षा':'Class'}</span><select name="studentClass" required><option value="" disabled selected data-en="Select class" data-hi="कक्षा चुनें">${language==='hi'?'कक्षा चुनें':'Select class'}</option><option>8th</option><option>9th</option><option>10th</option><option>11th</option><option>12th</option></select></label>
        <label><span data-en="Board" data-hi="बोर्ड">${language==='hi'?'बोर्ड':'Board'}</span><select name="board" required><option value="" disabled selected data-en="Select board" data-hi="बोर्ड चुनें">${language==='hi'?'बोर्ड चुनें':'Select board'}</option><option>CBSE</option><option>Bihar Board</option></select></label>
      </div>
      <label><span data-en="Phone number" data-hi="फोन नंबर">${language==='hi'?'फोन नंबर':'Phone number'}</span><input type="tel" name="phone" autocomplete="tel-national" inputmode="numeric" required minlength="10" maxlength="10" pattern="[6-9][0-9]{9}" placeholder="9876543210" aria-describedby="phone-help phone-error"><small id="phone-help" data-en="10 digits, starting with 6, 7, 8 or 9. Do not include +91." data-hi="10 अंक, शुरुआत 6, 7, 8 या 9 से। +91 न जोड़ें।">${language==='hi'?'10 अंक, शुरुआत 6, 7, 8 या 9 से। +91 न जोड़ें।':'10 digits, starting with 6, 7, 8 or 9. Do not include +91.'}</small><small id="phone-error" class="phone-error" aria-live="polite"></small></label>
      <button class="button admission-submit" type="submit"><span data-en="Continue on WhatsApp" data-hi="WhatsApp पर आगे बढ़ें">${language==='hi'?'WhatsApp पर आगे बढ़ें':'Continue on WhatsApp'}</span><i aria-hidden="true">↗</i></button>
      <p class="form-privacy" data-en="Nothing is sent until you review and send the message in WhatsApp." data-hi="जब तक आप WhatsApp में संदेश देखकर भेजते नहीं हैं, कोई जानकारी साझा नहीं होगी।">${language==='hi'?'जब तक आप WhatsApp में संदेश देखकर भेजते नहीं हैं, कोई जानकारी साझा नहीं होगी।':'Nothing is sent until you review and send the message in WhatsApp.'}</p>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>`;
careerSection.after(admissionSection);

const admissionForm=admissionSection.querySelector('#admission-form');
const phoneInput=admissionForm.elements.phone;
function validatePhone(showError=false){
  const valid=/^[6-9][0-9]{9}$/.test(phoneInput.value);
  const message=language==='hi'?'6–9 से शुरू होने वाला 10 अंकों का मोबाइल नंबर दर्ज करें।':'Enter a 10-digit mobile number starting with 6–9.';
  phoneInput.setCustomValidity(valid?'':message);
  phoneInput.setAttribute('aria-invalid',String(showError&&!valid));
  document.getElementById('phone-error').textContent=showError&&!valid?message:'';
  return valid;
}
phoneInput.addEventListener('input',()=>validatePhone(false));
phoneInput.addEventListener('blur',()=>validatePhone(phoneInput.value.length>0));
phoneInput.addEventListener('invalid',()=>validatePhone(true));
admissionForm.addEventListener('submit',event=>{
  event.preventDefault();
  const formData=new FormData(admissionForm);
  const phone=phoneInput.value;
  const status=admissionForm.querySelector('.form-status');
  if(!validatePhone(true)){
    phoneInput.reportValidity();
    return;
  }
  status.textContent=language==='hi'?'WhatsApp enquiry तैयार की जा रही है…':'Preparing your WhatsApp enquiry…';
  const message=[
    'Hello Set to Success, I would like to book a demo class.',
    `Student name: ${formData.get('studentName')}`,
    `Class: ${formData.get('studentClass')}`,
    `Board: ${formData.get('board')}`,
    `Phone: +91 ${phone}`
  ].join('\n');
  window.open(`https://wa.me/917631422549?text=${encodeURIComponent(message)}`,'_blank','noopener');
  status.textContent=language==='hi'?'WhatsApp खुल गया है—कृपया संदेश देखकर भेजें।':'WhatsApp opened—please review and send the message.';
});

const classroomSection=document.createElement('section');
classroomSection.className='classroom-scene section';
classroomSection.setAttribute('aria-labelledby','classroom-title');
classroomSection.innerHTML=`
  <div class="container classroom-grid">
    <div class="classroom-copy reveal">
      <p class="eyebrow" data-en="Learning in action" data-hi="सीखते हुए आगे बढ़ें">${language==='hi'?'सीखते हुए आगे बढ़ें':'Learning in action'}</p>
      <h2 id="classroom-title" data-en="When ideas come alive in the classroom." data-hi="जब कक्षा में विचार जीवंत हो उठते हैं।">${language==='hi'?'जब कक्षा में विचार जीवंत हो उठते हैं।':'When ideas come alive in the classroom.'}</h2>
      <p data-en="Clear explanation, curious questions and active participation turn every lesson into meaningful progress." data-hi="स्पष्ट समझ, जिज्ञासु सवाल और सक्रिय भागीदारी हर पाठ को सार्थक प्रगति में बदलते हैं।">${language==='hi'?'स्पष्ट समझ, जिज्ञासु सवाल और सक्रिय भागीदारी हर पाठ को सार्थक प्रगति में बदलते हैं।':'Clear explanation, curious questions and active participation turn every lesson into meaningful progress.'}</p>
    </div>
    <div class="classroom-art reveal">
      <img class="classroom-frame frame-one" src="img/teacher-classroom-illustration.webp" alt="Illustration of a teacher explaining geometry to students" loading="lazy">
      <img class="classroom-frame frame-two" src="img/teacher-classroom-frame-2.webp" alt="" loading="lazy" aria-hidden="true">
      <div class="lesson-live" aria-hidden="true"><i></i><span data-en="Lesson in progress" data-hi="कक्षा जारी है">${language==='hi'?'कक्षा जारी है':'Lesson in progress'}</span></div>
      <svg class="chalk-motion" viewBox="0 0 100 56" aria-hidden="true">
        <path class="chalk-line line-a" d="M51 10 L41 31"/>
        <path class="chalk-line line-b" d="M51 10 L62 31"/>
        <path class="chalk-line line-c" d="M41 31 L62 31"/>
        <circle class="chalk-pointer" r="1.15"><animateMotion dur="4s" repeatCount="indefinite" path="M51 10 L41 31 L62 31 L51 10"/></circle>
      </svg>
      <span class="learning-symbol symbol-one" aria-hidden="true">△</span>
      <span class="learning-symbol symbol-two" aria-hidden="true">x²</span>
      <span class="learning-symbol symbol-three" aria-hidden="true">✦</span>
      <div class="teaching-pulse" aria-hidden="true"></div>
    </div>
  </div>`;
document.querySelector('.approach').before(classroomSection);

const supportSection=document.createElement('section');
supportSection.className='support-faq section';
supportSection.innerHTML=`
  <div class="container support-grid">
    <div class="support-copy reveal"><p class="eyebrow" data-en="Students & families" data-hi="छात्र और परिवार">${language==='hi'?'छात्र और परिवार':'Students & families'}</p><h2 data-en="Better learning works as a partnership." data-hi="बेहतर पढ़ाई साझेदारी से संभव होती है।">${language==='hi'?'बेहतर पढ़ाई साझेदारी से संभव होती है।':'Better learning works as a partnership.'}</h2><p data-en="Students need space to ask questions, families need clarity, and teachers need an honest view of progress. Open communication keeps everyone moving in the same direction." data-hi="छात्रों को सवाल पूछने की जगह, परिवारों को स्पष्टता और शिक्षकों को प्रगति की सही तस्वीर चाहिए। खुला संवाद सभी को एक दिशा में आगे बढ़ाता है।">${language==='hi'?'छात्रों को सवाल पूछने की जगह, परिवारों को स्पष्टता और शिक्षकों को प्रगति की सही तस्वीर चाहिए। खुला संवाद सभी को एक दिशा में आगे बढ़ाता है।':'Students need space to ask questions, families need clarity, and teachers need an honest view of progress. Open communication keeps everyone moving in the same direction.'}</p><a class="button" href="https://wa.me/917631422549?text=Hello%20Set%20to%20Success%2C%20I%20would%20like%20to%20discuss%20learning%20guidance." target="_blank" rel="noopener" data-en="Start a conversation" data-hi="बातचीत शुरू करें">${language==='hi'?'बातचीत शुरू करें':'Start a conversation'}</a></div>
    <div class="faq-list reveal">
      <details open><summary data-en="What makes the learning approach different?" data-hi="यह सीखने का तरीका अलग कैसे है?">${language==='hi'?'यह सीखने का तरीका अलग कैसे है?':'What makes the learning approach different?'}</summary><p data-en="The focus is on understanding, regular practice and the confidence to solve independently." data-hi="मुख्य ध्यान समझ, नियमित अभ्यास और स्वयं हल करने के आत्मविश्वास पर रहता है।">${language==='hi'?'मुख्य ध्यान समझ, नियमित अभ्यास और स्वयं हल करने के आत्मविश्वास पर रहता है।':'The focus is on understanding, regular practice and the confidence to solve independently.'}</p></details>
      <details><summary data-en="How can parents stay involved?" data-hi="अभिभावक कैसे जुड़े रह सकते हैं?">${language==='hi'?'अभिभावक कैसे जुड़े रह सकते हैं?':'How can parents stay involved?'}</summary><p data-en="By encouraging a steady routine, listening without pressure and discussing progress openly." data-hi="नियमित दिनचर्या को बढ़ावा देकर, बिना दबाव के सुनकर और प्रगति पर खुलकर बात करके।">${language==='hi'?'नियमित दिनचर्या को बढ़ावा देकर, बिना दबाव के सुनकर और प्रगति पर खुलकर बात करके।':'By encouraging a steady routine, listening without pressure and discussing progress openly.'}</p></details>
      <details><summary data-en="How do we begin?" data-hi="शुरुआत कैसे करें?">${language==='hi'?'शुरुआत कैसे करें?':'How do we begin?'}</summary><p data-en="Call or send a WhatsApp message to discuss the student’s current needs and next steps." data-hi="छात्र की मौजूदा जरूरतों और अगले कदमों पर बात करने के लिए कॉल या WhatsApp संदेश भेजें।">${language==='hi'?'छात्र की मौजूदा जरूरतों और अगले कदमों पर बात करने के लिए कॉल या WhatsApp संदेश भेजें।':'Call or send a WhatsApp message to discuss the student’s current needs and next steps.'}</p></details>
    </div>
  </div>`;
document.querySelector('.contact').before(supportSection);

// Demo content is collected here so verified production entries can replace it easily.
const extraCopy=(en,hi)=>`<span data-en="${en}" data-hi="${hi}">${language==='hi'?hi:en}</span>`;
const extraHeading=(en,hi,description,translation)=>`<div class="extra-heading"><div><p class="extra-demo">${extraCopy('DEMO PREVIEW','डेमो प्रीव्यू')}</p><h2>${extraCopy(en,hi)}</h2></div><p>${extraCopy(description,translation)}</p></div>`;
const studentHub=document.createElement('div');
studentHub.className='student-hub';
studentHub.innerHTML=`
<nav class="hub-links container" aria-label="Student information">
  <a href="#batches">${extraCopy('Batch timings','बैच का समय')}</a><a href="#resources">${extraCopy('Study resources','अध्ययन सामग्री')}</a><a href="#teacher">${extraCopy('Meet your teacher','अपने शिक्षक से मिलें')}</a><a href="#notices">${extraCopy('Notice board','सूचना पट्ट')}</a><a href="#feedback">${extraCopy('Feedback','प्रतिक्रिया')}</a>
</nav>
<section class="extra-section section" id="batches"><div class="container">
${extraHeading('Find your study hour.','अपनी पढ़ाई का समय चुनें।','Sample schedule only. Confirm actual batch availability before joining.','यह नमूना समय-सारणी है। जुड़ने से पहले वास्तविक बैच की उपलब्धता पूछें।')}
<div class="batch-grid">
${[
 ['8–9','Bihar Board / CBSE','4:00–5:00 PM','Mon · Wed · Fri','सोम · बुध · शुक्र'],
 ['10','Bihar Board / CBSE','5:00–6:00 PM','Tue · Thu · Sat','मंगल · गुरु · शनि'],
 ['11–12','Mathematics only','6:00–7:00 PM','Mon · Wed · Fri','सोम · बुध · शुक्र'],
 ['8','CBSE','7:00–8:00 AM','Tue · Thu · Sat','मंगल · गुरु · शनि'],
 ['9','Bihar Board','8:00–9:00 AM','Mon · Wed · Fri','सोम · बुध · शुक्र'],
 ['12','Mathematics only','7:00–8:00 PM','Tue · Thu · Sat','मंगल · गुरु · शनि']
].map(([cls,board,time,en,hi])=>`<article class="extra-card"><p class="extra-kicker">${extraCopy('Sample batch','नमूना बैच')}</p><h3>${extraCopy('Class','कक्षा')} ${cls}</h3><p>${board==='Mathematics only'?extraCopy(board,'केवल गणित'):board}</p><strong class="batch-time">${time}</strong><p>${extraCopy(en,hi)}</p><a class="extra-link" href="#admission">${extraCopy('Enquire about this class →','इस कक्षा के बारे में पूछें →')}</a></article>`).join('')}
</div></div></section>
<section class="extra-section section" id="resources"><div class="container">
${extraHeading('A little practice, every day.','हर दिन थोड़ा अभ्यास।','Download short sample Maths sheets. Full class notes will be added here.','गणित की छोटी नमूना शीट डाउनलोड करें। पूरी कक्षा के नोट्स यहाँ जोड़े जाएँगे।')}
<div class="resource-grid">
${[
 ['8–9','Algebra warm-up','बीजगणित अभ्यास','algebra'],
 ['10','Quadratic equations','द्विघात समीकरण','quadratics'],
 ['11–12','Functions & derivatives','फलन एवं अवकलज','calculus'],
 ['8–9','Geometry basics','ज्यामिति की नींव','geometry'],
 ['10','Trigonometry revision','त्रिकोणमिति दोहराव','trigonometry'],
 ['11–12','Probability practice','प्रायिकता अभ्यास','probability']
].map(([cls,en,hi,key])=>`<article class="extra-card resource-card"><span class="resource-format">TXT · ${extraCopy('Sample','नमूना')}</span><p class="extra-kicker">${extraCopy('Classes','कक्षाएँ')} ${cls}</p><h3>${extraCopy(en,hi)}</h3><p>${extraCopy('Quick reference, practice questions and answers.','संक्षिप्त सूत्र, अभ्यास प्रश्न और उत्तर।')}</p><a class="extra-link resource-download" data-resource="${key}">${extraCopy('Download sample ↓','नमूना डाउनलोड करें ↓')}</a></article>`).join('')}
</div></div></section>
<section class="extra-section section" id="teacher"><div class="container teacher-layout">
<div class="teacher-placeholder"><span aria-hidden="true">SKS</span><p>${extraCopy('Teacher photo to be added','शिक्षक की फोटो यहाँ आएगी')}</p></div>
<div>${extraHeading('Meet your teacher.','अपने शिक्षक से मिलें।','Profile preview — qualification and experience details are pending confirmation.','प्रोफाइल प्रीव्यू — योग्यता और अनुभव की जानकारी की पुष्टि बाकी है।')}<h3 class="teacher-name">Saurabh Kumar Singh</h3><p>${extraCopy('Founder & Mentor · Set to Success','संस्थापक एवं मार्गदर्शक · Set to Success')}</p><dl class="teacher-facts"><div><dt>${extraCopy('Teaching focus','शिक्षण का केंद्र')}</dt><dd>${extraCopy('Mathematics · clear concepts and practice','गणित · स्पष्ट अवधारणाएँ और अभ्यास')}</dd></div><div><dt>${extraCopy('Qualification','योग्यता')}</dt><dd>${extraCopy('Verified details coming soon','सत्यापित जानकारी जल्द आएगी')}</dd></div><div><dt>${extraCopy('Experience','अनुभव')}</dt><dd>${extraCopy('Verified details coming soon','सत्यापित जानकारी जल्द आएगी')}</dd></div></dl><a class="extra-link" href="#admission">${extraCopy('Discuss your learning needs →','अपनी पढ़ाई की जरूरतों पर बात करें →')}</a></div>
</div></section>
<section class="extra-section section" id="notices"><div class="container">
${extraHeading('From the notice board.','सूचना पट्ट से।','Illustrative announcements only — these are not active schedules or instructions.','ये केवल नमूना सूचनाएँ हैं — वास्तविक समय-सारणी या निर्देश नहीं।')}
<div class="notice-list">
${[
 ['01','New batch enquiry','नए बैच की जानकारी','Class 10 batch details will appear here once dates and timings are confirmed.','तारीख और समय तय होने पर कक्षा 10 के बैच की जानकारी यहाँ आएगी।'],
 ['02','Practice test update','अभ्यास परीक्षा की सूचना','Upcoming test topics, timing and preparation notes will be shared here.','आगामी परीक्षा के विषय, समय और तैयारी के नोट्स यहाँ साझा होंगे।'],
 ['03','Holiday & class updates','अवकाश एवं कक्षा अपडेट','Confirmed holidays and any rescheduled classes will be listed here.','तय अवकाश और बदली हुई कक्षाओं का समय यहाँ दिया जाएगा।']
].map(([n,en,hi,body,translation])=>`<article class="notice-item"><span class="notice-number">${n}</span><div><p class="extra-kicker">${extraCopy('Demo notice · date pending','डेमो सूचना · तारीख तय नहीं')}</p><h3>${extraCopy(en,hi)}</h3><p>${extraCopy(body,translation)}</p></div></article>`).join('')}
</div></div></section>
<section class="extra-section section" id="feedback"><div class="container">
${extraHeading('Learning, in their words.','पढ़ाई के बारे में उनकी राय।','Fictional feedback for layout preview. Replace with genuine, permission-approved feedback before publishing.','ये डिज़ाइन के लिए काल्पनिक प्रतिक्रियाएँ हैं। प्रकाशित करने से पहले अनुमति प्राप्त वास्तविक प्रतिक्रिया लगाएँ।')}
<div class="feedback-grid">
${[
 ['Demo student A','डेमो छात्र A','I feel more comfortable asking questions and practising on my own.','अब मैं सवाल पूछने और स्वयं अभ्यास करने में अधिक सहज महसूस करता हूँ।'],
 ['Demo parent B','डेमो अभिभावक B','A regular study routine makes it easier to support learning at home.','नियमित पढ़ाई से घर पर बच्चे की पढ़ाई में सहयोग करना आसान होता है।'],
 ['Demo student C','डेमो छात्र C','Working through mistakes helps me understand the next question better.','गलतियों को समझने से अगला प्रश्न बेहतर तरीके से हल कर पाता हूँ।'],
 ['Demo student D','डेमो छात्र D','Short revision exercises help me remember the main ideas.','छोटे दोहराव अभ्यास से मुख्य बातें याद रखने में मदद मिलती है।'],
 ['Demo parent E','डेमो अभिभावक E','Discussing questions together makes study time more meaningful.','सवालों पर साथ चर्चा करने से पढ़ाई का समय अधिक उपयोगी बनता है।'],
 ['Demo student F','डेमो छात्र F','Breaking a difficult problem into steps makes it less confusing.','कठिन प्रश्न को छोटे चरणों में बाँटने से उलझन कम होती है।']
].map(([en,hi,quote,translation])=>`<figure class="extra-card feedback-card"><p class="extra-kicker">${extraCopy('Fictional sample','काल्पनिक नमूना')}</p><blockquote>${extraCopy(quote,translation)}</blockquote><figcaption>${extraCopy(en,hi)}</figcaption></figure>`).join('')}
</div></div></section>`;
admissionSection.after(studentHub);
const sampleSheets={
  geometry:'SET TO SUCCESS — DEMO SHEET\nGeometry / ज्यामिति\nTriangle angles total 180 degrees.\nQuestion: Two angles are 50 and 60 degrees. Find the third.\nAnswer: 70 degrees.\nप्रश्न: दो कोण 50 और 60 डिग्री हैं। तीसरा कोण? उत्तर: 70 डिग्री।',
  trigonometry:'SET TO SUCCESS — DEMO SHEET\nTrigonometry / त्रिकोणमिति\nsin^2(theta) + cos^2(theta) = 1\nFor an acute angle with sin(theta)=3/5, cos(theta)=4/5.\nन्यून कोण के लिए sin(theta)=3/5 हो तो cos(theta)=4/5 होगा।',
  probability:'SET TO SUCCESS — DEMO SHEET\nProbability / प्रायिकता\nFor equally likely outcomes, P(A)=favourable outcomes / total outcomes.\nA fair die: probability of an even number = 3/6 = 1/2.\nनिष्पक्ष पासे पर सम संख्या आने की प्रायिकता 1/2 है।',
  algebra:'SET TO SUCCESS — SAMPLE STUDY SHEET\nClasses 8–9: Algebra warm-up\n\nIdentity: (a+b)^2 = a^2 + 2ab + b^2\nPractice: Expand (x+3)^2. Solve 3x+6=21.\nAnswers: x^2+6x+9; x=5.\n\nडेमो अभ्यास: (x+3)^2 का विस्तार करें। 3x+6=21 हल करें।\nThis short sample is not a complete syllabus.',
  quadratics:'SET TO SUCCESS — SAMPLE STUDY SHEET\nClass 10: Quadratic equations\n\nFor ax^2+bx+c=0, a != 0: x=(-b ± sqrt(b^2-4ac))/(2a).\nPractice: Solve x^2-5x+6=0.\nAnswer: x=2 or x=3.\n\nडेमो अभ्यास: x^2-5x+6=0 के मूल ज्ञात करें। उत्तर: 2 और 3।\nThis short sample is not a complete syllabus.',
  calculus:'SET TO SUCCESS — SAMPLE STUDY SHEET\nClasses 11–12: Functions & derivatives\n\nIf f(x)=x^2+1, then f(3)=10.\nPower rule (positive integer n): d(x^n)/dx = n*x^(n-1).\nPractice: Differentiate x^3+2x.\nAnswer: 3x^2+2.\n\nडेमो अभ्यास: x^3+2x का अवकलज निकालें। उत्तर: 3x^2+2।\nThis short sample is not a complete syllabus.'
};
studentHub.querySelectorAll('.resource-download').forEach(link=>{
  link.href=URL.createObjectURL(new Blob([sampleSheets[link.dataset.resource]],{type:'text/plain;charset=utf-8'}));
  link.download=`set-to-success-sample-${link.dataset.resource}.txt`;
});
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
const mobileCarouselQuery=window.matchMedia('(max-width: 650px)');
function selectGalleryItem(item){
  if(item.closest('.compact-list')&&!window.matchMedia('(min-width: 961px)').matches)return;
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
const desktopGalleryQuery=window.matchMedia('(min-width: 961px)');
function stopGalleryShuffle(){clearInterval(galleryTimer)}
function startGalleryShuffle(){
  stopGalleryShuffle();
  if(motionReduced||!desktopGalleryQuery.matches||document.hidden)return;
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
desktopGalleryQuery.addEventListener('change',startGalleryShuffle);
startGalleryShuffle();

// Compact card navigation is shared across desktop, tablet and mobile.
['.gallery-grid','.classes-grid','.career-paths','.approach-grid','.results-grid','.batch-grid','.resource-grid','.notice-list','.feedback-grid'].forEach(selector=>{
  const track=document.querySelector(selector);
  const cards=[...track.children];
  const shell=document.createElement('div');
  shell.className='compact-shell';
  track.before(shell);
  shell.append(track);
  track.classList.add('compact-list');
  const controls=document.createElement('div');
  controls.className='compact-controls';
  controls.innerHTML='<button type="button" aria-label="Previous card">←</button><span class="compact-count"></span><button type="button" aria-label="Next card">→</button><button type="button" class="compact-toggle"></button>';
  shell.append(controls);
  const buttons=controls.querySelectorAll('button');
  let index=0,expanded=false,timer,visible=false;
  const desktopCards=window.matchMedia('(min-width: 961px)');
  const pageSize=()=>desktopCards.matches?3:1;
  const pageCount=()=>Math.ceil(cards.filter(card=>!card.hidden).length/pageSize());
  function advance(step){index=(index+step+pageCount())%pageCount();render()}
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reducedMotion.matches;
  const autoplayButton=document.createElement('button');
  autoplayButton.type='button';
  autoplayButton.className='compact-play';
  controls.append(autoplayButton);
  function restartAutoplay(){
    clearInterval(timer);
    if(selector==='.gallery-grid'&&desktopCards.matches)return;
    const bounds=shell.getBoundingClientRect();
    const onScreen=bounds.bottom>84&&bounds.top<window.innerHeight;
    if(expanded||paused||!onScreen||document.hidden||track.contains(document.activeElement))return;
    if(pageCount()<2)return;
    timer=setInterval(()=>advance(1),5000);
  }
  function render(){
    const available=cards.filter(card=>!card.hidden);
    const desktopGallery=selector==='.gallery-grid'&&desktopCards.matches;
    const showAll=expanded||desktopGallery;
    controls.hidden=desktopGallery;
    index=Math.min(index,Math.max(0,pageCount()-1));
    const pageCards=available.slice(index*pageSize(),(index+1)*pageSize());
    cards.forEach(card=>{
      const concealed=!showAll&&!pageCards.includes(card);
      card.classList.toggle('compact-hidden',concealed);
      card.inert=concealed||card.hidden;
      card.classList.add('visible');
    });
    track.classList.toggle('compact-expanded',showAll);
    cards.forEach(card=>card.classList.toggle('compact-enter',!showAll&&pageCards.includes(card)));
    controls.querySelector('.compact-count').textContent=expanded?String(available.length):`${index*pageSize()+1}${pageSize()>1?'–'+Math.min((index+1)*pageSize(),available.length):''} / ${available.length}`;
    buttons[0].hidden=buttons[1].hidden=expanded||pageCount()<2;
    buttons[2].textContent=language==='hi'?(expanded?'कम देखें':'सभी देखें'):(expanded?'View less':'View all');
    buttons[2].setAttribute('aria-expanded',String(expanded));
    autoplayButton.hidden=expanded||pageCount()<2;
    autoplayButton.textContent=paused?'▶':'Ⅱ';
    autoplayButton.setAttribute('aria-label',language==='hi'?(paused?'स्लाइड चलाएँ':'स्लाइड रोकें'):(paused?'Play slides':'Pause slides'));
  }
  buttons[0].addEventListener('click',()=>{advance(-1);restartAutoplay()});
  buttons[1].addEventListener('click',()=>{advance(1);restartAutoplay()});
  buttons[2].addEventListener('click',()=>{expanded=!expanded;render();restartAutoplay();if(!expanded)shell.scrollIntoView({block:'nearest',behavior:'auto'})});
  autoplayButton.addEventListener('click',()=>{paused=!paused;render();restartAutoplay()});
  track.addEventListener('focusin',()=>clearInterval(timer));
  track.addEventListener('focusout',()=>setTimeout(restartAutoplay,0));
  const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restartAutoplay()},{threshold:.3});
  visibilityObserver.observe(shell);
  document.addEventListener('visibilitychange',restartAutoplay);
  reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;render();restartAutoplay()});
  desktopCards.addEventListener('change',()=>{index=0;render();restartAutoplay()});
  languageButton.addEventListener('click',render);
  if(selector==='.results-grid')resultYearButtons.forEach(button=>button.addEventListener('click',()=>{index=0;render();restartAutoplay()}));
  render();
});

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
