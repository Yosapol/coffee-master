(() => {
 const regions=[
  {id:'chiang-rai',name:'Chiang Rai',area:'Northern Thailand',focus:'Highland Arabica',story:'Chiang Rai’s highland coffee story includes Arabica plantations around Doi Pamee. Explore the farm and processing details behind a bag, then use the roaster’s tasting notes to choose your brew.',source:'https://www.tourismthailand.org/Articles/https-www-tourismthailand-org-articles-getting-to-know-chiang-rai',publisher:'Tourism Authority of Thailand'},
  {id:'chiang-mai',name:'Chiang Mai',area:'Northern Thailand',focus:'From mountain farms to the cup',story:'Explore the northern Arabica guide and the farm-to-brew workflow below. When choosing a Chiang Mai coffee, look for the named farm, processing method, roast date, and brewing suggestion.',source:'https://royalproject.org/pageeng/products/pdlistE/46',publisher:'Royal Project coffee collection'},
  {id:'nan',name:'Nan',area:'Northern Thailand',focus:'Coffee and local culture',story:'Nan’s coffee experience connects with its local culture. TAT’s provincial guide includes Thai Lue Coffee House in Pua alongside local weaving. For beans to brew at home, check the bag’s origin and processing details.',source:'https://www.tourismthailand.org/Articles/https-www-tourismthailand-org-articles-wheretogoinnanprovinceonyournextholiday',publisher:'Tourism Authority of Thailand'},
  {id:'mae-hong-son',name:'Mae Hong Son',area:'Northern Thailand',focus:'Mae La Noi’s community coffee',story:'The Royal Project describes its Mae La Noi single-origin coffee as cultivated by Karen growers working with the Mae La Noi development center. Follow the producer checklist below to understand the work behind a lot.',source:'https://royalproject.org/pageeng/products/pdtailE/46/671',publisher:'Royal Project Foundation'},
  {id:'chumphon',name:'Chumphon',area:'Southern Thailand',focus:'A focus on fine Robusta',story:'Chumphon’s coffee development includes the Fine Robusta Center, which supports a shift toward specialty quality. Explore the southern coffee guide and compare how sorting and processing shape a lot.',source:'https://doaenews.doae.go.th/archives/33537',publisher:'Department of Agricultural Extension (Thai)'},
  {id:'ranong',name:'Ranong',area:'Southern Thailand',focus:'Robusta from local growers',story:'Ranong’s provincial commerce office highlights coffee shops and Robusta farms through its Coffee Connext initiative. Explore the southern guide, then look for a producer and process you can trace on the bag.',source:'https://ranong.moc.go.th/th/content/category/detail/id/3536/iid/46458',publisher:'Ranong Provincial Commerce Office (Thai)'}
 ];
 const root=document.getElementById('thai-coffee-map');if(!root)return;
 const content=document.getElementById('region-content');
 function select(id,save=false){
  const region=regions.find(r=>r.id===id)||regions[0];
  root.querySelectorAll('[data-region]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.region===region.id)));
  const south=region.area==='Southern Thailand';
  content.innerHTML=`<div class="guide-card-picture"><img src="assets/thai-coffee/${region.id}.webp" width="720" height="480" alt="Watercolor interpretation of ${region.name} coffee culture"></div><p class="region-tag">${region.area} · ${regions.indexOf(region)+1} of 6</p><h3>${region.name}</h3><p><strong>${region.focus}</strong></p><p>${region.story}</p><div class="next-actions"><a class="button" href="#section-${south?'body-crema-and-local-identity':'highland-sweetness-and-acidity'}">Explore ${south?'southern':'northern'} coffee ↓</a><a class="button" href="#farmer">How it is grown ↓</a></div>`;
  if(save){const url=new URL(location.href);url.hash='coffee-'+region.id;history.pushState(null,'',url);}
 }
 root.addEventListener('click',e=>{const button=e.target.closest('[data-region]');if(button){select(button.dataset.region,true);if(matchMedia('(max-width:760px)').matches)content.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}});
 function fromHash(){if(!location.hash.startsWith('#coffee-'))return;const id=location.hash.slice(8);select(regions.some(r=>r.id===id)?id:regions[0].id);}
 addEventListener('popstate',()=>{if(!location.hash||location.hash==='#thai-coffee-map')select(regions[0].id);else fromHash();});
 addEventListener('hashchange',fromHash);
 select(regions[0].id);fromHash();
})();
