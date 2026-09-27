const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  await page.addInitScript(()=>{window.WebSocket=class{};});
 page.on('pageerror',e=>errors.push(e.message));
  await page.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'index.html'));
  assert.equal(await page.evaluate(()=>CoffeeFlavors.length),60);
  assert.equal(await page.evaluate(()=>new Set(CoffeeFlavors.map(n=>n.image)).size),60);
  assert.equal(await page.locator('.flavor-note').count(),10);
  const before=await page.locator('#coffee-result').innerText();
  await page.locator('.flavor-note[data-note="hazelnut"]').hover();
  assert.equal(await page.locator('#flavor-detail-title').innerText(),'Hazelnut');
  assert.equal(await page.locator('.flavor-note.is-preview').count(),1);
  assert.equal(await page.locator('.flavor-note.is-preview').getAttribute('data-note'),'hazelnut');
  assert.equal(await page.locator('#coffee-result').innerText(),before,'Hover does not commit a recommendation');
  assert.equal(await page.locator('#flavor-detail').evaluate(el=>getComputedStyle(el).animationName),'flavor-fade');
  await page.locator('[data-pick-note="hazelnut"]').click();
  assert.equal(await page.locator('.flavor-note[data-note="hazelnut"]').getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('#result-context').innerText(),/Hazelnut/);
  for(const family of ['floral','fruity','citrus','sweet','nutty','spiced']){
   await page.locator(`#flavor-key [data-family="${family}"]`).click();
   assert.equal(await page.locator('.flavor-note').count(),10);
   const ids=await page.locator('.flavor-note').evaluateAll(els=>els.map(el=>el.dataset.note));
   for(const id of ids){
    await page.locator(`.flavor-note[data-note="${id}"]`).focus();
    assert.equal(await page.locator('#flavor-detail-title').innerText(),await page.evaluate(id=>CoffeeFlavors.find(n=>n.id===id).name,id));
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(`.flavor-note[data-note="${id}"]`).getAttribute('aria-pressed'),'true');
    const img=page.locator('#flavor-detail img').first();await img.evaluate(i=>i.decode());
    assert.equal(await img.evaluate(i=>i.naturalWidth>0),true,`${id} picture loads`);
   }
  }
  await page.locator('.flavor-note').first().focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.flavor-note').nth(1).evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('End');assert.equal(await page.locator('.flavor-note').last().evaluate(el=>el===document.activeElement),true);
  await page.locator('#flavor-show-all').click();assert.equal(await page.locator('.flavor-tile').count(),60);
  await page.locator('#flavor-search').fill('jasmine');assert.equal(await page.locator('.flavor-tile').count(),1);
  await page.locator('.flavor-tile').click();assert.match(await page.locator('#result-context').innerText(),/Jasmine/);
  assert.equal(await page.locator('.wheel-segment[data-family="floral"]').getAttribute('aria-pressed'),'true');
  await page.locator('#flavor-search').fill('zzzzmissing');assert.equal(await page.locator('#flavor-empty').isVisible(),true);
  await page.locator('#flavor-search-reset').click();assert.equal(await page.locator('.flavor-tile').count(),10);
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.theme-toggle').click();
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${theme} ${width} no overflow`);
   }
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.flavor-note').first().focus();
  assert.equal(await page.locator('#flavor-detail').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.locator('.theme-toggle').click();
  await page.locator('.discovery').screenshot({path:path.join(__dirname,'screenshots','flavors-desktop.png')});
  await page.setViewportSize({width:390,height:844});
  await page.locator('.discovery').screenshot({path:path.join(__dirname,'screenshots','flavors-mobile.png')});
  const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await touch.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'index.html'));
  await touch.locator('.flavor-note[data-note="hazelnut"]').tap();
  assert.match(await touch.locator('#result-context').innerText(),/Hazelnut/);
  assert.equal(await touch.locator('#flavor-detail-title').innerText(),'Hazelnut');
  await touch.close();assert.deepEqual(errors,[]);
  console.log('PASS: 60 distinct pictures and selectable notes, hover preview without selection, fade, exact highlight, family ring, search/reset/empty state, keyboard, touch, reduced motion, light/dark 320–1440px.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
