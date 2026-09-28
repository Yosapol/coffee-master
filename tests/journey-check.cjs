const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const pages=['index','beans','brewing','water','equipment','thai-coffee','knowledge','grinder','recipes','dial-in'];
const base=((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'');
(async()=>{
 const browser=await chromium.launch();
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce',hasTouch:true});
  // Ignore development-server reloads caused by writing review screenshots.
  await p.addInitScript(()=>{window.WebSocket=class{};});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const paragraphs=new Map();
  for(const name of pages){
   await p.goto(base+name+'.html');
   const copy=await p.locator('main p').allTextContents();
   for(const text of copy.map(t=>t.replace(/\s+/g,' ').trim()).filter(t=>t.length>100)){
    const where=paragraphs.get(text)||[];where.push(name);paragraphs.set(text,where);
   }
   const next=await p.locator('.next-steps a').evaluateAll(as=>as.map(a=>new URL(a.href).pathname));
   assert(!next.includes('/'+name+'.html'),name+' has no next-step link back to itself');
  }
  assert.deepEqual([...paragraphs].filter(([,where])=>where.length>1),[],'No verbatim repeated long paragraphs in main content');
  await p.goto(base+'beans.html?flavor=floral&roast=light');
  await p.locator('.next-steps a').first().click();
  assert.match(p.url(),/brewing.html\?flavor=floral&roast=light/);
  await p.locator('#frenchpress>a').click();
  assert.equal(await p.locator('#brew').inputValue(),'frenchpress');
  assert.equal(await p.locator('#roast').inputValue(),'light');
  await p.goto(base+'brewing.html?brew=espresso&flavor=fruity&roast=light-medium');
  assert.match(await p.locator('#pourover>a').getAttribute('href'),/brew=pourover/,'Explicit method wins over carried method');
  await p.getByRole('button',{name:'Clear choices',exact:true}).click();
  assert.equal(await p.locator('#pourover>a').getAttribute('href'),'grinder.html?brew=pourover');
  assert.equal(await p.locator('.next-steps a').last().getAttribute('href'),'recipes.html');
  await p.goto(base+'knowledge.html?flavor=citrus&brew=espresso');
  await p.locator('.professional-paths summary').click();
  await p.locator('a[href*="#roaster"]').click();
  assert.match(p.url(),/thai-coffee.html\?flavor=citrus&brew=espresso#roaster/);
  await p.goto(base+'recipes.html?brew=espresso&roast=dark');
  assert(await p.locator('.recipe-context-note').isVisible());
  assert.match(await p.locator('.recipe-context-note').innerText(),/does not contain a recipe for that method/);
  await p.getByRole('button',{name:'Use pour-over for my cup'}).click();
  assert(!(await p.locator('.recipe-context-note').isVisible()));
  await p.locator('#recipe-grinder-link').click();
  assert.equal(await p.locator('#brew').inputValue(),'pourover');
  assert.equal(await p.locator('#roast').inputValue(),'dark');
  await p.goto(base+'water.html?flavor=INVALID&brew=BAD&roast=UNKNOWN');
  assert(!(await p.locator('#journey-context').isVisible()));
  assert.equal(await p.locator('.next-steps a').first().getAttribute('href'),'recipes.html?brew=pourover','Invalid URL values are ignored; the explicitly saved method remains');
  assert.equal(await p.locator('.kb-card').count(),3,'One merged set of water basics');
  assert.equal(await p.locator('.hero-art img').getAttribute('src'),'assets/watercolor-water.webp');
  for(const detail of await p.locator('.water-fixes details').all()){
   await detail.evaluate(el=>el.open=false);await detail.locator('summary').focus();await p.keyboard.press('Enter');
   assert(await detail.getAttribute('open')!==null);await detail.locator('summary').tap();assert.equal(await detail.getAttribute('open'),null);
  }
  for(const theme of ['light','dark']){
   await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await p.setViewportSize({width:390,height:844});
   await p.screenshot({path:`tests/screenshots/merged-water-${theme}-mobile.png`,fullPage:true});
  }
  await p.goto(base+'dial-in.html');
  assert.equal(await p.locator('#problem-options button').count(),5);
  assert.equal(await p.locator('#troubleshooting-table,.taste-compass,.dial-visual-grid').count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: all 10 pages audited for repeated copy and self-links; connected bean → method → grinder journey; explicit context, clearing, invalid choices, deep links, recipe scope and water keyboard/touch controls.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
