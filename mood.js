(() => {
  'use strict';
  const families = [
    {id:'floral',name:'Floral',color:'#d9cce4',notes:['Jasmine','Rose','Tea'],feel:'delicate floral aromas and a light, tea-like finish',beans:[{name:'A quiet bloom',origin:'Try a washed Ethiopian coffee',roast:'Light roast',notes:['Jasmine','Bergamot','Tea'],tip:'Look for a light roast with jasmine or tea notes. A washed Ethiopian lot is one place to start.'},{name:'Petal & honey',origin:'Try a floral Colombian coffee',roast:'Light roast',notes:['Orange blossom','Honey','Tea'],tip:'Look for a Colombian lot explicitly described as floral, with orange blossom or tea notes.'}]},
    {id:'fruity',name:'Fruity',color:'#e8b9b3',notes:['Berry','Cherry','Peach'],feel:'juicy fruit notes with a playful, expressive character',beans:[{name:'A berry little adventure',origin:'Try a natural Ethiopian coffee',roast:'Light–medium roast',notes:['Berry','Cherry','Cocoa'],tip:'Look for berry or cherry on the label. A naturally processed Ethiopian coffee can be a starting point.'},{name:'Peach daydream',origin:'Try a fruit-forward Costa Rican coffee',roast:'Light–medium roast',notes:['Peach','Apricot','Honey'],tip:'Choose a Costa Rican lot with peach or apricot notes; match the bag’s description rather than origin alone.'}]},
    {id:'citrus',name:'Citrus',color:'#eedba1',notes:['Orange','Lemon','Grapefruit'],feel:'bright citrus notes that feel crisp and lively on the palate',beans:[{name:'A pocket of sunshine',origin:'Try a washed Kenyan coffee',roast:'Light roast',notes:['Grapefruit','Orange','Blackcurrant'],tip:'Look for grapefruit or orange notes and a bright acidity description. A washed Kenyan lot is a place to start.'},{name:'Hello, bright side',origin:'Try a citrus-led Rwandan coffee',roast:'Light–medium roast',notes:['Lemon','Orange','Honey'],tip:'Look for lemon or orange notes on a washed Rwandan coffee; check the roaster’s own tasting description.'}]},
    {id:'sweet',name:'Sweet',color:'#d9dfba',notes:['Honey','Caramel','Toffee'],feel:'rounded caramel sweetness and familiar, easygoing flavors',beans:[{name:'A sweet little rhythm',origin:'Try a balanced Colombian coffee',roast:'Medium roast',notes:['Caramel','Honey','Apple'],tip:'Look for caramel or honey notes and a balanced profile. A medium-roast Colombian lot is a useful starting point.'},{name:'Golden afternoon',origin:'Try a honey-processed Costa Rican coffee',roast:'Medium roast',notes:['Toffee','Brown sugar','Pear'],tip:'Choose a bag listing toffee or brown sugar. Honey processing is a coffee process, not added honey.'}]},
    {id:'nutty',name:'Nutty & cocoa',color:'#ddc4a9',notes:['Almond','Cocoa','Hazelnut'],feel:'familiar cocoa and toasted-nut notes with a comforting, rounded character',beans:[{name:'A hug in a mug',origin:'Try a chocolate-led Brazilian coffee',roast:'Medium roast',notes:['Milk chocolate','Hazelnut','Caramel'],tip:'Look for chocolate and hazelnut notes. A medium-roast Brazilian coffee is a useful starting point.'},{name:'Home, sweet home',origin:'Try a chocolate-led northern Thai coffee',roast:'Medium roast',notes:['Cocoa','Almond','Brown sugar'],tip:'Look for a northern Thai lot with cocoa or almond notes, and let the roaster’s description guide you.'}]},
    {id:'spiced',name:'Spiced',color:'#c5d5c7',notes:['Clove','Cinnamon','Cedar'],feel:'warming spice notes and a deeper, earthy character',beans:[{name:'Take the scenic route',origin:'Try a spice-led Sumatran coffee',roast:'Medium–dark roast',notes:['Cedar','Clove','Dark cocoa'],tip:'Look for cedar, spice, or earthy notes. A Sumatran lot can be a starting point; avoid assuming every lot tastes alike.'},{name:'A little fireside',origin:'Try a spiced Guatemalan coffee',roast:'Medium roast',notes:['Cinnamon','Cocoa','Brown sugar'],tip:'Choose a Guatemalan coffee whose label specifically lists cinnamon or spice alongside cocoa.'}]}
  ];
  const moods = [
    {id:'cozy',name:'Cozy',caption:'A little comfort',icon:'♡',family:'nutty',color:'#ecebdc',reason:'For your cozy moment, we chose familiar cocoa and toasted-nut flavors: a little reminder of chocolate and warm baked treats.'},
    {id:'calm',name:'Calm',caption:'Slow things down',icon:'☁',family:'floral',color:'#e9e5ef',reason:'For your calm moment, we chose delicate floral notes and a tea-like finish: an invitation to pause and notice the small details.'},
    {id:'bright',name:'Bright',caption:'Hello, sunshine',icon:'☼',family:'citrus',color:'#f4ecd3',reason:'For your bright mood, we chose lively citrus notes: their crisp, sparkling character echoes the sunshine you’re feeling.'},
    {id:'curious',name:'Curious',caption:'Something new',icon:'✧',family:'fruity',color:'#f2e2dc',reason:'For your curious mood, we chose expressive fruit notes: a chance to explore how a coffee can remind you of berries or stone fruit.'},
    {id:'focused',name:'Focused',caption:'Find your rhythm',icon:'◎',family:'sweet',color:'#e8ecde',reason:'For your focused moment, we chose rounded caramel sweetness: an easygoing, familiar flavor companion while you settle into your rhythm.'},
    {id:'bold',name:'Bold',caption:'Go your own way',icon:'ϟ',family:'spiced',color:'#e3ebe4',reason:'For your bold mood, we chose distinctive spice and earthy notes: a deeper flavor direction with something a little unexpected.'}
  ];
  let mood = moods[0], family = families.find(f => f.id === mood.family), beanIndex = 0, random = false, busy = false, selectedNote = null;
  const carried = CoffeeContext.get();
  if(carried.flavor){family=families.find(f=>f.id===carried.flavor);mood=null;}
  const savedCup=CoffeeCup.get(), params=new URLSearchParams(location.search);
  if((savedCup.mood||savedCup.flavor)&&(!params.has('flavor')||params.has('cupEdit'))){
    if(savedCup.flavor)family=families.find(f=>f.id===savedCup.flavor);
    mood=moods.find(m=>m.id===savedCup.mood)||null;
    selectedNote=window.CoffeeFlavors.find(n=>n.id===savedCup.note)||null;
  }
  const profile=params.get('profile');
  if(Object.hasOwn(CupData.recommendations,profile)){family=families.find(f=>f.id===CupData.recommendations[profile].family);beanIndex=CupData.recommendations[profile].index;}
  const $ = id => document.getElementById(id);
  const point = (r,a) => [250+r*Math.cos(a*Math.PI/180),250+r*Math.sin(a*Math.PI/180)];
  const arc = (r1,r2,a,b) => {const p=point(r2,a),q=point(r2,b),s=point(r1,b),t=point(r1,a);return `M${p} A${r2},${r2} 0 0 1 ${q} L${s} A${r1},${r1} 0 0 0 ${t} Z`;};
  const label = (text,r,a,cls='') => {const [x,y]=point(r,a);let rotation=a;if(a>90&&a<270)rotation+=180;return `<text class="${cls}" x="${x}" y="${y}" transform="rotate(${rotation} ${x} ${y})">${text}</text>`;};
  $('moods').innerHTML = moods.map(m=>`<button class="mood-button" type="button" data-mood="${m.id}" style="--mood-color:${m.color}" aria-pressed="false"><span class="mood-icon" aria-hidden="true">${m.icon}</span><strong>${m.name}</strong><small>${m.caption}</small></button>`).join('');
  $('flavor-wheel').innerHTML = families.map((f,i)=>{const start=-90+i*60,end=start+60,mid=start+30;return `<g class="wheel-segment" role="button" tabindex="0" data-family="${f.id}" aria-label="${f.name} family: explore ten notes" aria-pressed="false"><path class="family-path" d="${arc(76,140,start,end)}" fill="${f.color}"/>${label(f.id === 'nutty' ? 'Nutty' : f.name,108,mid,'family-label')}</g>`;}).join('')+'<g id="flavor-notes-ring"></g>';
  $('flavor-key').innerHTML = families.map(f=>`<button type="button" data-family="${f.id}" aria-pressed="false" style="--flavor-color:${f.color}"><i aria-hidden="true"></i>${f.name}</button>`).join('');
  function render(){
    document.querySelectorAll('[data-mood]').forEach(el=>el.setAttribute('aria-pressed',String(!random&&mood?.id===el.dataset.mood)));
    document.querySelectorAll('[data-family]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.family===family.id)));
    const bean=family.beans[beanIndex];
    let why = random ? `A little chance led you to ${family.name.toLowerCase()}. This bean profile offers ${family.feel} — a new direction to explore, with no mood decision needed.` : !mood ? `You chose ${family.name.toLowerCase()}. This bean profile offers ${family.feel}. Follow the tasting notes that sound delicious to you.` : mood.family===family.id ? mood.reason : `You’re feeling ${mood.name.toLowerCase()}, and you chose ${family.name.toLowerCase()}. We followed your taste: this profile offers ${family.feel}. Your flavor preference leads this pairing.`;
    $('result-context').textContent=random?'A little serendipity, ready to brew.':mood?`${mood.name} mood · ${family.name.toLowerCase()} flavors`:`Your choice · ${family.name.toLowerCase()} flavors`;
    if(selectedNote){$('result-context').textContent+=` · ${selectedNote.name}`;why+=` You picked ${selectedNote.name.toLowerCase()}; look for that note on the bag. This is a broader ${family.name.toLowerCase()} pairing, not a promise that this profile contains that exact note.`;}
    $('coffee-result').innerHTML=`<p class="result-eyebrow">${random?'YOUR SURPRISE CUP':'YOUR CUP FOR THIS MOMENT'}</p><h4>${bean.name}</h4><p class="origin">${bean.origin}</p><div class="note-tags">${bean.notes.map(n=>`<span>${n}</span>`).join('')}</div><strong class="why-title">${random?'Why this is worth a sip':'Why it fits your moment'}</strong><p class="reason">${why}</p><div class="buying-tip"><strong>Your bean-finding clue</strong><br>${bean.tip}</div><div class="result-bottom"><span>${bean.roast}</span><button type="button" id="another" class="another">Another in this flavor ↻</button></div>`;
    const roastKey={'Light roast':'light','Medium roast':'medium','Dark roast':'dark','Light–medium roast':'light-medium','Medium–dark roast':'medium-dark'}[bean.roast];
    const next={flavor:family.id,roast:roastKey};

    $('coffee-result').insertAdjacentHTML('beforeend',`<div class="next-actions"><a class="button" href="${CoffeeContext.link('beans.html',next)}#bean-list">Explore related beans ↗</a><a class="button" href="${CoffeeContext.link('grinder.html',next)}#converter">Find a starting grind ↗</a></div>`);
    const save=document.createElement('button');save.type='button';save.className='button cup-save';save.textContent='Use for my cup';
    save.addEventListener('click',()=>CoffeeCup.saveBean('recommendations',family.id+'-'+beanIndex));$('coffee-result').append(save);
    $('coffee-result').classList.remove('result-pop');
    void $('coffee-result').offsetWidth;
    $('coffee-result').classList.add('result-pop');
    $('another').addEventListener('click',()=>{if(busy)return;beanIndex=(beanIndex+1)%family.beans.length;render();$('another').focus({preventScroll:true});});
    document.dispatchEvent(new CustomEvent('coffee-family-change',{detail:{family:family.id,note:selectedNote?.id}}));
  }
  $('moods').addEventListener('click',event=>{const button=event.target.closest('[data-mood]');if(!button||busy)return;selectedNote=null;mood=moods.find(m=>m.id===button.dataset.mood);family=families.find(f=>f.id===mood.family);beanIndex=0;random=false;CoffeeCup.choose({mood:mood.id,flavor:family.id,note:null});render();});
  function chooseFamily(id,note=null){if(busy)return;selectedNote=note;family=families.find(f=>f.id===id);beanIndex=0;random=false;CoffeeCup.choose({flavor:id,note:note?.id||null});render();}
  document.addEventListener('coffee-note-select',event=>{const note=window.CoffeeFlavors.find(n=>n.id===event.detail);if(note)chooseFamily(note.family,note);});
  [$('flavor-wheel'),$('flavor-key')].forEach(el=>el.addEventListener('click',event=>{const target=event.target.closest('[data-family]');if(target)chooseFamily(target.dataset.family);}));
  $('flavor-wheel').addEventListener('keydown',event=>{const target=event.target.closest('[data-family]');if(!target)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseFamily(target.dataset.family);}if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)){event.preventDefault();const items=[...$('flavor-wheel').querySelectorAll('[data-family]')];const delta=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;items[(items.indexOf(target)+delta+items.length)%items.length].focus();}});
  $('wheel-surprise').addEventListener('click', () => $('surprise').click());
  $('surprise').addEventListener('click',()=>{
    if(busy)return;
    busy=true;
    selectedNote=null;
    const candidates=families.flatMap(f=>f.beans.map((_,i)=>({family:f,index:i}))).filter(c=>c.family.id!==family.id||c.index!==beanIndex);
    const selected=candidates[Math.floor(Math.random()*candidates.length)];
    $('surprise').disabled=true;$('surprise').innerHTML='<span aria-hidden="true">✧</span> Finding your little surprise…';
    document.querySelectorAll('.mood-button, .flavor-key button, #another, #wheel-surprise').forEach(el=>el.disabled=true);
    $('flavor-wheel').setAttribute('aria-busy','true');
    document.querySelectorAll('.wheel-segment').forEach(el=>el.setAttribute('aria-disabled','true'));
    $('flavor-wheel').classList.add('spinning');$('finder').classList.add('is-busy');
    setTimeout(()=>{family=selected.family;beanIndex=selected.index;random=true;mood=null;busy=false;CoffeeCup.choose({mood:null,flavor:family.id,note:null});render();$('flavor-wheel').classList.remove('spinning');$('finder').classList.remove('is-busy');$('flavor-wheel').removeAttribute('aria-busy');document.querySelectorAll('.wheel-segment').forEach(el=>el.removeAttribute('aria-disabled'));document.querySelectorAll('.mood-button, .flavor-key button, #wheel-surprise').forEach(el=>el.disabled=false);$('surprise').disabled=false;$('surprise').innerHTML='<span aria-hidden="true">✧</span> Surprise me again <span aria-hidden="true">↗</span>';},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1000);
  });
  document.addEventListener('coffee-context-clear',()=>{selectedNote=null;mood=moods[0];family=families.find(f=>f.id===mood.family);beanIndex=0;random=false;render();});
  document.addEventListener('coffee-cup-restored',()=>{const s=CoffeeCup.get();mood=moods.find(m=>m.id===s.mood)||null;family=families.find(f=>f.id===s.flavor)||families[0];selectedNote=window.CoffeeFlavors.find(n=>n.id===s.note)||null;render();});
  render();
})();
