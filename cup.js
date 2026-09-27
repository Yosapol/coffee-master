(() => {
 'use strict';
 const KEY='coffee-master-cup-v1',D=window.CupData,L=CoffeeContext.labels;
 const own=(o,k)=>typeof k==='string'&&Object.hasOwn(o,k);
 const clone=o=>JSON.parse(JSON.stringify(o));
 const plain=s=>typeof s==='string'&&s.length<=300?s:null;
 function clean(raw){
  if(!raw||raw.version!==1)return {version:1};
  const s={version:1};
  for(const k of ['flavor','brew'])if(own(L[k],raw[k]))s[k]=raw[k];
  if(['light','medium','dark'].includes(raw.roast))s.roast=raw.roast;
  if(own(D.moods,raw.mood))s.mood=raw.mood;
  if(own(D.notes,raw.note)&&D.notes[raw.note].family===s.flavor)s.note=raw.note;
  if(raw.bean&&['beans','recommendations'].includes(raw.bean.kind)&&own(D[raw.bean.kind],raw.bean.id))s.bean={kind:raw.bean.kind,id:raw.bean.id};
  if(own(D.recipes,raw.recipe)&&D.recipes[raw.recipe].brew===s.brew)s.recipe=raw.recipe;
  const g=raw.grind;
  if(g&&['start','convert'].includes(g.mode)&&own(D.grinders,g.from)&&own(D.grinders,g.to)&&own(L.brew,g.brew)&&['light','medium','dark'].includes(g.roast)&&g.brew===s.brew&&g.roast===s.roast&&plain(g.value)&&plain(g.source)&&['Manufacturer reference','Community reference','Inferred estimate','Online reference'].includes(g.kind)&&
    (g.mode==='start'||(Number.isFinite(g.input)&&g.input>=D.grinders[g.from].min&&g.input<=D.grinders[g.from].max))){
    s.grind={mode:g.mode,from:g.from,to:g.to,brew:g.brew,roast:g.roast,value:g.value,source:g.source,kind:g.kind,input:g.mode==='convert'?g.input:null};
  }
  return s;
 }
 let state={version:1},persistent=true,undo=null,message='',timer;
 try{state=clean(JSON.parse(localStorage.getItem(KEY)));localStorage.setItem(KEY,JSON.stringify(state));}catch{persistent=false;}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{persistent=false;}}
 function notify(text){toast.textContent=text;clearTimeout(timer);timer=setTimeout(()=>toast.textContent='',3500);}
 function emit(){document.dispatchEvent(new CustomEvent('coffee-cup-change',{detail:clone(state)}));}
 function commit(changes,text='Added to your cup'){
  const next={...state,...changes};message='';
  if(('brew' in changes&&changes.brew!==state.brew)||('roast' in changes&&changes.roast!==state.roast)){
   if(state.grind){delete next.grind;message='Your brew choices changed. Find a fresh grinder setting.';}
   if(next.recipe&&D.recipes[next.recipe]?.brew!==next.brew){delete next.recipe;message='Your method changed. The previous recipe and grind no longer apply.';}
  }
  if(changes.grind)next.grind=changes.grind;
  if('flavor' in changes&&changes.flavor!==state.flavor&&!('note' in changes))delete next.note;
  state=clean(next);persist();const scalar=Object.fromEntries(['flavor','brew','roast'].filter(k=>k in changes).map(k=>[k,state[k]||null]));if(Object.keys(scalar).length)CoffeeContext.update(scalar);render();emit();notify(text);
 }
 function context(){
  const values=Object.fromEntries(['flavor','brew','roast'].filter(k=>state[k]).map(k=>[k,state[k]]));
  if(!state.roast&&state.bean){const roast=D[state.bean.kind][state.bean.id].roast;const range={'Light–medium roast':'light-medium','Medium–dark roast':'medium-dark'}[roast];if(range)values.roast=range;}
  return values;
 }
 window.CoffeeCup={get:()=>clone(state),context,choose:commit,saveBean(kind,id){
  if(!['beans','recommendations'].includes(kind)||!own(D[kind],id))return;
  const b=D[kind][id],roast={'Light roast':'light','Medium roast':'medium','Dark roast':'dark'}[b.roast];
  commit({bean:{kind,id},...(roast?{roast}:{})});
 },saveRecipe(id){if(own(D.recipes,id))commit({recipe:id,brew:D.recipes[id].brew});},saveGrind:g=>commit({brew:g.brew,roast:g.roast,grind:g})};
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 const button=(text,action)=>{const b=el('button','',text);b.type='button';b.addEventListener('click',action);return b;};
 const rail=el('div','cup-rail');
 const opener=button('Your cup',()=>{render();dialog.showModal();opener.setAttribute('aria-expanded','true');});opener.id='cup-open';opener.setAttribute('aria-haspopup','dialog');opener.setAttribute('aria-controls','cup-dialog');opener.setAttribute('aria-expanded','false');
 const icon=el('span','cup-icon');icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 64 64"><defs><clipPath id="cup-liquid-clip"><path d="M12 24h34v18c0 15-34 15-34 0Z"/></clipPath></defs><g clip-path="url(#cup-liquid-clip)"><g class="cup-liquid"><path d="M8 28q10-4 20 0t22 0v32H8Z"/></g></g><path class="cup-outline" d="M12 24h34v18c0 15-34 15-34 0Z"/><path class="cup-outline" d="M46 27h5c12 0 10 17-5 17M10 58h39"/><path class="cup-steam" d="M22 6c-6 5 5 7 0 12M34 4c-6 5 5 8 0 14"/></svg>';opener.prepend(icon);
 const toast=el('span','cup-toast');toast.setAttribute('role','status');rail.append(toast,opener);
 const dialog=el('dialog','cup-dialog');dialog.id='cup-dialog';dialog.setAttribute('aria-labelledby','cup-title');
 const header=el('header','cup-header'),heading=el('h2','','Your cup');heading.id='cup-title';
 const close=button('Close',()=>dialog.close());close.autofocus=true;header.append(heading,close);
 const body=el('div','cup-body'),footer=el('footer','cup-footer');dialog.append(header,body,footer);document.body.append(rail,dialog);document.body.classList.add('has-cup');
 const positionCup=()=>{const h=document.querySelector('.site-header');const top=(h?.offsetHeight||90)+12;document.documentElement.style.setProperty('--cup-top',`${Math.min(top,220)}px`);};
 positionCup();if('ResizeObserver' in window)new ResizeObserver(positionCup).observe(document.querySelector('.site-header'));
 dialog.addEventListener('close',()=>{opener.setAttribute('aria-expanded','false');opener.focus({preventScroll:true});});
 dialog.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('button,a[href]')].filter(n=>n.getClientRects().length&&!n.disabled);
  const first=items[0],last=items[items.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 function href(page){const u=new URL(page,location.href);for(const [k,v]of Object.entries(context()))u.searchParams.set(k,v);u.searchParams.set('cupEdit','1');return u.pathname.split('/').pop()+u.search+u.hash;}
 function row(group,label,value,key,page){
  const r=el('div','cup-row'),copy=el('div');copy.append(el('small','',label),el('p','',value));
  const controls=el('div','cup-row-actions'),a=el('a','','Change');a.href=href(page);a.setAttribute('aria-label','Change '+label.toLowerCase());
  const remove=button('Remove',()=>{commit({[key]:null},'Removed from your cup');CoffeeContext.update({...(key==='flavor'?{flavor:null}:key==='brew'?{brew:null}:key==='roast'?{roast:null}:{})});close.focus();});remove.setAttribute('aria-label','Remove '+label.toLowerCase());controls.append(a,remove);r.append(copy,controls);group.append(r);
 }
 function showBrewPaper(){
  const cup=clone(state);
  dialog.classList.add('cup-paper');
  heading.textContent='A cup, made yours.';
  body.replaceChildren();footer.replaceChildren();body.scrollTop=0;
  const intro=el('div','brew-paper-intro');
  intro.append(el('p','eyebrow','YOUR LITTLE BREW RITUAL'),el('p','','Here’s how your choices come together.'));
  const skip=button('Show all now',()=>{dialog.classList.add('paper-revealed');skip.hidden=true;close.focus({preventScroll:true});});
  skip.className='paper-skip';skip.hidden=reducedMotion.matches;intro.append(skip);body.append(intro);
  const sequence=el('ol','brew-paper-sequence');
  function step(label,value,art,detail){
   const item=el('li','brew-paper-step');item.style.setProperty('--step-delay',`${sequence.children.length*700+200}ms`);
   const picture=el('img');picture.src=art;picture.alt='';picture.width=48;picture.height=48;
   const copy=el('div');copy.append(el('small','',label),el('p','',value));if(detail)copy.append(el('span','brew-paper-detail',detail));
   item.append(picture,copy);sequence.append(item);return copy;
  }
  const flavorArt={floral:'jasmine',fruity:'peach',citrus:'orange',sweet:'honey',nutty:'hazelnut',spiced:'cinnamon'};
  const taste=[D.moods[cup.mood],L.flavor[cup.flavor],D.notes[cup.note]?.name].filter(Boolean).join(' · ');
  if(taste)step('Your inspiration',taste,`assets/flavors/${flavorArt[cup.flavor]||'honey'}.svg`);
  if(cup.bean){const bean=D[cup.bean.kind][cup.bean.id];step('Start with your beans',bean.name,'assets/mood-bean.svg','Bean inspiration'+(!cup.roast&&bean.roast?' · '+bean.roast:''));}
  if(cup.roast)step('Your roast',L.roast[cup.roast],'assets/flavors/dark-chocolate.svg');
  if(cup.brew)step('Choose your brewer',L.brew[cup.brew],'assets/watercolor-brew.webp');
  if(cup.grind){const g=cup.grind;step('Set your grind',g.to+' · '+g.value,'assets/equipment-guides/grinder.webp',(g.mode==='convert'?'Approximate conversion · ':'Starting point · ')+g.kind+' · '+g.source);}
  if(cup.recipe){
   const r=D.recipes[cup.recipe],copy=step('Follow your recipe',r.name,'assets/flavors/black-tea.svg',r.author);
   copy.parentElement.classList.add('paper-recipe');
   const instructions=el('div','paper-recipe-instructions');
   const specs=el('dl','paper-recipe-specs');
   const labels=r.specLabels||['Coffee dose','Water amount','Ratio','Water temperature','Recipe grind','Target time'];
   r.specs.forEach((value,i)=>{const pair=el('div');pair.append(el('dt','',labels[i]),el('dd','',value));specs.append(pair);});
   const steps=el('ol','paper-recipe-steps');
   r.steps.forEach((value,i)=>{const split=value.indexOf('|'),line=el('li'),time=el(r.stepSources?.[i]?'a':'strong','',value.slice(0,split));if(r.stepSources?.[i]){time.href=r.stepSources[i];time.target='_blank';time.rel='noopener noreferrer';time.setAttribute('aria-label','Watch '+value.slice(0,split)+' step in the source video');}line.append(time,el('span','',value.slice(split+1)));steps.append(line);});
   instructions.append(specs,steps);if(r.note)instructions.append(el('p','brew-paper-detail',r.note));
   if(r.specs.some(value=>/per guide|per coffee|official card/i.test(value)))instructions.append(el('p','brew-paper-detail','This recipe uses a coffee-specific guide. Follow the brewer’s current card for the remaining measurements.'));
   const source=el('a','text-link','Brewer’s recipe source ↗');source.href=r.source;source.target='_blank';source.rel='noopener noreferrer';instructions.append(source);
   copy.parentElement.append(instructions);
  }
  body.append(sequence);
  const actions=el('div','brew-paper-actions');actions.append(el('p','','Want to adjust your cup?'));
  const fix=el('a','button primary','Fix my cup ↗');fix.href=href('dial-in.html#taste-picker');actions.append(fix);
  if(cup.recipe){const recipe=el('a','text-link','Open my recipe ↗');recipe.href=href('recipes.html?recipe='+cup.recipe);actions.append(recipe);}
  footer.append(actions);
  close.focus({preventScroll:true});
 }
 function render(){
  dialog.classList.remove('cup-paper','paper-revealed');heading.textContent='Your cup';
  body.replaceChildren();footer.replaceChildren();
  const filled=[state.mood||state.flavor||state.note,state.bean,state.brew,state.roast,state.grind||state.recipe].filter(Boolean).length;
  opener.dataset.fill=String(filled);
  icon.style.setProperty('--coffee-rise',`${32-filled*6.4}px`);
  const level=filled===0?'empty':filled<3?'a little coffee':filled<5?'filling up':'full';
  opener.setAttribute('aria-label',`Your cup, ${level}. Open saved cup and recipe`);
  opener.title='Your choices fill your cup: taste, beans, method, roast, and a recipe or grind.';

  const populated=Object.keys(state).length>1;
  if(!populated)body.append(el('p','cup-empty','A little space for your next cup.'));
  const groups={};for(const name of ['Taste','Coffee','Brew']){const g=el('section','cup-group');g.append(el('h3','',name));groups[name]=g;}
  if(state.mood)row(groups.Taste,'Mood',D.moods[state.mood],'mood','index.html#finder');
  if(state.flavor)row(groups.Taste,'Flavor',L.flavor[state.flavor],'flavor','index.html#finder');
  if(state.note)row(groups.Taste,'Desired note',D.notes[state.note].name,'note','index.html#finder');
  if(state.bean){const b=D[state.bean.kind][state.bean.id];row(groups.Coffee,'Bean inspiration',b.name+(b.roast?' · '+b.roast:''),'bean',state.bean.kind==='beans'?'beans.html#'+state.bean.id:'index.html?profile='+state.bean.id+'#finder');}
  if(state.brew)row(groups.Brew,'Brew method',L.brew[state.brew],'brew','grinder.html#converter');
  if(state.roast)row(groups.Brew,'Roast',L.roast[state.roast],'roast','grinder.html#converter');
  if(state.recipe){const r=D.recipes[state.recipe];row(groups.Brew,'Recipe',r.name+' · '+r.author,'recipe','recipes.html?recipe='+state.recipe);}
  if(state.grind){const g=state.grind;row(groups.Brew,'Grinder',g.to+' · '+g.value+' · '+(g.mode==='convert'?'Approximate conversion · ':'')+g.kind+' · '+g.source,'grind','grinder.html#converter');}
  if(state.recipe){const a=el('a','button','Open my recipe ↗');a.href=href('recipes.html?recipe='+state.recipe);groups.Brew.append(a);}
  Object.values(groups).filter(g=>g.children.length>1).forEach(g=>body.append(g));
  if(message)body.append(el('p','cup-notice',message));
  let next=!state.flavor?['Find your flavor','index.html#finder']:!state.bean?['Explore bean inspiration','beans.html#bean-list']:!state.brew?['Choose a brew method','brewing.html#brewing-methods']:!state.grind?['Find a starting grind','grinder.html#converter']:state.brew==='pourover'&&!state.recipe?['Explore a recipe','recipes.html']:['Brew, then adjust by taste','dial-in.html'];
  const n=el('div','cup-next');n.append(el('small','','NEXT LITTLE STEP'));const a=el('a','button primary',next[0]+' ↗');a.href=href(next[1]);n.append(a);footer.append(n);
  if(next[1]==='dial-in.html'){
   const brew=button('Brew, then adjust by taste',showBrewPaper);brew.className='button primary';a.replaceWith(brew);
  }
  footer.append(el('small','',persistent?'Saved on this browser':'Kept for this page; browser storage is unavailable'));
  if(populated)footer.append(button('Start fresh',()=>{
   undo={state:clone(state),query:location.search};state={version:1};message='A fresh start. Your previous cup is here if you need it.';persist();CoffeeContext.clear();render();emit();close.focus();
  }));
  if(undo)footer.append(button('Undo start fresh',()=>{state=clean(undo.state);history.replaceState(null,'',location.pathname+undo.query+location.hash);undo=null;message='Your previous cup is back.';persist();CoffeeContext.update(context());render();emit();document.dispatchEvent(new Event('coffee-cup-restored'));close.focus();}));
 }
 window.addEventListener('storage',e=>{if(e.key!==KEY)return;try{state=clean(JSON.parse(e.newValue));}catch{state={version:1};}render();emit();});
 // The method cards represent an explicit choice, unlike simply opening a URL.
 document.querySelectorAll('.brewing-page .guide-card').forEach(card=>{
  if(!own(L.brew,card.id))return;
  const b=button('Use this method',()=>{commit({brew:card.id});CoffeeContext.update({brew:card.id});});b.className='button';card.append(b);
 });
 // Invite attention once when a save action enters view, including dynamic results.
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 if('IntersectionObserver' in window){
  const watched=new WeakSet();
  const invite=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   if(!reducedMotion.matches)entry.target.classList.add('cup-save-invite');
   invite.unobserve(entry.target);
  }),{threshold:.65});
  const buttonsIn=node=>node.nodeType===1?[...(node.matches('.cup-save')?[node]:[]),...node.querySelectorAll('.cup-save')]:[];
  const watch=node=>buttonsIn(node).forEach(b=>{if(!watched.has(b)){watched.add(b);invite.observe(b);}});
  watch(document.querySelector('main'));
  new MutationObserver(records=>records.forEach(record=>{
   record.removedNodes.forEach(node=>buttonsIn(node).forEach(b=>invite.unobserve(b)));
   record.addedNodes.forEach(watch);
  })).observe(document.querySelector('main'),{childList:true,subtree:true});
 }
 render();emit();
})();
