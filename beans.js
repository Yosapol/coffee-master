(() => {
  const context=CoffeeContext, cards=[...document.querySelectorAll('.bean-card')];
  let taste='all',type='all',flavor=context.get().flavor||'all';
  const flavors={all:'All',...context.labels.flavor};
  const familyArt={all:['origins/all','#deded2'],floral:['flavors/jasmine','#d9cce4'],fruity:['flavors/peach','#e8b9b3'],citrus:['flavors/lemon','#eedba1'],sweet:['flavors/honey','#d9dfba'],nutty:['flavors/hazelnut','#ddc4a9'],spiced:['flavors/cinnamon','#c5d5c7']};
  document.getElementById('bean-flavors').innerHTML=Object.entries(flavors).map(([id,name])=>`<button type="button" data-flavor="${id}" aria-pressed="false" style="--family-color:${familyArt[id][1]}"><span class="family-filter-picture"><img src="assets/${familyArt[id][0]}.svg" width="32" height="32" alt=""></span><span>${name}</span></button>`).join('');
  function render(){
    let count=0;
    cards.forEach(card=>{
      const shown=(taste==='all'||card.dataset.tags.split(' ').includes(taste))&&(type==='all'||card.dataset.type===type)&&(flavor==='all'||card.dataset.flavors.split(' ').includes(flavor));
      card.hidden=!shown;if(shown)count++;
    });
    for(const [selector,attribute,value] of [['.filter-button','filter',taste],['.type-button','typeFilter',type],['[data-flavor]','flavor',flavor]])document.querySelectorAll(selector).forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset[attribute]===value));button.classList.toggle('active',button.dataset[attribute]===value);});
    document.getElementById('bean-count').textContent=`${count} of ${cards.length} beans to explore`;
    document.getElementById('bean-empty').hidden=count!==0;
  }
  document.querySelector('.bean-filter-panel').addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.filter)taste=button.dataset.filter;
    if(button.dataset.typeFilter)type=button.dataset.typeFilter;
    if(button.dataset.flavor){flavor=button.dataset.flavor;context.update({flavor:flavor==='all'?null:flavor});}render();
  });
  function reset(){taste=type=flavor='all';context.update({flavor:null});render();}
  document.getElementById('reset-beans').addEventListener('click',reset);
  document.getElementById('empty-reset').addEventListener('click',()=>{reset();document.getElementById('reset-beans').focus();});
  document.addEventListener('coffee-context-clear',()=>{taste=type=flavor='all';render();document.getElementById('reset-beans').focus();});
  cards.forEach(card=>{
    const b=document.createElement('button');b.type='button';b.className='button cup-save';b.textContent='Use for my cup';
    b.addEventListener('click',()=>CoffeeCup.saveBean('beans',card.id));card.querySelector('.bean-card-body').append(b);
  });
  if(new URLSearchParams(location.search).has('cupEdit')&&location.hash){taste=type=flavor='all';}
  render();
})();
