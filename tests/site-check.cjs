const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const base=((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'');
const pages=['index','grinder','recipes','dial-in','beans','knowledge','brewing','water','equipment','thai-coffee'];
const shots=path.join(__dirname,'screenshots');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'conversion-baseline.json')));
const content=JSON.parse(fs.readFileSync(path.join(__dirname,'content-baseline.json')));
const recipeSource=fs.readFileSync(path.join(__dirname,'../recipes.js'),'utf8').replace(/\r\n/g,'\n').split('const specLabels')[0];
const vm=require('node:vm');
const originalEducators=vm.runInNewContext(JSON.parse(fs.readFileSync(path.join(__dirname,'recipe-original-educators.json'),'utf8'))+'];brewers');
const currentEducators=vm.runInNewContext(recipeSource+';brewers').slice(0,6);
const core=educators=>educators.map(b=>({...b,recipes:b.recipes.map(r=>({name:r.name,specs:r.specs.slice(0,6).map(v=>v.replace(/\u00b0C/g,' C')),steps:r.steps,source:r.source}))}));
assert.equal(JSON.stringify(core(currentEducators)),JSON.stringify(core(originalEducators)),'Original measurements, steps and sources remain unchanged by formatting');
fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.addInitScript(()=>{window.WebSocket=class{};});
  const errors=[],badResponses=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)badResponses.push(r.url());});
  await page.goto(base);
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.locator('.theme-toggle').click();
  await page.goto(base+'grinder.html');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Theme follows navigation');
  await page.locator('.theme-toggle').click();
  assert.equal(await page.locator('#mode-start').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#conversion-fields').isVisible(),false);
  assert.equal(await page.locator('#brew').inputValue(),'','No method guessed');
  await page.locator('#brew').selectOption('pourover');
  assert.match(await page.locator('#toSetting').innerText(),/4-6/);
  assert.match(await page.locator('.source-badge').innerText(),/Community/);
  await page.locator('#f').selectOption('Fellow Ode Gen 2');
  await page.locator('#brew').selectOption('drip');
  assert.match(await page.locator('.source-badge').innerText(),/Manufacturer/);
  await page.locator('#f').selectOption('Fellow Opus');
  await page.locator('#brew').selectOption('espresso');
  assert.match(await page.locator('.source-badge').innerText(),/Inferred/);
  await page.locator('#f').selectOption('Fellow Ode Gen 2');
  assert.equal(await page.locator('#toSetting').count(),0,'Unsupported Ode espresso does not suggest a setting');
  await page.locator('#brew').selectOption('pourover');
  await page.locator('#mode-convert').click();
  for(const record of baseline){
   const actual=await page.evaluate(args=>convertSetting(...args),record.args);
   assert.deepEqual(actual,record.result,'Original conversion formula retained');
   const [from,to,setting,brew,roast]=record.args;
   await page.locator('#f').selectOption(from);await page.locator('#t').selectOption(to);
   await page.locator('#brew').selectOption(brew);await page.locator('#roast').selectOption(roast);
   await page.locator('#s').fill(String(setting));
   assert.equal(await page.locator('#toSetting').innerText(),await page.evaluate(({to,value})=>formatValue(to,value),{to,value:record.result.value}));
  }
  for(const input of ['','9999','-10']){
   await page.locator('#s').fill(input);
   assert.equal(await page.locator('#toSetting').count(),0,'Invalid input clears stale result');
   assert.equal(await page.locator('#s').getAttribute('aria-invalid'),'true');
   assert.ok((await page.locator('#setting-error').innerText()).length>10);
  }
  await page.locator('#s').fill('5.33');assert.equal(await page.locator('#s').getAttribute('aria-invalid'),'false');
  await page.locator('#grinder-references summary').click();await page.locator('#toggleMore').click();
  assert.equal(await page.locator('#tb tr').count(),await page.evaluate(()=>Object.keys(grinders).length));
  // These URL-validation scenarios start with no previously saved cup.
  await page.evaluate(()=>localStorage.removeItem('coffee-master-cup-v1'));
  await page.goto(base+'grinder.html?flavor=fruity&roast=light-medium');
  assert.equal(await page.locator('#roast').inputValue(),'');assert.equal(await page.locator('#brew').inputValue(),'');
  assert.match(await page.locator('#roast-context').innerText(),/light–medium/);
  await page.locator('#brew').selectOption('pourover');assert.equal(await page.locator('#toSetting').count(),0);
  await page.locator('#roast').selectOption('light');assert.equal(await page.locator('#toSetting').count(),1);
  await page.locator('#journey-context button').click();assert.equal(await page.locator('#brew').inputValue(),'');assert.equal(await page.locator('#journey-context').isVisible(),false);
  await page.evaluate(()=>localStorage.removeItem('coffee-master-cup-v1'));
  await page.goto(base+'grinder.html?flavor=__proto__&roast=%3Cscript%3E&brew=unknown');
  assert.equal(await page.locator('#journey-context').isVisible(),false);
  assert.equal(await page.locator('#brew').inputValue(),'');
  await page.goto(base+'index.html');
  await page.locator('[data-mood="curious"]').click();
  const grinderLink=page.locator('#coffee-result a').filter({hasText:'Find a starting grind'});
  assert.match(await grinderLink.getAttribute('href'),/roast=light-medium/);
  assert.equal((await grinderLink.getAttribute('href')).includes('brew='),false);
  await page.locator('#coffee-result a').filter({hasText:'Explore related beans'}).click();
  assert.equal(await page.locator('[data-flavor="fruity"]').getAttribute('aria-pressed'),'true');
  assert.ok(await page.locator('.bean-card:visible').count()>0);
  await page.locator('#reset-beans').click();assert.equal(await page.locator('.bean-card:visible').count(),20);
  assert.deepEqual(await page.locator('.bean-card h2').allTextContents(),content.bean_names);
  await page.locator('[data-type-filter="robusta"]').click();await page.locator('[data-flavor="floral"]').click();
  assert.equal(await page.locator('#bean-empty').isVisible(),true);
  await page.locator('#empty-reset').click();assert.equal(await page.locator('.bean-card:visible').count(),20);
  await page.locator('[data-filter="earthy"]').click();
  assert.equal(await page.locator('.bean-card:visible').evaluateAll(cards=>cards.every(c=>c.dataset.tags.includes('earthy'))),true);
  await page.goto(base+'recipes.html?roast=light&flavor=floral');
  let recipeCount=0;
  for(let i=0;i<7;i++){
   await page.locator(`[data-brewer="${i}"]`).click();
   for(let j=0;j<3;j++){
    await page.locator(`[data-recipe="${j}"]`).click();recipeCount++;
    assert.equal(await page.locator('.recipe-card').count(),1);
    const data=await page.evaluate(({i,j})=>brewers[i].recipes[j],{i,j});
    assert.equal(await page.locator('.recipe-origin').innerText(),data.name);
    assert.deepEqual(await page.locator('.recipe-specs strong').allTextContents(),data.specs);
    assert.equal(await page.locator('.recipe-source').getAttribute('href'),data.source);
    assert.deepEqual(await page.locator('.pour-steps li').evaluateAll(items=>items.map(li=>`${li.querySelector('time').textContent}|${li.querySelector('span').textContent}`)),data.steps);
   }
  }
  assert.equal(recipeCount,21);
  assert.match(await page.locator('.recipe-specs').innerText(),/Water (amount|input)/);assert.match(await page.locator('.recipe-specs').innerText(),/Water temperature/);
  await page.locator('#recipe-grinder-link').click();assert.equal(await page.locator('#brew').inputValue(),'pourover');assert.equal(await page.locator('#roast').inputValue(),'light');
  await page.goto(base+'dial-in.html?brew=pourover&roast=light');
  const expected=['Grind finer','Grind coarser','Use more coffee','Use a cleaner filter','Use fresher beans'];
  for(let i=0;i<5;i++){await page.locator(`[data-problem="${i}"]`).click();assert.equal(await page.locator('#problem-result h3').innerText(),expected[i]);assert.match(await page.locator('#problem-result a').first().getAttribute('href'),/brew=pourover/);}
  const links=new Set();
  for(const theme of ['light','dark']){
   await page.evaluate(t=>localStorage.setItem('coffee-master-theme',t),theme);
   for(const name of pages){
    await page.goto(base+name+'.html');
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    for(const width of [320,390,768,1440]){
     await page.setViewportSize({width,height:1000});
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${theme}/${name}/${width} has no overflow`);
    }
    await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})));});
    assert.deepEqual(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[],`${name} images load`);
    assert.equal(await page.locator('h1').count(),1);
    const duplicateIds=await page.locator('[id]').evaluateAll(els=>els.map(e=>e.id).filter((id,i,ids)=>ids.indexOf(id)!==i));assert.deepEqual(duplicateIds,[],`${name} IDs are unique`);
    await page.screenshot({path:path.join(shots,`unified-${theme}-${name}.png`),fullPage:true});
    const local=await page.locator('a[href]').evaluateAll(els=>els.map(a=>a.href).filter(h=>h.startsWith(location.origin)));local.forEach(h=>links.add(h));
    await page.setViewportSize({width:390,height:844});
    await page.locator('.menu-toggle').click();assert.equal(await page.locator('#main-navigation').isVisible(),true);
    await page.locator('.nav-group summary').first().click();
    for(const name of ['Grinder settings','Recipes','Fix my cup'])assert.equal(await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name,exact:true}).isVisible(),true);
    await page.locator('.nav-group summary').first().focus();await page.keyboard.press('Escape');assert.equal(await page.locator('.nav-group').first().getAttribute('open'),null);
    await page.keyboard.press('Escape');assert.equal(await page.locator('#main-navigation').isVisible(),false);assert.equal(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement),true);
    console.log(`PASS layout/theme/menu: ${theme} ${name}`);
   }
  }
  // Crawl local links and their fragment targets without relying on visual appearance.
  for(const href of links){const url=new URL(href);const response=await page.request.get(url.href.split('#')[0]);assert.equal(response.status(),200,href);if(url.hash){const html=await response.text();const id=decodeURIComponent(url.hash.slice(1));assert.ok(html.includes(`id="${id}"`),`Missing fragment: ${href}`);}}
  assert.deepEqual(errors,[]);assert.deepEqual(badResponses,[]);
  const touch=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  await touch.goto(base);
  assert.equal(await touch.locator('.center-action').evaluate(el=>getComputedStyle(el).opacity),'1');
  await touch.locator('#wheel-surprise').tap();await touch.waitForFunction(()=>!document.getElementById('wheel-surprise').disabled);
  assert.match(await touch.locator('.reason').innerText(),/chance/);
  await touch.locator('.menu-toggle').tap();await touch.locator('.nav-group summary').first().tap();await touch.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Grinder settings',exact:true}).tap();
  await touch.waitForURL('**/grinder.html');
  assert.match(touch.url(),/grinder.html/);
  await touch.close();
  console.log('PASS: original calculations and recipe content, both grinder modes, validation, carried choices, bean filters, 21 recipes, 5 fixes, 80 responsive theme/page combinations, local links, keyboard/mobile menus, touch and images.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
