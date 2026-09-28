/* Rebuild the original botanical SVG illustrations: node scripts/build-flavor-art.cjs */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'flavor-notes.js'),'utf8'),ctx);
const ellipse=(x,y,rx,ry,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${extra}/>`;
const circle=(x,y,r,extra='')=>ellipse(x,y,r,r,extra);
const leaf='<path d="M73 41q-2-22 26-20-2 21-26 20Z" fill="#94a783"/><path d="m72 48 4-25" fill="none"/>';
function art(n,i){
 const petal=n.art==='daisy'?10:n.id==='hibiscus'?5:n.id==='honeysuckle'?6:7;
 const flower=Array.from({length:petal},(_,j)=>ellipse(60,40,10,21,`transform="rotate(${j*360/petal} 60 61)" opacity=".85"`)).join('');
 switch(n.art){
 case 'flower':case 'daisy':return `<path d="M62 106q7-32-2-48" fill="none" stroke="#7a956a"/>${flower}${circle(60,61,10,'fill="#d5b967"')}<path d="M63 94q14-21 27-12-4 18-27 12Z" fill="#94a783"/>`;
 case 'rose':return `<path d="M62 111V75" fill="none" stroke="#7a956a"/><path d="M61 96q-20-26-33-12 10 19 33 12Z" fill="#94a783"/>${Array.from({length:5},(_,j)=>ellipse(60,48,18,24,`transform="rotate(${j*72} 60 60)" opacity=".85"`)).join('')}<path d="M40 60q-6-23 16-21 22-12 26 14 8 24-18 26-23 3-24-19Z"/><path d="M47 63q-9-15 9-17 17-7 19 11 0 16-17 15-13-2-11-9Zm9-13q17 1 9 13-12 8-13-3 0-9 8-4" fill="none"/>`;
 case 'sprig':return `<path d="m42 111 24-87m-8 63 33-30M51 97 28 59" stroke="#7a956a" fill="none"/>${Array.from({length:9},(_,j)=>ellipse(59+j%2*12,27+j*6,6,10,'transform="rotate(20 65 54)"')).join('')}${ellipse(88,55,6,12)}${ellipse(28,57,6,12)}`;
 case 'cluster':return `<path d="M63 107 56 55m7 34 27-40m-28 40-30-34" stroke="#7a956a" fill="none"/>${Array.from({length:15},(_,j)=>circle(30+(j*19)%65,29+(j*13)%37,7,'fill="#e8dfc4"')).join('')}`;
 case 'tea':return `<path d="M29 62h65l-9 35H40Z" opacity=".5"/><path d="M94 65q24-1 15 17l-19 6" fill="none"/>${ellipse(61,62,32,9)}<path d="M31 106h62M50 43q-7-8 0-15m18 13q-7-9 0-15" fill="none"/>${leaf}`;
 case 'strawberry':return `<path d="M28 46q33-21 63 0 5 27-31 58-33-32-32-58Z"/><path d="m33 42 19-3 8-14 6 15 20 2-16 12-11-8-15 9Z" fill="#899d73"/>${Array.from({length:15},(_,j)=>ellipse(41+(j%4)*12,58+Math.floor(j/4)*10,1.5,2.5,'fill="#f2d49b" stroke="none"')).join('')}`;
 case 'berries':return `${[[40,73],[74,79],[58,48]].map(([x,y])=>`${circle(x,y,20)}<path d="m${x-6} ${y-5} 6-4 6 4-4 6h-5Z" fill="#656e93"/>`).join('')}${leaf}`;
 case 'raspberry':return `${[[44,46],[62,44],[80,47],[35,61],[53,60],[72,61],[87,63],[42,78],[60,78],[77,78],[59,95]].map(([x,y])=>circle(x,y,12)).join('')}<path d="m35 33 19 8 7-18 8 18 19-9-9 18H43Z" fill="#899d73"/>`;
 case 'cherry':return `<path d="M36 79q9-35 32-54 7 25 14 55" fill="none" stroke="#738664" stroke-width="3"/>${circle(36,80,21)}${circle(81,84,22)}${leaf}<path d="M25 75q2-9 11-10m36 14q2-8 10-10" fill="none" stroke="#f7dcce" stroke-width="3"/>`;
 case 'stone':return `${ellipse(46,72,28,32)}${ellipse(84,75,23,30,'fill="#f0c6a0"')}${ellipse(84,78,9,15,'fill="#a27859"')}<path d="M49 44q-8 18-4 53" fill="none"/>${leaf}`;
 case 'grapes':return `${[[45,44],[68,44],[89,47],[35,64],[58,66],[81,66],[48,85],[71,85],[60,103]].map(([x,y])=>circle(x,y,13)).join('')}${leaf}`;
 case 'apple':return `<path d="M61 43C16 22 12 80 41 101q10 8 20-1 17 11 28-6 28-42-5-55-12-5-23 4Z"/>${leaf}<path d="M31 59q-5 11 1 21" fill="none" stroke="#f1e7b9" stroke-width="4"/>`;
 case 'lemon':return `<path d="M23 73q-13-15 7-25 26-25 51-2 20 1 15 20 1 35-33 37-22 0-40-30Z"/>${leaf}<path d="M35 58q18-15 30-9" fill="none" stroke="#f6ebc2" stroke-width="4"/>`;
 case 'citrus':{const x=n.id==='mandarin'||n.id==='tangerine'?55:54;return `${circle(x,65,36)}${circle(78,79,29,'fill="#f7e9cd"')}${Array.from({length:8},(_,j)=>{const a=j*Math.PI/4,b=a+.63;return `<path d="M78 79l${Math.cos(a)*24} ${Math.sin(a)*24}A24 24 0 0 1 ${78+Math.cos(b)*24} ${79+Math.sin(b)*24}Z" stroke="none"/>`;}).join('')}${leaf}`;}
 case 'honey':return `<path d="M38 36h45v13l8 10v43H29V59l9-10Z" opacity=".7"/><path d="M34 32h52v10H34Z" fill="#b5ad8b"/><path d="M29 69h62v22H29Z" fill="#f4e7c7"/>${ellipse(60,80,13,7,'stroke="none"')}<path d="m94 27-2 35m-5-28 14 2m-15 4 14 2m-15 4 14 2" fill="none" stroke-width="4"/>`;
 case 'maple':return `<path d="M45 24h25v18l15 14v48H29V56l16-14Z" opacity=".8"/><path d="M44 20h27v13H44Z" fill="#b4ac8b"/><path d="M36 65h44v29H36Z" fill="#eedec0"/><path d="m57 69 3 9 8-3-3 8 6 3-10 2v5h-4v-5l-10-2 6-3-3-8 7 3Z" stroke="none"/>`;
 case 'cubes':case 'nougat':return `${[[27,49],[63,63],[51,33]].map(([x,y])=>`<path d="m${x} ${y} 24-8 15 12v24l-23 8-16-13Z"/><path d="m${x} ${y} 16 12 23-9m-23 9v24" fill="none" opacity=".6"/>`).join('')}${n.art==='nougat'?'<path d="m45 70 4 2m25-18 4 3m0 34 5 2" stroke="#967454" stroke-width="4"/>':''}`;
 case 'sugar':return `<path d="M22 94q9-28 38-52 29 27 40 52Z"/>${Array.from({length:25},(_,j)=>circle(33+(j*13)%52,65+(j*7)%25,1.5,'fill="#f1dbb6" stroke="none"')).join('')}<path d="M20 100h82" fill="none"/>`;
 case 'vanilla':case 'licorice':return `<path d="M29 105q-2-52 50-76M45 112q-1-45 39-78M66 107q-4-30 23-52" fill="none" stroke="${n.color}" stroke-width="10" stroke-linecap="round"/><path d="M29 105q-2-52 50-76M45 112q-1-45 39-78" fill="none" stroke="#d7bd94" stroke-width="1.5"/>${n.art==='vanilla'?'<path d="m37 36-17 4 9-15-5-12 16 7 13-3-4 14 8 12-17-1Z" fill="#ece1ba"/>':''}`;
 case 'date':return `${ellipse(43,71,16,31,'transform="rotate(-24 43 71)"')}${ellipse(78,77,16,31,'transform="rotate(18 78 77)"')}<path d="m42 47 1 47m35-41v47" fill="none"/>`;
 case 'almond':return `<path d="M23 89q-3-43 41-63 16 47-16 71-17 13-25-8ZM68 106q-9-31 19-52 22 30 2 51-9 10-21 1Z"/><path d="m33 87 25-45m21 58 7-34m-49 28 24-43" fill="none" opacity=".6"/>`;
 case 'hazelnut':return `${circle(42,78,24)}${circle(83,80,24)}<path d="M19 72q22-27 45 0M60 74q21-27 44 0" fill="#d7ba89"/>${leaf}`;
 case 'walnut':case 'nutmeg':return `${ellipse(60,72,35,34)}<path d="M59 39v67m-7-57q-19-8-10 11-23 1-8 15-10 11 9 11-10 16 9 13m17-50q18-8 10 11 22 1 8 15 9 11-10 11 10 16-9 13" fill="none"/>`;
 case 'peanut':return `<path d="M26 37q17-12 31 13 2 7 19 9 35 6 20 34-13 18-34-3-6-9-20-11-33-9-16-42Z"/><path d="m30 46 58 39m-55-9 36-36m-23 45 35-31m-56-7 34 42m-20-56 34 47" fill="none" opacity=".4"/>`;
 case 'cashew':return `<path d="M41 33q-36 31-6 65 25 24 46-5 8-19-8-20-11-3-14 6-13-3-9-15 19-25-9-31Z"/><path d="M91 37q-26 10-12 26 6 5 13-2 12 0 14-9 1-13-15-15Z"/>`;
 case 'chocolate':return `<path d="m25 47 57-21 26 58-57 22Z"/><path d="m33 50 16-6 7 16-16 6Zm22-8 16-6 7 16-16 6ZM43 72l16-6 7 16-16 6Zm22-8 16-6 7 16-16 6Z" fill="#f3dfc3" opacity=".22"/>`;
 case 'cocoa':return `<path d="M25 77h76l-12 25H38Z" fill="#d7c9ac"/><path d="M28 76q31-33 69 0Z"/>${Array.from({length:12},(_,j)=>circle(37+j*4,70-j%3*4,1,'fill="#e5c9a4" stroke="none"')).join('')}<path d="m74 47 34-16" fill="none" stroke-width="6"/>`;
 case 'nibs':return `${Array.from({length:13},(_,j)=>{const x=28+j*23%66,y=42+j*17%58;return `<path d="m${x} ${y} 10-3 5 8-8 7-9-4Z" opacity="${.6+j%3*.15}"/>`;}).join('')}`;
 case 'cinnamon':return `<path d="m31 95 25-63 16 7-23 66Zm24 9 25-64 16 7-23 66Z"/>${ellipse(41,99,9,5)}${ellipse(65,108,9,5)}<path d="m41 91 22-52m1 59 22-49" fill="none"/>`;
 case 'clove':return `${[[39,39,61,94],[75,35,53,94],[93,63,49,100]].map(([x,y,a,b])=>`<path d="M${x} ${y} ${a} ${b}" fill="none" stroke-width="5"/>${circle(x,y,9)}`).join('')}`;
 case 'cardamom':return `${[[41,60,-20],[77,56,25],[65,92,70]].map(([x,y,a])=>`<g transform="rotate(${a} ${x} ${y})">${ellipse(x,y,14,25)}<path d="M${x} ${y-19}v38m-7-30v22m14-22v22" fill="none"/></g>`).join('')}`;
 case 'ginger':return '<path d="M25 82q-17-18 0-24l22 5-5-27q3-18 15-8l7 30 14-12q17-5 17 10L77 75l19 9q12 15-3 20l-29-19-24 17q-20 2-15-20Z"/><path d="m31 68 9 9m12-33 11-3m12 40-6 9m-17-9-7 12" fill="none"/>';
 case 'pepper':return `${Array.from({length:12},(_,j)=>circle(28+j*23%70,43+j*17%60,7+(j%3),'opacity=".85"')).join('')}<path d="M29 105h71" fill="none"/>`;
 case 'cedar':return '<path d="M58 110V25" fill="none" stroke-width="4"/><path d="m57 35-20 20 21-6 21 6-20-20m-1 17L27 77l31-9 32 9-31-25m-1 20-41 28 41-10 42 10-41-28Z" fill="#91a280"/>';
 case 'leaf':return '<path d="M28 104Q7 52 96 24q12 72-68 80Z"/><path d="m27 107 60-73M42 87l-9-25m23 12-4-25m16 16 22-5M41 89l25 1" fill="none"/>';
 }
}
const dest=path.join(root,'assets','flavors');fs.mkdirSync(dest,{recursive:true});
ctx.window.CoffeeFlavors.forEach((n,i)=>{
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><radialGradient id="wash"><stop stop-color="${n.color}" stop-opacity=".2"/><stop offset="1" stop-color="${n.color}" stop-opacity="0"/></radialGradient></defs><ellipse cx="64" cy="69" rx="61" ry="54" fill="url(#wash)"/><g fill="${n.color}" stroke="#716653" stroke-opacity=".55" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${art(n,i)}</g></svg>`;
 fs.writeFileSync(path.join(dest,n.id+'.svg'),svg);
});
console.log(`Built ${ctx.window.CoffeeFlavors.length} flavor illustrations.`);
