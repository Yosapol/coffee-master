const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),out=path.join(root,'assets/origins');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'data/world-countries.geojson')));
const countries={et:'Ethiopia',co:'Colombia',br:'Brazil',id:'Indonesia',ke:'Kenya',gt:'Guatemala',cr:'Costa Rica',pa:'Panama',rw:'Rwanda',ye:'Yemen',in:'India',mx:'Mexico',vn:'Vietnam',ug:'Uganda',ph:'Philippines',my:'Malaysia',sl:'Sierra Leone',mz:'Mozambique',za:'South Africa'};
const rings=f=>f.geometry.type==='Polygon'?f.geometry.coordinates:f.geometry.coordinates.flat();
function outline(features,regional=false){
 const coords=features.flatMap(f=>rings(f).flat());
 const lat=coords.reduce((s,p)=>s+p[1],0)/coords.length,cos=regional?1:Math.cos(lat*Math.PI/180);
 const projection=p=>[p[0]*cos,-p[1]];
 const points=coords.map(projection),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const bounds=regional?[-180,180,-85,60]:[Math.min(...xs),Math.max(...xs),Math.min(...ys),Math.max(...ys)];
 const [x0,x1,y0,y1]=bounds,w=regional?300:200,h=140,s=Math.min((w-20)/(x1-x0),(h-16)/(y1-y0));
 const to=p=>{const[x,y]=projection(p);return [(w-(x1-x0)*s)/2+(x-x0)*s,(h-(y1-y0)*s)/2+(y-y0)*s].map(n=>n.toFixed(2)).join(',');};
 return features.map(f=>`<path d="${rings(f).map(r=>'M'+r.map(to).join('L')+'Z').join('')}" fill-rule="evenodd"${regional?` fill="${f.highlight?'#a6b58a':'#b9bbae'}" fill-opacity="${f.highlight?'.95':'.24'}"`:''}/>`).join('');
}
fs.mkdirSync(out,{recursive:true});
for(const[code,name]of Object.entries(countries)){
 const feature=data.features.find(f=>f.properties.ISO_A2===code.toUpperCase());if(!feature)throw Error(name);
 fs.writeFileSync(path.join(out,`map-${code}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140"><title>${name} country outline</title><g fill="#a6b58a" fill-opacity=".78" stroke="#75896a" stroke-width="1.2" stroke-linejoin="round">${outline([feature])}</g></svg>`);
}
const regional={excelsa:['South-Eastern Asia','Middle Africa'],catimor:['South-Eastern Asia','South America','Central America','Caribbean']};
for(const[id,regions]of Object.entries(regional)){
 const features=data.features.filter(f=>f.properties.CONTINENT!=='Antarctica').map(f=>({...f,highlight:regions.includes(f.properties.SUBREGION)}));
 fs.writeFileSync(path.join(out,`map-${id}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 140"><title>Broad growing regions</title><g stroke="#7f9173" stroke-width=".3">${outline(features,true)}</g></svg>`);
}
const beanShapes={
 arabica:['M47 13C20 15 9 53 21 78c13 25 45 16 54-9C86 39 76 10 47 13Z','M55 18C69 45 28 51 39 86'],
 robusta:['M49 20C20 19 10 41 16 65c7 28 45 37 64 10C99 48 81 20 49 20Z','M51 25 48 84'],
 liberica:['M54 9C30 7 11 45 18 76c3 18 22 27 37 15 15-8 12-20 23-35C93 32 79 9 54 9Z','M57 14C72 36 35 49 42 88'],
 excelsa:['M48 20C28 16 16 38 20 61c2 25 26 39 44 23 17-14 14-49-1-59Z','M53 25C61 44 34 59 47 81'],
 rare:['M51 17C29 15 20 42 22 66c3 29 26 31 40 12 13-17 15-59-11-61Z','M52 22C60 42 36 57 46 81'],
 hybrid:['M49 16C24 14 12 45 20 70c9 29 35 29 52 6 16-22 5-58-23-60Z','M51 21C64 42 33 60 45 85']
};
const beanDir=path.join(root,'assets/bean-types');fs.mkdirSync(beanDir,{recursive:true});
for(const[type,[shape,seam]]of Object.entries(beanShapes))fs.writeFileSync(path.join(beanDir,type+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 105"><defs><radialGradient id="bean" cx="35%" cy="30%" r="75%"><stop stop-color="#c4a080"/><stop offset=".55" stop-color="#9d7355"/><stop offset="1" stop-color="#694c3b"/></radialGradient></defs><path d="${shape}" fill="url(#bean)" stroke="#795940" stroke-width="1.5"/><path d="${seam}" fill="none" stroke="#503d30" stroke-width="4" stroke-linecap="round"/><path d="${seam}" fill="none" stroke="#e0bd95" stroke-width="1.1" transform="translate(3 0)" opacity=".8"/></svg>`);
fs.writeFileSync(path.join(out,'all.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><g stroke="#79876d" stroke-width="1.5"><circle cx="12" cy="12" r="7" fill="#d9cce4"/><circle cx="28" cy="12" r="7" fill="#e8b9b3"/><circle cx="12" cy="28" r="7" fill="#eedba1"/><circle cx="28" cy="28" r="7" fill="#c5d5c7"/></g></svg>');
const origins={
 'ethiopian-heirloom':[['et'],'Yirgacheffe highlands'],
 'colombian-caturra':[['co'],'Huila & Tolima'],
 'brazilian-bourbon':[['br'],'Cerrado Mineiro'],
 'sumatra-mandheling':[['id'],'Sumatra · Lake Toba'],
 'kenyan-sl28':[['ke'],'Nyeri & Kirinyaga'],
 'guatemala-antigua':[['gt'],'Antigua valley'],
 'costa-rica-tarrazu':[['cr'],'Tarrazu mountain farms'],
 'panama-geisha':[['pa'],'Boquete highlands'],
 'rwanda-bourbon':[['rw'],'Lake Kivu region'],
 'yemen-mocha':[['ye'],'Haraz & Bani Matar'],
 'monsooned-malabar':[['in'],'Malabar Coast'],
 'mexico-chiapas':[['mx'],'Sierra Madre de Chiapas'],
 'vietnamese-robusta':[['vn'],'Central Highlands'],
 'ugandan-robusta':[['ug'],'Lake Victoria basin'],
 'philippine-barako':[['ph'],'Batangas & Cavite'],
 'malaysian-liberica':[['my'],'Johor & Selangor'],
 'excelsa-dewevrei':[[],'Southeast Asia · Central Africa','excelsa'],
 'stenophylla':[['sl'],'Sierra Leone & neighboring West Africa'],
 'racemosa':[['mz','za'],'Coastal forest environments'],
 'catimor-hybrid':[[],'Southeast Asia · Latin America','catimor']
};
let html=fs.readFileSync(path.join(root,'beans.html'),'utf8');
html=html.replace(/(<article class="bean-card" id="([^"]+)"[^>]*>\s*)<div class="bean-art[^]*?<\/div>(?=\s*<div class="bean-card-body">)/g,(_,opening,id)=>{
 const [codes,place,region]=origins[id];
 const maps=codes.length?codes.map(code=>`<img class="origin-map" src="assets/origins/map-${code}.svg" width="200" height="140" alt="Country outline of ${countries[code]}">`).join(''):`<img class="origin-map regional-map" src="assets/origins/map-${region}.svg" width="300" height="140" alt="Highlighted growing regions: ${place}">`;
 const flags=codes.length?codes.map(code=>`<span class="origin-country"><img src="assets/origins/flag-${code}.svg" width="24" height="18" alt=""><strong>${countries[code]}</strong></span>`).join(''):'<strong class="origin-multiple">Multiple growing regions</strong>';
 return `${opening}<div class="bean-art bean-origin-art${region?' is-regional':''}" data-origin-codes="${codes.join(' ')}"><div class="origin-map-group">${maps}</div><div class="origin-caption"><span class="origin-eyebrow">GROWING ORIGIN</span>${flags}<span class="origin-place">${place}</span></div></div>`;
});
let typeIndex=0;
html=html.replace(/<svg class="type-bean-mark"[^]*?<\/svg>|<img class="type-bean-mark"[^>]*>(?:<path[^]*?<\/svg>)?/g,()=>{const type=['arabica','robusta','liberica','excelsa'][typeIndex++];return `<img class="type-bean-mark" src="assets/bean-types/${type}.svg" width="64" height="68" alt="One illustrative ${type} coffee bean">`;});
html=html.replace(/(<button class="type-button[^>]*data-type-filter="([^"]+)"[^>]*>)[^]*?<\/button>/g,(_,open,id)=>`${open}<img src="${id==='all'?'assets/origins/all.svg':`assets/bean-types/${id}.svg`}" width="28" height="30" alt=""><span>${id[0].toUpperCase()+id.slice(1)}</span></button>`);
const tasteIcons={all:'origins/all',bright:'flavors/lemon',sweet:'flavors/honey',bold:'flavors/dark-chocolate',earthy:'flavors/cedar'};
html=html.replace(/(<button class="filter-button[^>]*data-filter="([^"]+)"[^>]*>)[^]*?<\/button>/g,(_,open,id)=>`${open}<img src="assets/${tasteIcons[id]}.svg" width="30" height="30" alt=""><span>${id[0].toUpperCase()+id.slice(1)}</span></button>`);
fs.writeFileSync(path.join(root,'beans.html'),html);
console.log('Built 19 transparent country maps, 2 regional maps, 6 single-bean examples, and illustrated all 20 bean cards.');
