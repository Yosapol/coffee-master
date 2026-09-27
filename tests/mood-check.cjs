// Run with Node and Playwright available, while serving the project on port 4173.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const output = path.join(__dirname, 'screenshots');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1100}});
    const errors=[];
    await page.addInitScript(()=>{window.WebSocket=class{};});
 page.on('pageerror', e=>errors.push(e.message));
    page.on('response', r=>{if(r.url().startsWith('http://127.0.0.1:4173')&&r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
    await page.goto('http://127.0.0.1:4173');
    await page.locator('#coffee-result h4').waitFor();
    const pairs={cozy:'nutty',calm:'floral',bright:'citrus',curious:'fruity',focused:'sweet',bold:'spiced'};
    const names = new Set();
    for(const [mood,family] of Object.entries(pairs)){
      await page.locator(`[data-mood="${mood}"]`).click();
      assert.equal(await page.locator(`.wheel-segment[data-family="${family}"]`).getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('.mood-button[aria-pressed="true"]').count(),1);
      assert.match(await page.locator('.reason').innerText(),new RegExp(mood));
      for(let i=0;i<2;i++){
        names.add(await page.locator('#coffee-result h4').innerText());
        assert.ok((await page.locator('.buying-tip').innerText()).length>60);
        assert.equal(await page.locator('.note-tags span').count(),3);
        await page.locator('#another').click();
      }
    }
    assert.equal(names.size,12,'Every bean profile is reachable');
    await page.locator('[data-mood="cozy"]').click();
    for(const family of Object.values(pairs)){
      await page.locator(`#flavor-key [data-family="${family}"]`).click();
      assert.equal(await page.locator(`.wheel-segment[data-family="${family}"]`).getAttribute('aria-pressed'),'true');
      assert.match(await page.locator('#result-context').innerText(),/Cozy mood/);
    }
    for(const family of Object.values(pairs)){
      await page.locator(`.wheel-segment[data-family="${family}"] .family-path`).click();
      assert.equal(await page.locator(`.wheel-segment[data-family="${family}"]`).getAttribute('aria-pressed'),'true');
    }
    const floral=page.locator('.wheel-segment[data-family="floral"]');
    await floral.focus(); await page.keyboard.press('Enter');
    assert.equal(await floral.getAttribute('aria-pressed'),'true');
    await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');
    assert.equal(await page.locator('.wheel-segment[data-family="fruity"]').getAttribute('aria-pressed'),'true');
    let previous=await page.locator('#coffee-result h4').innerText();
    await page.locator('#surprise').click();
    assert.equal(await page.locator('#surprise').isDisabled(),true);
    assert.equal(await page.locator('#flavor-wheel').getAttribute('aria-busy'),'true');
    await page.waitForFunction(()=>!document.querySelector('#surprise').disabled);
    assert.notEqual(await page.locator('#coffee-result h4').innerText(),previous);
    assert.equal(await page.locator('.mood-button[aria-pressed="true"]').count(),0);
    assert.match(await page.locator('.reason').innerText(),/chance/);
    await page.locator('#another').click();
    assert.match(await page.locator('.reason').innerText(),/chance/);
    await page.locator('#flavor-key [data-family="floral"]').click();
    assert.match(await page.locator('#result-context').innerText(),/Your choice/);
    assert.equal(await page.locator('.mood-button[aria-pressed="true"]').count(),0,'Flavor does not invent a mood');
    await page.emulateMedia({reducedMotion:'reduce'});
    for(let i=0;i<24;i++){
      previous=await page.locator('#coffee-result h4').innerText();
      await page.locator('#surprise').click();
      await page.waitForFunction(()=>!document.querySelector('#surprise').disabled);
      assert.notEqual(await page.locator('#coffee-result h4').innerText(),previous);
      assert.equal(await page.locator('.wheel-segment[aria-pressed="true"]').count(),1);
    }
    await page.locator('[data-mood="cozy"]').click();
    await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true,animations:'disabled'});
    for(const width of [320,390,768,1024,1440]){
      await page.setViewportSize({width,height:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`No horizontal overflow at ${width}px`);
      assert.equal(await page.locator('.hero-art img').evaluate(el=>el.complete&&el.naturalWidth>0),true);
      if(width===390){
        await page.screenshot({path:path.join(output,'mobile.png'),fullPage:true,animations:'disabled'});
      }
    }
    await page.locator('.ritual summary').click();
    assert.equal(await page.locator('.ritual details').getAttribute('open'),'');
    const localLinks=await page.locator('a[href]').evaluateAll(els=>[...new Set(els.map(e=>e.getAttribute('href')).filter(h=>!h.startsWith('#')&&!h.startsWith('http')))]);
    for(const href of localLinks){assert.equal((await page.request.get(`http://127.0.0.1:4173/${href}`)).status(),200,href);}
    assert.deepEqual(errors,[]);
    await page.close();
    const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    await touch.goto('http://127.0.0.1:4173');
    await touch.locator('[data-mood="calm"]').tap();
    assert.match(await touch.locator('#result-context').innerText(),/Calm mood/);
    await touch.locator('#flavor-key [data-family="citrus"]').tap();
    assert.match(await touch.locator('#result-context').innerText(),/citrus/);
    await touch.locator('#surprise').tap();
    await touch.waitForFunction(()=>!document.querySelector('#surprise').disabled);
    assert.match(await touch.locator('.reason').innerText(),/chance/);
    await touch.close();
    console.log('PASS: six moods, twelve bean profiles, flavor overrides, keyboard and touch, random no-repeat and busy state, reduced motion, 320–1440px layouts, links and assets, no runtime errors.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
