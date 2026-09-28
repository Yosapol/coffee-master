(() => {
  'use strict';
  const notes=window.CoffeeFlavors, $=id=>document.getElementById(id);
  const names={floral:'Floral',fruity:'Fruity',citrus:'Citrus',sweet:'Sweet',nutty:'Nutty & cocoa',spiced:'Spiced'};
  const colors={floral:'#d9cce4',fruity:'#e8b9b3',citrus:'#eedba1',sweet:'#d9dfba',nutty:'#ddc4a9',spiced:'#c5d5c7'};
  let activeFamily=document.querySelector('.wheel-segment[aria-pressed="true"]').dataset.family;
  let selectedId=window.CoffeeCup?.get().note||null,shown='',showAll=false,restoreTimer;
  if(!notes.some(n=>n.id===selectedId&&n.family===activeFamily))selectedId=null;
  const busy=()=>$('flavor-wheel').getAttribute('aria-busy')==='true';
  const point=(r,a)=>[250+r*Math.cos(a*Math.PI/180),250+r*Math.sin(a*Math.PI/180)];
  const arc=(a,b)=>`M${point(238,a)} A238 238 0 0 1 ${point(238,b)} L${point(144,b)} A144 144 0 0 0 ${point(144,a)} Z`;
  function drawRing(){
    $('flavor-notes-ring').innerHTML=notes.filter(n=>n.family===activeFamily).map((n,i)=>{
      const a=-90+i*36,mid=a+18,[x,y]=point(180,mid),[tx,ty]=point(219,mid);
      let rotation=mid+90;if(rotation>90&&rotation<270)rotation+=180;
      return `<g class="flavor-note" role="button" tabindex="0" data-note="${n.id}" aria-label="${n.name}, ${names[n.family]} tasting note" aria-pressed="${selectedId===n.id}"><path d="${arc(a+.4,a+35.6)}" fill="${colors[n.family]}"/><image href="${n.image}" x="${x-27}" y="${y-27}" width="54" height="54" aria-hidden="true"/><text x="${tx}" y="${ty}" transform="rotate(${rotation} ${tx} ${ty})" aria-hidden="true">${n.name}</text></g>`;
    }).join('');
    $('flavor-wheel').setAttribute('aria-label',`Coffee flavor wheel. Six families inside; ten ${names[activeFamily].toLowerCase()} notes outside. Arrow keys move between notes.`);
  }
  function drawGallery(){
    const query=$('flavor-search').value.trim().toLowerCase();
    const visible=notes.filter(n=>(query||showAll||n.family===activeFamily)&&(!query||`${n.name} ${n.description} ${n.character} ${names[n.family]}`.toLowerCase().includes(query)));
    $('flavor-gallery').innerHTML=visible.map(n=>`<button type="button" class="flavor-tile" data-note="${n.id}" aria-pressed="${selectedId===n.id}" aria-label="${n.name}, ${names[n.family]}"><img src="${n.image}" width="64" height="64" alt="" loading="lazy"><span>${n.name}</span></button>`).join('');
    $('flavor-count').textContent=`${visible.length} of 60 notes`;
    $('flavor-empty').hidden=visible.length!==0;
    $('flavor-show-all').textContent=showAll?'This family':'Show all 60';
    $('flavor-show-all').setAttribute('aria-pressed',String(showAll));
  }
  function highlight(id){
    document.querySelectorAll('[data-note]').forEach(el=>el.classList.toggle('is-preview',el.dataset.note===id));
    $('flavor-wheel').classList.toggle('has-note-preview',!!id&&notes.find(n=>n.id===id)?.family===activeFamily);
  }
  function reveal(html,key){
    if(shown===key)return;
    shown=key;
    $('flavor-detail').innerHTML=html;
    $('flavor-detail').classList.remove('flavor-reveal');
    void $('flavor-detail').offsetWidth;
    $('flavor-detail').classList.add('flavor-reveal');
  }
  const noticing={
    floral:'Before sipping, notice the fragrance. Does it bring flowers or tea to mind?',
    fruity:'Think of a familiar fruit as you sip. A broad berry or orchard-fruit impression is enough.',
    citrus:'Notice citrus-like aroma alongside the tart taste. You may sense a family before a particular fruit.',
    sweet:'Notice the sweet-smelling aroma. Honey or caramel notes need not mean a sugary taste.',
    nutty:'Look for a toasted-nut or cocoa impression as you sip, then notice what lingers.',
    spiced:'Notice the aroma before and after a sip. Does it recall a familiar spice or dried wood?'
  };
  function previewNote(id){
    if(busy())return;clearTimeout(restoreTimer);
    const n=notes.find(n=>n.id===id);if(!n)return;
    highlight(id);
    reveal(`<div class="flavor-detail-top"><p class="eyebrow">${names[n.family]} / ${selectedId===id?'YOUR SELECTED NOTE':'FLAVOR CLOSE-UP'}</p><span class="flavor-preview-label">${selectedId===id?'Selected':'Preview'}</span></div><div class="flavor-detail-body"><div class="flavor-picture" style="--note-wash:${colors[n.family]}"><img src="${n.image}" width="160" height="160" alt="Illustration of ${n.name.toLowerCase()}"></div><div><h3 id="flavor-detail-title">${n.name}</h3><p class="flavor-character">${n.character}</p><p class="flavor-description">${n.description}</p></div></div><details class="noticing-tip"><summary>How to notice it</summary><p>${noticing[n.family]}</p><a class="text-link" href="knowledge.html#taste-your-cup">Try a tasting moment ↗</a></details><div class="flavor-detail-actions"><button type="button" class="button primary" data-pick-note="${id}">${selectedId===id?'Selected flavor ✓':'Choose this flavor ↗'}</button><a href="#flavor-browse-heading" class="text-link">Browse the pictures</a></div><p class="flavor-footnote">A tasting comparison, not an added ingredient. Each coffee is different.</p>`,`${id}:${selectedId===id}`);
  }
  function previewFamily(id){
    if(busy())return;clearTimeout(restoreTimer);highlight(null);
    const familyNotes=notes.filter(n=>n.family===id);
    reveal(`<p class="eyebrow">TEN NOTES TO EXPLORE</p><div class="family-picture-row">${familyNotes.slice(0,3).map(n=>`<img src="${n.image}" width="80" height="80" alt="${n.name}">`).join('')}</div><h3 id="flavor-detail-title">${names[id]}</h3><p class="flavor-description">Explore ${familyNotes.slice(0,3).map(n=>n.name.toLowerCase()).join(', ')}, and seven more tasting notes in this family.</p><button type="button" class="button primary" data-pick-family="${id}">Explore ${names[id].toLowerCase()} ↗</button><p class="flavor-footnote">Choose a family to see its ten illustrated notes around the wheel.</p>`,`family:${id}`);
  }
  function restore(){previewNote(selectedId||notes.find(n=>n.family===activeFamily).id);highlight(null);}
  function select(id){
    if(busy())return;
    document.dispatchEvent(new CustomEvent('coffee-note-select',{detail:id}));
    if(matchMedia('(max-width:640px)').matches)$('flavor-detail').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  }
  [$('flavor-wheel'),$('flavor-key'),$('flavor-gallery')].forEach(region=>{
    const preview=event=>{const el=event.target.closest('[data-note],[data-family]');if(!el)return;el.dataset.note?previewNote(el.dataset.note):previewFamily(el.dataset.family);};
    region.addEventListener('pointerover',event=>{if(event.pointerType!=='touch')preview(event);});
    region.addEventListener('focusin',preview);
    region.addEventListener('pointerleave',()=>{restoreTimer=setTimeout(restore,180);});
    region.addEventListener('focusout',event=>{if(!region.contains(event.relatedTarget)&&!$('flavor-detail').contains(event.relatedTarget))restoreTimer=setTimeout(restore,180);});
    region.addEventListener('click',event=>{const el=event.target.closest('[data-note]');if(el){select(el.dataset.note);if(event.detail===0)document.querySelector(`.flavor-tile[data-note="${el.dataset.note}"]`)?.focus({preventScroll:true});}});
  });
  $('flavor-notes-ring').addEventListener('keydown',event=>{
    const el=event.target.closest('[data-note]');if(!el)return;
    if(event.key==='Enter'||event.key===' '){event.preventDefault();select(el.dataset.note);}
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)){
      event.preventDefault();const items=[...$('flavor-notes-ring').children],index=items.indexOf(el);
      const next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+items.length)%items.length;
      items[next].focus();
    }
  });
  $('flavor-detail').addEventListener('pointerenter',()=>clearTimeout(restoreTimer));
  $('flavor-detail').addEventListener('focusin',()=>clearTimeout(restoreTimer));
  $('flavor-detail').addEventListener('pointerleave',()=>{restoreTimer=setTimeout(restore,180);});
  $('flavor-detail').addEventListener('click',event=>{
    const note=event.target.closest('[data-pick-note]'),family=event.target.closest('[data-pick-family]');
    if(note){const id=note.dataset.pickNote;select(id);$('flavor-detail').querySelector('[data-pick-note]')?.focus({preventScroll:true});}
    if(family){document.querySelector(`.wheel-segment[data-family="${family.dataset.pickFamily}"]`).dispatchEvent(new MouseEvent('click',{bubbles:true}));$('flavor-notes-ring').firstElementChild?.focus({preventScroll:true});}
  });
  $('flavor-search').addEventListener('input',drawGallery);
  $('flavor-show-all').addEventListener('click',()=>{showAll=!showAll;$('flavor-search').value='';drawGallery();});
  $('flavor-search-reset').addEventListener('click',()=>{$('flavor-search').value='';drawGallery();$('flavor-search').focus();});
  document.addEventListener('coffee-family-change',event=>{
    const changed=activeFamily!==event.detail.family;activeFamily=event.detail.family;selectedId=event.detail.note||null;
    if(changed){$('flavor-search').value='';showAll=false;drawRing();}
    drawGallery();
    document.querySelectorAll('.flavor-note').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.note===selectedId)));
    shown='';restore();
  });
  drawRing();drawGallery();restore();
})();
