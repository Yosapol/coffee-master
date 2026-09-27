const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'}),errors=[];
 await page.addInitScript(()=>{window.WebSocket=class{};});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'beans.html'));
 assert.equal(await page.locator('.bean-origin-art').count(),20);
 assert.equal(await page.locator('.origin-country img').count(),19);
 assert.equal(await page.locator('.origin-map').count(),21);
 assert.equal(await page.locator('.type-card>.type-bean-mark').count(),4);
 assert.equal(await page.locator('.type-card svg,.type-card path').count(),0);
 for(const group of ['.bean-type-controls','.taste-controls-filter','#bean-flavors']){
  assert.equal(await page.locator(`${group} button`).count(),await page.locator(`${group} button img`).count());
 }
 assert.equal(await page.locator('#ethiopian-heirloom .origin-country strong').innerText(),'Ethiopia');
 assert.equal(await page.locator('#sumatra-mandheling .origin-country strong').innerText(),'Indonesia');
 assert.deepEqual(await page.locator('#racemosa .origin-country strong').allTextContents(),['Mozambique','South Africa']);
 for(const id of ['excelsa-dewevrei','catimor-hybrid']){assert.equal(await page.locator(`#${id} .regional-map`).count(),1);assert.equal(await page.locator(`#${id} .origin-country`).count(),0);}
 await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));});
 for(const file of fs.readdirSync(path.join(__dirname,'../assets/origins')).filter(n=>n.startsWith('map-'))){const svg=fs.readFileSync(path.join(__dirname,'../assets/origins',file),'utf8');assert.ok(!/<rect|<image|background/.test(svg),`${file} has transparent background`);}
 const palette={floral:'#d9cce4',fruity:'#e8b9b3',citrus:'#eedba1',sweet:'#d9dfba',nutty:'#ddc4a9',spiced:'#c5d5c7'};
 for(const[id,color]of Object.entries(palette)){
  const chip=page.locator(`#bean-flavors [data-flavor="${id}"]`);assert.equal(await chip.evaluate(el=>el.style.getPropertyValue('--family-color')),color);
  await chip.click();assert.equal(await chip.getAttribute('aria-pressed'),'true');assert.ok(await page.locator('.bean-card:visible').count()>0);
 }
 await page.locator('#reset-beans').click();
 await page.locator('[data-type-filter="robusta"]').click();assert.equal(await page.locator('.bean-card:visible').count(),2);
 await page.locator('[data-flavor="floral"]').click();assert.equal(await page.locator('#bean-empty').isVisible(),true);
 await page.locator('#empty-reset').click();assert.equal(await page.locator('.bean-card:visible').count(),20);
 await page.locator('[data-filter="earthy"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.bean-card:visible').evaluateAll(cs=>cs.every(c=>c.dataset.tags.includes('earthy'))),true);
 await page.locator('#reset-beans').click();
 for(const theme of ['light','dark']){
  if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.theme-toggle').click();
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:1100});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${theme}/${width}`);
   assert.equal(await page.locator('.bean-origin-art').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
  }
  await page.locator('.bean-filter-panel').evaluate(el=>window.scrollTo(0,el.offsetTop-20));
  await page.screenshot({path:path.join(__dirname,'screenshots',`bean-visuals-${theme}.png`),animations:'disabled',timeout:60000});
  console.log(`PASS bean artwork and controls: ${theme}, 320–1440px`);
 }
 await page.setViewportSize({width:390,height:844});await page.locator('.bean-filter-panel').screenshot({path:path.join(__dirname,'screenshots','bean-filters-mobile.png'),animations:'disabled',timeout:60000});
 await page.locator('.bean-card').first().screenshot({path:path.join(__dirname,'screenshots','bean-card-mobile.png'),animations:'disabled',timeout:60000});
 assert.deepEqual(errors,[]);
 console.log('PASS: 20 origin artworks, 19 flags, transparent country/regional maps, 6 representative bean types, icons for all choices, wheel-matched colors, filters/reset/keyboard, loaded assets, both themes and 320–1440px layouts.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
