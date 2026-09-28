const{chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch();try{const p=await b.newPage({reducedMotion:'reduce'});await p.addInitScript(()=>window.WebSocket=class{});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [320,390,630,768,1440]){
 await p.setViewportSize({width,height:950});await p.goto(((process.env.COFFEE_BASE_URL||'http://127.0.0.1:4173/')+'brewing.html'));
 const cup=await p.locator('#cup-open').boundingBox(),header=await p.locator('.site-header').boundingBox();assert(cup.y>=header.y+header.height);assert(cup.x+cup.width<=width);assert(width-cup.x-cup.width<30);
 const top=cup.y;await p.evaluate(()=>scrollTo(0,650));assert.equal(Math.round((await p.locator('#cup-open').boundingBox()).y),Math.round(top));await p.evaluate(()=>scrollTo(0,0));
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 if([390,1440].includes(width))await p.screenshot({path:`tests/screenshots/floating-cup-${width}.png`});
 await p.locator('#cup-open').click();assert(await p.locator('#cup-dialog').isVisible());await p.keyboard.press('Escape');
}
await p.evaluate(()=>CoffeeCup.choose({mood:'cozy',flavor:'nutty'}));assert.equal(await p.locator('#cup-open').getAttribute('data-fill'),'1');
await p.evaluate(()=>CoffeeCup.saveBean('recommendations','nutty-0'));assert.equal(await p.locator('#cup-open').getAttribute('data-fill'),'3');
await p.evaluate(()=>CoffeeCup.saveRecipe(Object.keys(CupData.recipes)[0]));assert.equal(await p.locator('#cup-open').getAttribute('data-fill'),'5');
await p.locator('#cup-open').click();assert(await p.getByRole('link',{name:'Open my recipe'}).isVisible());await p.getByRole('button',{name:'Start fresh',exact:true}).click();assert.equal(await p.locator('#cup-open').getAttribute('data-fill'),'0');await p.getByRole('button',{name:'Undo start fresh'}).click();assert.equal(await p.locator('#cup-open').getAttribute('data-fill'),'5');await p.keyboard.press('Escape');
await p.setViewportSize({width:390,height:950});await p.evaluate(()=>document.documentElement.dataset.theme='dark');await p.screenshot({path:'tests/screenshots/floating-cup-full-dark.png'});
assert.equal(await p.locator('.cup-liquid').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.deepEqual(errors,[]);console.log('PASS: upper-right floating position at five widths, scroll, open/close, empty-to-full progress, reset/Undo, recipe link, reduced motion, no errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
