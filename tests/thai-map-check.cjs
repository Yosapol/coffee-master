const {chromium}=require('playwright');const assert=require('node:assert/strict');
const regions=['chiang-rai','chiang-mai','nan','mae-hong-son','chumphon','ranong'];
(async()=>{const browser=await chromium.launch();try{
 const p=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'});await p.addInitScript(()=>{window.WebSocket=class{}});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'thai-coffee.html?roast=light#coffee-nan'));
 assert.equal(await p.locator('#region-content h3').innerText(),'Nan');
 const regionalImages=new Set();
 for(const id of regions){await p.locator(`.map-marker[data-region="${id}"]`).click();assert.equal(await p.locator(`#coffee-${id}`).getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#thai-coffee-map [aria-pressed=true]').count(),2);assert(p.url().endsWith('#coffee-'+id));assert(p.url().includes('roast=light'));const img=p.locator('#region-content img');assert.equal(await img.getAttribute('src'),`assets/thai-coffee/${id}.webp`);await img.evaluate(i=>i.decode());regionalImages.add(await img.getAttribute('src'));}
 assert.equal(regionalImages.size,6,'Every regional story has a unique illustration');
 const guideImages=await p.locator('.two-column-knowledge .guide-card-picture img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
 assert.equal(new Set(guideImages).size,4,'Four unique guide illustrations');
 assert(guideImages.every(src=>src.startsWith('assets/thai-coffee/')),'No reused guide pictures');
 await p.goBack();assert.equal(await p.locator('#region-content h3').innerText(),'Chumphon');
 await p.reload();assert.equal(await p.locator('#region-content h3').innerText(),'Chumphon');
 await p.locator('#coffee-chiang-mai').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#region-content h3').innerText(),'Chiang Mai');
 for(const name of ['equipment','thai-coffee'])for(const theme of ['light','dark']){
  await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'')+name+'.html');await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
  for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+'/'+width);}
  await p.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
  await p.screenshot({path:`tests/screenshots/illustrated-${name}-${theme}.png`,fullPage:true});
  if(name==='thai-coffee'){
   await p.setViewportSize({width:320,height:844});
   for(const id of regions){await p.locator(`.map-marker[data-region="${id}"]`).tap();assert.equal(await p.locator(`#coffee-${id}`).getAttribute('aria-pressed'),'true');}
   const boxes=await p.locator('.map-marker').evaluateAll(bs=>bs.map(b=>{const r=b.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
   for(const box of boxes)assert(box.w>=44&&box.h>=44);
   for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'No overlapping marker targets');}
   await p.setViewportSize({width:390,height:844});await p.locator('#thai-coffee-map').screenshot({path:`tests/screenshots/thai-map-${theme}-mobile.png`});
  }
 }
 await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'thai-coffee.html#coffee-invalid'));assert.equal(await p.locator('#region-content h3').innerText(),'Chiang Rai');
 assert.deepEqual(errors,[]);console.log('PASS: six regions, deep links, Back/reload, keyboard/touch, non-overlapping 44px markers, both pages at four widths and two themes, images and runtime.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
