(() => {
  const key='coffee-master-theme', root=document.documentElement;
  let saved;try{saved=localStorage.getItem(key);}catch{}
  function apply(theme){
    root.dataset.theme=theme;root.style.colorScheme=theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#222820':'#faf7f0');
    document.querySelectorAll('.theme-toggle').forEach(button=>{
      const dark=theme==='dark';button.setAttribute('aria-checked',String(dark));button.setAttribute('aria-label',dark?'Disable dark mode':'Enable dark mode');
      const icon=button.querySelector('span');if(icon)icon.textContent=dark?'☼':'☾';
    });
  }
  apply(saved==='dark'?'dark':'light');
  document.addEventListener('DOMContentLoaded',()=>{
    apply(root.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(button=>button.addEventListener('click',()=>{
      const next=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,next);}catch{}apply(next);
    }));
  });
  window.addEventListener('storage',event=>{if(event.key===key)apply(event.newValue==='dark'?'dark':'light');});
})();
