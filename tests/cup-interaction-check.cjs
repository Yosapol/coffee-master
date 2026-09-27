const {chromium}=require('playwright'),assert=require('node:assert/strict');
const base=((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'');
(async()=>{const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:390,height:900},hasTouch:true});await p.addInitScript(()=>window.WebSocket=class{});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base);await p.locator('[data-mood="cozy"]').tap();await p.locator('.flavor-tile[data-note="hazelnut"]').tap();await p.reload();assert.equal(await p.locator('.flavor-tile[data-note="hazelnut"]').getAttribute('aria-pressed'),'true');
 await p.locator('#coffee-result .cup-save').tap();await p.goto(base+'grinder.html');await p.locator('#brew').selectOption('pourover');await p.locator('#mode-convert').tap();await p.locator('#s').fill('5.33');await p.locator('#grinder-result .cup-save').tap();
 const saved=await p.evaluate(()=>CoffeeCup.get());assert.equal(saved.grind.mode,'convert');
 await p.locator('#cup-open').tap();await p.getByRole('link',{name:'Change grinder',exact:true}).click();assert.equal(await p.locator('#s').inputValue(),'5.33');assert.equal(await p.locator('#mode-convert').getAttribute('aria-pressed'),'true');
 await p.locator('#cup-open').tap();await p.getByRole('button',{name:'Remove desired note',exact:true}).tap();assert.equal(await p.evaluate(()=>CoffeeCup.get().note),undefined);
 await p.getByRole('button',{name:'Start fresh',exact:true}).tap();await p.getByRole('button',{name:'Undo start fresh'}).tap();assert.equal(await p.locator('#brew').inputValue(),'pourover');assert.equal(await p.locator('#s').inputValue(),'5.33');
 await p.keyboard.press('Escape');await p.locator('.theme-toggle').tap();await p.locator('#cup-open').tap();await p.screenshot({path:'tests/screenshots/cup-dark-mobile.png',animations:'disabled'});
 for(let i=0;i<25;i++){await p.keyboard.press('Tab');assert(await p.evaluate(()=>document.activeElement.closest('#cup-dialog')!==null));}
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('#cup-dialog').evaluate(e=>getComputedStyle(e).animationName),'none');
 await p.keyboard.press('Escape');await p.locator('.site-footer').scrollIntoViewIfNeeded();const fr=await p.locator('.site-footer').boundingBox(),rr=await p.locator('.cup-rail').boundingBox();assert(rr.width<110&&rr.y<250,'Companion is a small upper-right float, not a footer bar');
 await p.goto(base+'index.html?profile=__proto__');await p.goto(base+'recipes.html?recipe=__proto__');assert.deepEqual(errors,[]);
 const fresh=await b.newPage();await fresh.goto(base);await fresh.locator('[data-mood="curious"]').click();await fresh.locator('#coffee-result .cup-save').click();assert.equal(await fresh.evaluate(()=>CoffeeCup.get().roast),undefined);await fresh.goto(base+'grinder.html');assert.equal(await fresh.locator('#roast').inputValue(),'');assert.match(await fresh.locator('#roast-context').innerText(),/light.medium/);await fresh.close();
 console.log('PASS: touch, note restoration, conversion restoration, removal, Undo restores controls, dark mobile, modal focus containment, reduced motion, footer clearance, hostile IDs');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
