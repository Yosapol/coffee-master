const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 try{
 const p=await browser.newPage();
 await p.addInitScript(()=>{window.WebSocket=class{};});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+''));
 const tip=p.locator('.noticing-tip');
 assert.equal(await tip.getAttribute('open'),null);
 await tip.locator('summary').focus();await p.keyboard.press('Enter');
 assert.equal(await tip.locator('p').isVisible(),true);
 await tip.getByRole('link').click();
 assert(p.url().endsWith('knowledge.html#taste-your-cup'));
 assert.equal(await p.locator('.tasting-step').count(),3);
 for(const theme of ['light','dark'])for(const width of [320,390,768,1440]){
 await p.setViewportSize({width,height:900});
 await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
 for(const el of await p.locator('.tasting-step').all()){
 await el.evaluate(e=>e.open=true);
 assert(await el.locator('p').isVisible());
 }
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} ${width}`);
 }
 await p.setViewportSize({width:1440,height:900});
 await p.evaluate(()=>document.documentElement.dataset.theme='light');
 await p.locator('.tasting-moment').screenshot({path:'tests/screenshots/tasting-moment-light.png'});
 await p.setViewportSize({width:390,height:900});
 await p.evaluate(()=>document.documentElement.dataset.theme='dark');
 await p.locator('.tasting-moment').screenshot({path:'tests/screenshots/tasting-moment-dark-mobile.png'});
 await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'equipment.html'));
 await p.locator('.hero-art').scrollIntoViewIfNeeded();
 assert(await p.locator('.hero-art').evaluate(e=>e.classList.contains('calm-arrival')));
 await p.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await p.locator('.hero-art').evaluate(e=>getComputedStyle(e).animationName),'none');
 await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'dial-in.html'));
 await p.locator('.taste-help summary').click();assert(await p.locator('.taste-help p').isVisible());
 assert.deepEqual(errors,[]);
 console.log('PASS: optional tips, keyboard, tasting journey, both themes at four widths, motion preference, runtime');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
