(() => {
  const rows=[
  [
    "Sour, sharp, thin",
    "Under-extraction",
    "Grind finer",
    "Use hotter water or brew longer"
  ],
  [
    "Bitter, dry, harsh",
    "Over-extraction",
    "Grind coarser",
    "Use cooler water or brew shorter"
  ],
  [
    "Weak, watery",
    "Low dose or coarse grind",
    "Use more coffee",
    "Grind finer"
  ],
  [
    "Muddy, heavy, silty",
    "Too many fines or clogged filter",
    "Use a cleaner filter",
    "Grind coarser"
  ],
  [
    "Flat, dull",
    "Old beans or low extraction",
    "Use fresher beans",
    "Grind slightly finer"
  ]
];
  const picker=document.getElementById('problem-options'),result=document.getElementById('problem-result');
  rows.forEach(([name],i)=>{const button=document.createElement('button');button.type='button';button.textContent=name;button.dataset.problem=i;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>render(i));picker.append(button);});
  function render(i){
    const [problem,cause,first,second]=rows[i];
    picker.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.problem)===i)));
    result.innerHTML=`<p class="eyebrow">YOUR FIRST ADJUSTMENT</p><h3>${first}</h3><p><strong>${problem}</strong> can be associated with ${cause.toLowerCase()}. Change one thing, brew again, and compare the taste.</p><details><summary>If it still needs a little work</summary><p>${second}. Keep your other variables steady so you can tell what helped.</p></details><div class="next-actions"><a class="button" href="${CoffeeContext.link('grinder.html')}">Check my grinder ↗</a><a class="button" href="${CoffeeContext.link('water.html')}">Explore water guidance ↗</a></div>`;
  }
  document.addEventListener('coffee-context-clear',()=>render(0));render(0);
})();
