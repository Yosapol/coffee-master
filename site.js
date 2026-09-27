(() => {
  'use strict';
  const labels = {
    flavor: {floral:'Floral',fruity:'Fruity',citrus:'Citrus',sweet:'Sweet',nutty:'Nutty & cocoa',spiced:'Spiced'},
    roast: {light:'Light roast',medium:'Medium roast',dark:'Dark roast','light-medium':'Light–medium roast','medium-dark':'Medium–dark roast'},
    brew: {espresso:'Espresso',moka:'Moka pot',aeropress:'AeroPress',pourover:'Pour over',drip:'Drip machine',frenchpress:'French press',coldbrew:'Cold brew'}
  };
  function read() {
    const params = new URLSearchParams(location.search), values = {};
    for (const key of Object.keys(labels)) if (Object.hasOwn(labels[key], params.get(key))) values[key] = params.get(key);
    return values;
  }
  let values = read(), ignoreSaved=false;
  function link(page, extra = {}) {
    const url = new URL(page, location.href), explicit = {};
    for (const key of Object.keys(labels)) if (Object.hasOwn(labels[key], url.searchParams.get(key))) explicit[key] = url.searchParams.get(key);
    const result = {...(ignoreSaved?{}:window.CoffeeCup?.context()), ...values, ...explicit, ...extra};
    for (const key of Object.keys(labels)) {
      url.searchParams.delete(key);
      if (Object.hasOwn(labels[key], result[key])) url.searchParams.set(key,result[key]);
    }
    return url.pathname.split('/').pop() + url.search + url.hash;
  }
  const originalLinks = new WeakMap();
  function connectJourney() {
    document.querySelectorAll('a[data-context-link]').forEach(a=>{
      if (!originalLinks.has(a)) originalLinks.set(a,a.getAttribute('href'));
      a.setAttribute('href',link(originalLinks.get(a)));
    });
  }
  function drawContext() {
    connectJourney();
    const box = document.getElementById('journey-context');
    if (!box) return;
    const saved=window.CoffeeCup?.context()||{};
    box.replaceChildren(); box.hidden = !Object.entries(values).some(([k,v])=>saved[k]!==v);
    if (box.hidden) return;
    const intro = document.createElement('strong'); intro.textContent = 'Exploring on this page'; box.append(intro);
    for (const [key,value] of Object.entries(values)) {
      const chip = document.createElement('span'); chip.className='context-chip'; chip.textContent=labels[key][value]; box.append(chip);
    }
    const clear=document.createElement('button');clear.type='button';clear.className='secondary';clear.textContent='Clear choices';
    clear.addEventListener('click',()=>{
      ignoreSaved=true;values={}; const url=new URL(location.href);Object.keys(labels).forEach(key=>url.searchParams.delete(key));history.replaceState(null,'',url);
      drawContext();document.dispatchEvent(new CustomEvent('coffee-context-clear'));
    });box.append(clear);
    const links=document.createElement('div');links.className='context-links';
    for(const [text,page] of [['Change flavor','index.html'],['Change brew or roast','grinder.html']]) {
      const a=document.createElement('a');a.textContent=text;a.href=link(page)+(page==='index.html'?'#finder':'#converter');links.append(a);
    }box.append(links);
  }
  window.CoffeeContext={labels,get:()=>({...(ignoreSaved?{}:window.CoffeeCup?.context()),...values}),link,clear(){
    ignoreSaved=true;values={};const url=new URL(location.href);['flavor','roast','brew','cupEdit','recipe','profile'].forEach(k=>url.searchParams.delete(k));history.replaceState(null,'',url);drawContext();document.dispatchEvent(new CustomEvent('coffee-context-clear'));
  },update(changes){
    ignoreSaved=false;
    values={...values,...changes};for(const key of Object.keys(values))if(!labels[key]||!Object.hasOwn(labels[key],values[key]))delete values[key];
    const url=new URL(location.href);Object.keys(labels).forEach(key=>{url.searchParams.delete(key);if(values[key])url.searchParams.set(key,values[key]);});history.replaceState(null,'',url);drawContext();
  }};
  drawContext();
  document.addEventListener('coffee-cup-change',drawContext);
  const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('main-navigation');
  function closeMenu(){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');document.querySelectorAll('.nav-group').forEach(el=>el.open=false);}
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){
    const focusedGroup=document.activeElement?.closest('.nav-group');
    if(focusedGroup?.open){focusedGroup.open=false;focusedGroup.querySelector('summary').focus();}
    else if(nav?.classList.contains('is-open')){closeMenu();menu.focus();}
  }});
  document.querySelectorAll('.nav-group').forEach(group=>{
    group.addEventListener('toggle',()=>{if(group.open)document.querySelectorAll('.nav-group').forEach(other=>{if(other!==group)other.open=false;});});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  const narrow=matchMedia('(max-width:760px)');narrow.addEventListener('change',closeMenu);
  // Table scrolling remains local to the table, including on small screens.
  document.querySelectorAll('.table-wrap').forEach(el=>{el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Reference table; scroll horizontally for all columns');});
  // Content stays visible without JavaScript; each entrance plays only once.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const entrances = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        if (!motion.matches) entry.target.classList.add('calm-arrival');
        entrances.unobserve(entry.target);
      });
    }, {threshold:0.08});
    document.querySelectorAll('.hero-art,.library-card,.guide-card,.kb-card,.tasting-step,.next-steps').forEach(el=>entrances.observe(el));
  }
})();
