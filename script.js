const grinders={
  "Fellow Ode Gen 2":{min:1,max:10,step:0.1,u:"dial",note:"Filter-focused grinder; Fellow says it is not intended for espresso."},
  "Fellow Opus":{min:1,max:11,step:0.25,u:"outer dial",note:"Outer ring is 1-11 with quarter-step marks; inner ring is not modeled."},
  "KINGrinder K6":{min:0,max:240,step:1,u:"clicks",note:"Clicks from burr touch / zero."},
  "KINGrinder K4":{min:0,max:240,step:1,u:"clicks",note:"Clicks from burr touch / zero."},
  "Comandante C40 MK4":{min:0,max:60,step:1,u:"clicks",type:"woodHand",color:"#a86737",note:"MK4 Nitro Blade hand grinder. Count clicks from zero; 12 clicks per full turn.",info:["Nitro Blade burr","12 clicks/turn","40g jar option","Filter favorite"]},
  "Comandante C40 MK4 Red Clix":{min:0,max:120,step:1,u:"clicks",type:"woodHand",color:"#bf743b",note:"C40 MK4 with Red Clix axle upgrade. It doubles the click resolution, so roughly 2 Red Clix clicks equal 1 standard C40 click.",info:["Red Clix axle","24 clicks/turn","Finer espresso control","C40 compatible"]},
  "Comandante C60 Baracuda":{min:0,max:90,step:1,u:"clicks",type:"metalHand",color:"#4a4d50",note:"Clicks from zero; C60 uses finer adjustment than C40."},
  "Mischeif / Mischief M40":{min:0,max:120,step:1,u:"clicks",type:"woodHand",color:"#7c4a30",note:"Mischief/MisChief Workshop M40, modeled like a Red Clix-style hand grinder."},
  "Timemore Chestnut C3":{min:6,max:34,step:1,u:"clicks",note:"Clicks from closed; avoid grinding at true zero."},
  "Timemore Chestnut S3":{min:0,max:10,step:0.1,u:"dial",note:"Numbered external dial."},
  "1Zpresso K-Ultra":{min:0,max:150,step:1,u:"clicks",note:"100 clicks per rotation; about 1.5 rotations total."},
  "1Zpresso ZP6 Special":{min:0,max:100,step:1,u:"clicks",note:"90 clicks per rotation; filter-focused practical range."},
  "1Zpresso J-Ultra":{min:0,max:500,step:1,u:"clicks",note:"100 clicks per rotation with espresso-friendly fine steps."},
  "Baratza Encore":{min:1,max:40,step:1,u:"setting",note:"40 stepped hopper settings."},
  "Baratza Encore ESP":{min:1,max:40,step:1,u:"setting",note:"Settings 1-20 are espresso resolution; 21-40 are filter."},
  "Baratza Virtuoso+":{min:1,max:40,step:1,u:"setting",note:"40 stepped hopper settings."},
  "DF64 Gen 2":{min:0,max:90,step:0.1,u:"dial",type:"flatElectric",color:"#343536",note:"Stepless numbered ring; burr calibration can shift the range."},
  "MHW-3BOMBER Blade R3":{min:0,max:180,step:1,u:"clicks",type:"blackHand",color:"#151515",note:"Manual grinder; 60 clicks per full turn. Brew settings shown here are internet estimates."},
  "MHW-3BOMBER F74 Navigator":{min:0,max:9,step:0.1,u:"dial",type:"navigator",color:"#151515",note:"Electric grinder with a 0-9 brew scale and 90 markings. Brew settings shown here are internet estimates."}
};

const brewNames={
  espresso:"Espresso",moka:"Moka pot",aeropress:"AeroPress",pourover:"Pour over",
  drip:"Drip machine",frenchpress:"French press",coldbrew:"Cold brew"
};

const brewProfiles={
  espresso:{label:"Fine",note:"Fine grind for short, pressurized extraction."},
  moka:{label:"Fine-medium",note:"Fine-medium grind for stovetop brewing."},
  aeropress:{label:"Medium-fine",note:"Medium-fine is a common starting texture; recipe and filter change the result."},
  pourover:{label:"Medium-fine",note:"Medium-fine is a common starting texture; brewer and filter change the result."},
  drip:{label:"Medium",note:"Medium is a common starting texture for batch brewing."},
  frenchpress:{label:"Medium-coarse",note:"Medium-coarse helps keep immersion brews flowing and easier to press."},
  coldbrew:{label:"Coarse",note:"Coarse is a common starting texture for long immersion."}
};

const roastNotes={
  light:"Light roasts often need more extraction; if the cup tastes sharp or thin, try a finer setting.",
  medium:"Medium roast is a neutral starting point; let taste and brew time guide the next move.",
  dark:"Dark roasts extract readily; if the cup tastes bitter or dry, try a coarser setting."
};

// Official guides are preferred; clearly marked internet estimates fill missing models.
const grinderGuides={
  "Fellow Ode Gen 2":{
    official:true,
    source:"Fellow",
    sourceUrl:"https://help.fellowproducts.com/hc/en-us/articles/29101533994267-How-should-I-dial-in-my-grinder-when-brewing-with-Aiden-Getting-Started-With-Aiden-Pt-3",
    methods:{
      pourover:{display:"3-4.1 dial",range:[3,4.1]},
      drip:{display:"5.33, 8, or 10 dial",start:5.33},
      coldbrew:{display:"8 dial (small batch) or 10 dial (large batch)",start:8}
    }
  },
  "Fellow Opus":{
    official:true,
    source:"Fellow",
    sourceUrl:"https://fellowproducts.com/blogs/brew-talks/fellows-take-on-pb-j-by-brandywine-and-black-white",
    methods:{
      pourover:{display:"4-5.1 dial (inner ring 0)",range:[4,5.1]},
      drip:{display:"6.5, 8, or 10.5 dial",start:6.5},
      coldbrew:{display:"8 dial (small batch) or 10.5 dial (large batch)",start:8}
    }
  },
  "KINGrinder K6":{
    official:true,
    source:"KINGrinder",
    sourceUrl:"https://www.kingrinder.com/_blog",
    methods:{
      espresso:{display:"40 clicks",start:40},
      moka:{display:"60-70 clicks"},
      aeropress:{display:"60-70 clicks"},
      pourover:{display:"100 clicks",start:100},
      frenchpress:{display:"120 clicks",start:120}
    }
  },
  "Comandante C40 MK4":{
    official:true,
    source:"Comandante",
    sourceUrl:"https://comandantegrinder.com/pages/faq",
    methods:{
      espresso:{display:"7-13 clicks",range:[7,13]},
      moka:{display:"14-20 clicks",range:[14,20]},
      pourover:{display:"18-35 clicks",range:[18,35]},
      frenchpress:{display:"25-35 clicks",range:[25,35]}
    }
  },
  "1Zpresso K-Ultra":{
    official:true,
    source:"1Zpresso",
    sourceUrl:"https://1zpresso.coffee/how-to-dial-in-the-perfect-grind-size-for-pour-over-coffee/",
    methods:{pourover:{display:"80-90 clicks",range:[80,90]}}
  },
  "1Zpresso ZP6 Special":{
    official:true,
    source:"1Zpresso",
    sourceUrl:"https://1zpresso.coffee/how-to-dial-in-the-perfect-grind-size-for-pour-over-coffee/",
    methods:{pourover:{display:"40-50 clicks",range:[40,50]}}
  },
  "Baratza Encore":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{pourover:{display:"23 setting (V60)",start:23},aeropress:{display:"12 setting",start:12}}
  },
  "Baratza Encore ESP":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{
      espresso:{display:"1-20 setting",range:[1,20]},
      aeropress:{display:"22 setting",start:22},
      pourover:{display:"25 setting (V60)",start:25},
      frenchpress:{display:"21-40 setting",range:[21,40]},
      coldbrew:{display:"21-40 setting",range:[21,40]}
    }
  },
  "Baratza Virtuoso+":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{pourover:{display:"23 setting (V60)",start:23},aeropress:{display:"12 setting",start:12}}
  },
  "KINGrinder K4":{
    official:false,
    source:"online K4/K6 manual",
    sourceUrl:"https://m.media-amazon.com/images/I/C1Qj7rgBFiL.pdf",
    methods:{
      espresso:{display:"50-60 clicks",range:[50,60]},
      moka:{display:"60-90 clicks",range:[60,90]},
      aeropress:{display:"60-90 clicks",range:[60,90]},
      pourover:{display:"80-100 clicks",range:[80,100]},
      drip:{display:"90-120 clicks",range:[90,120]},
      frenchpress:{display:"140 clicks",start:140},
      coldbrew:{display:"150 clicks",start:150}
    }
  },
  "Comandante C40 MK4 Red Clix":{
    official:false,
    source:"C40 guide translated to Red Clix",
    sourceUrl:"https://www.comandantegrinder.com/downloads/c40_manual_EN.pdf",
    methods:{
      espresso:{display:"14-26 clicks",range:[14,26]},
      moka:{display:"28-40 clicks",range:[28,40]},
      aeropress:{display:"20-50 clicks",range:[20,50]},
      pourover:{display:"36-70 clicks",range:[36,70]},
      drip:{display:"36-70 clicks",range:[36,70]},
      frenchpress:{display:"50-70 clicks",range:[50,70]},
      coldbrew:{display:"60-80 clicks",range:[60,80]}
    }
  },
  "Comandante C60 Baracuda":{
    official:false,
    source:"Honest Coffee Guide",
    sourceUrl:"https://honestcoffeeguide.com/comandante-c60-baracuda-grind-settings/",
    methods:{
      espresso:{display:"10-19 clicks",range:[10,19]},
      moka:{display:"19-33 clicks",range:[19,33]},
      aeropress:{display:"17-48 clicks",range:[17,48]},
      pourover:{display:"21-46 clicks",range:[21,46]},
      drip:{display:"16-45 clicks",range:[16,45]},
      frenchpress:{display:"35-55 clicks",range:[35,55]},
      coldbrew:{display:"41-55 clicks",range:[41,55]}
    }
  },
  "Mischeif / Mischief M40":{
    official:false,
    source:"M40 owner reports",
    sourceUrl:"https://www.reddit.com/r/IndiaCoffee/comments/1jbyl98/mischief_m40_review_part_2/",
    methods:{
      espresso:{display:"10-18 clicks",range:[10,18]},
      moka:{display:"20-30 clicks",range:[20,30]},
      aeropress:{display:"24-34 clicks",range:[24,34]},
      pourover:{display:"30-40 clicks",range:[30,40]},
      drip:{display:"32-45 clicks",range:[32,45]},
      frenchpress:{display:"45-55 clicks",range:[45,55]},
      coldbrew:{display:"55-70 clicks",range:[55,70]}
    }
  },
  "Timemore Chestnut C3":{
    official:false,
    source:"Clicks Coffee",
    sourceUrl:"https://clicks.coffee/grind/timemore-c3",
    methods:{
      espresso:{display:"5-10 clicks",range:[5,10]},
      moka:{display:"10-14 clicks",range:[10,14]},
      aeropress:{display:"13-15 clicks",range:[13,15]},
      pourover:{display:"14-20 clicks",range:[14,20]},
      drip:{display:"17-20 clicks",range:[17,20]},
      frenchpress:{display:"22-24 clicks",range:[22,24]},
      coldbrew:{display:"25-27 clicks",range:[25,27]}
    }
  },
  "Timemore Chestnut S3":{
    official:false,
    source:"online S3 manual",
    sourceUrl:"https://manuals.plus/m/adc494389c0027cfc992d2b970aa80f4c8c7ae1caa65545d69a4846dd6008413",
    methods:{
      espresso:{display:"0-1.0 dial",range:[0,1]},
      moka:{display:"0.5-2.0 dial",range:[0.5,2]},
      aeropress:{display:"2-5 dial",range:[2,5]},
      pourover:{display:"5-8 dial",range:[5,8]},
      drip:{display:"5-8 dial",range:[5,8]},
      frenchpress:{display:"8-9 dial",range:[8,9]},
      coldbrew:{display:"9-10 dial",range:[9,10]}
    }
  },
  "1Zpresso J-Ultra":{
    official:false,
    source:"Honest Coffee Guide",
    sourceUrl:"https://honestcoffeeguide.com/1zpresso-j-ultra-grind-settings/",
    methods:{
      espresso:{display:"74-154 clicks",range:[74,154]},
      moka:{display:"147-268 clicks",range:[147,268]},
      aeropress:{display:"131-390 clicks",range:[131,390]},
      pourover:{display:"167-378 clicks",range:[167,378]},
      drip:{display:"122-365 clicks",range:[122,365]},
      frenchpress:{display:"281-500 clicks",range:[281,500]},
      coldbrew:{display:"326-500 clicks",range:[326,500]}
    }
  },
  "DF64 Gen 2":{
    official:false,
    source:"Honest Coffee Guide",
    sourceUrl:"https://honestcoffeeguide.com/turin-df64-gen-2-grind-settings/",
    methods:{
      espresso:{display:"0-20 dial",range:[0,20]},
      moka:{display:"19-49 dial",range:[19,49]},
      aeropress:{display:"15-80 dial",range:[15,80]},
      pourover:{display:"24-77 dial",range:[24,77]},
      drip:{display:"13-74 dial",range:[13,74]},
      frenchpress:{display:"53-90 dial",range:[53,90]},
      coldbrew:{display:"65-90 dial",range:[65,90]}
    }
  },
  "MHW-3BOMBER Blade R3":{
    official:false,
    source:"online Blade R3 manual",
    sourceUrl:"https://manuals.plus/ae/1005006518152862",
    methods:{
      espresso:{display:"0-10 clicks",range:[0,10]},
      moka:{display:"0-10 clicks",range:[0,10]},
      aeropress:{display:"12-20 clicks",range:[12,20]},
      pourover:{display:"18-25 clicks",range:[18,25]},
      drip:{display:"18-25 clicks",range:[18,25]},
      frenchpress:{display:"25-30 clicks",range:[25,30]},
      coldbrew:{display:"30-35 clicks",range:[30,35]}
    }
  },
  "MHW-3BOMBER F74 Navigator":{
    official:false,
    source:"online F74 manual",
    sourceUrl:"https://manuals.plus/m/ad5fa1f25b8a71c62662b529bb85127e8e5608b0b1a41a62b2b9938ae8dbcdbf",
    methods:{
      espresso:{display:"0-2 dial",range:[0,2]},
      moka:{display:"2-4 dial",range:[2,4]},
      aeropress:{display:"4-5 dial",range:[4,5]},
      pourover:{display:"5-7 dial",range:[5,7]},
      drip:{display:"5-7 dial",range:[5,7]},
      frenchpress:{display:"7-9 dial",range:[7,9]},
      coldbrew:{display:"7-9 dial",range:[7,9]}
    }
  }
};

const fs=document.getElementById("f");
const ts=document.getElementById("t");
const settingInput=document.getElementById("s");
let showAllGrinders=false;
if(fs&&ts&&settingInput){
  Object.keys(grinders).forEach(g=>{
    fs.add(new Option(g,g));
    ts.add(new Option(g,g));
  });
  ts.selectedIndex=1;
}

function clamp(v,min,max){
  return Math.min(max,Math.max(min,v));
}

function getGuide(g,brew){
  return grinderGuides[g]?.methods?.[brew]||null;
}

function guideText(g,brew){
  let guide=getGuide(g,brew);
  return guide?`${guide.display} (${grinderGuides[g].source})`:"No starting point in this reference set";
}

function isOfficialGuide(g){
  return grinderGuides[g]?.official===true;
}

function formatValue(g,v){
  let d=grinders[g];
  let decimals=d.step<1?1:0;
  return `${v.toFixed(decimals)} ${d.u}`;
}

function grinderType(name){
  if(grinders[name].type) return grinders[name].type;
  if(name.includes("Ode")) return "ode";
  if(name.includes("Opus")) return "opus";
  if(name.includes("Baratza")) return "hopper";
  if(name.includes("DF64")) return "flatElectric";
  if(name.includes("KINGrinder")) return "blackHand";
  if(name.includes("1Zpresso")) return "metalHand";
  if(name.includes("Timemore")) return "metalHand";
  return "metalHand";
}

function grinderImage(name){
  let d=grinders[name];
  let color=d.color||"#343536";
  let accent=name.includes("Comandante")||name.includes("Mischief")?"#9a673f":"#18635a";
  let type=grinderType(name);
  let body="";

  if(type==="ode"){
    body=`<rect x="20" y="28" width="112" height="70" rx="5" fill="${color}"/><rect x="92" y="18" width="38" height="14" rx="3" fill="#9ca3a6"/><circle cx="50" cy="62" r="26" fill="#111"/><line x1="50" y1="62" x2="67" y2="45" stroke="#fff" stroke-width="3"/><rect x="50" y="98" width="58" height="36" rx="4" fill="#202020"/><rect x="28" y="134" width="90" height="10" rx="4" fill="#111"/>`;
  }else if(type==="opus"){
    body=`<rect x="47" y="24" width="66" height="22" rx="4" fill="${color}"/><rect x="43" y="44" width="74" height="70" rx="8" fill="${color}"/><rect x="51" y="112" width="58" height="38" rx="6" fill="#202020"/><rect x="36" y="148" width="88" height="10" rx="4" fill="#111"/><line x1="51" y1="36" x2="109" y2="36" stroke="#d8d8d8" stroke-width="2"/>`;
  }else if(type==="hopper"){
    body=`<path d="M48 18h64l-10 38H58z" fill="#8f989d"/><rect x="42" y="54" width="76" height="88" rx="8" fill="${color}"/><circle cx="80" cy="86" r="25" fill="#191919"/><rect x="54" y="142" width="52" height="16" rx="4" fill="#222"/>`;
  }else if(type==="flatElectric"){
    body=`<path d="M52 22h56l-6 28H58z" fill="#9ca3a6"/><rect x="30" y="50" width="100" height="72" rx="7" fill="${color}"/><circle cx="54" cy="84" r="24" fill="#151515"/><rect x="66" y="122" width="50" height="30" rx="5" fill="#202020"/><rect x="24" y="152" width="112" height="8" rx="4" fill="#111"/>`;
  }else if(type==="navigator"){
    body=`<rect x="32" y="58" width="96" height="50" rx="5" fill="${color}"/><path d="M86 108h34l18 42H100z" fill="#202020"/><circle cx="44" cy="82" r="25" fill="#111"/><rect x="48" y="24" width="28" height="34" rx="5" fill="#111"/><rect x="42" y="108" width="34" height="42" rx="5" fill="#1f1f1f"/><line x1="24" y1="82" x2="64" y2="82" stroke="${accent}" stroke-width="3"/>`;
  }else{
    body=`<rect x="56" y="38" width="48" height="88" rx="9" fill="${color}"/><rect x="58" y="28" width="44" height="16" rx="6" fill="#222"/><rect x="58" y="126" width="44" height="26" rx="6" fill="#292929"/><path d="M80 29 C104 18, 116 28, 127 40" fill="none" stroke="#757575" stroke-width="7" stroke-linecap="round"/><circle cx="133" cy="43" r="13" fill="${accent}"/><line x1="58" y1="58" x2="102" y2="58" stroke="#dedede" stroke-width="2"/><line x1="80" y1="50" x2="80" y2="66" stroke="${accent}" stroke-width="3"/>`;
  }

  let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" role="img" aria-label="${name}"><rect width="160" height="170" rx="10" fill="#f4eee8"/>${body}<text x="80" y="166" text-anchor="middle" font-family="Arial" font-size="11" fill="#6e625b">${name.split(" ")[0]}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function brewIcon(key){
  const stroke="currentColor";
  const common=`fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
  const icons={
    espresso:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M12 22h21v5a10 10 0 0 1-10 10h-1a10 10 0 0 1-10-10z"/><path ${common} d="M33 24h3a4 4 0 0 1 0 8h-3"/><path ${common} d="M10 39h28"/><path ${common} d="M18 10v5M24 8v7M30 10v5"/></svg>`,
    moka:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M17 8h14l3 10H14z"/><path ${common} d="M15 18h18l3 21H12z"/><path ${common} d="M16 28h17"/><path ${common} d="M35 21h4v12h-4"/><path ${common} d="M20 8l-2-4h12l-2 4"/></svg>`,
    aeropress:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M16 7h16v28H16z"/><path ${common} d="M13 35h22v6H13z"/><path ${common} d="M19 13h10M19 20h10M19 27h10"/></svg>`,
    pourover:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M14 15h20l-5 18H19z"/><path ${common} d="M17 15l7-8 7 8"/><path ${common} d="M16 37h16"/><path ${common} d="M20 22h8"/></svg>`,
    drip:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect ${common} x="12" y="7" width="24" height="28" rx="4"/><path ${common} d="M18 15h12M19 35v6h10v-6"/><path ${common} d="M24 20v5"/><path ${common} d="M20 29h8"/></svg>`,
    frenchpress:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M17 15h14v24H17z"/><path ${common} d="M14 39h20"/><path ${common} d="M24 6v27"/><path ${common} d="M18 10h12"/><path ${common} d="M15 20h18"/><path ${common} d="M31 22h4v9h-4"/></svg>`,
    coldbrew:`<svg viewBox="0 0 48 48" aria-hidden="true"><path ${common} d="M17 10h14l2 29H15z"/><path ${common} d="M18 10l2-5h8l2 5"/><path ${common} d="M18 26h12"/><path ${common} d="M21 20l6 12M27 20l-6 12"/></svg>`
  };
  return icons[key]||icons.pourover;
}

function scaleText(g){
  let d=grinders[g];
  return `${d.min}-${d.max} ${d.u}. ${d.note}`;
}

function infoChips(g){
  let items=grinders[g].info||[];
  return items.map(item=>`<span class="fact">${item}</span>`).join("");
}

function updateGrinderVisuals(){
  document.getElementById("fromImg").src=grinderImage(fs.value);
  document.getElementById("fromImg").alt=fs.value;
  document.getElementById("fromName").textContent=fs.value;
  document.getElementById("fromMeta").textContent=scaleText(fs.value);
  document.getElementById("fromInfo").innerHTML=infoChips(fs.value);
  document.getElementById("toImg").src=grinderImage(ts.value);
  document.getElementById("toImg").alt=ts.value;
  document.getElementById("toName").textContent=ts.value;
  document.getElementById("toMeta").textContent=scaleText(ts.value);
  document.getElementById("toInfo").innerHTML=infoChips(ts.value);
}

function syncSettingInput(){
  let d=grinders[fs.value];
  settingInput.min=d.min;
  settingInput.max=d.max;
  settingInput.step=d.step;
  settingInput.value=clamp(parseFloat(settingInput.value)||d.min,d.min,d.max).toFixed(d.step<1?1:0);
  document.getElementById("settingHelp").innerHTML=`Range: <b>${d.min}-${d.max} ${d.u}</b>. ${d.note}`;
  calc();
}

function applyPreset(brew){
  let d=grinders[fs.value];
  document.getElementById("brew").value=brew;
  let guide=getGuide(fs.value,brew);
  if(guide?.start!==undefined){
    settingInput.value=guide.start.toFixed(d.step<1?1:0);
  }
  calc();
}

function toggleOtherGrinders(){
  showAllGrinders=!showAllGrinders;
  calc();
}

function calc(){
  let setting=parseFloat(settingInput.value);
  if(Number.isNaN(setting)) return;
  let fromData=grinders[fs.value];
  setting=clamp(setting,fromData.min,fromData.max);
  let roast=document.getElementById("roast").value;
  let brew=document.getElementById("brew").value;
  let profile=brewProfiles[brew];
  let fromGuide=getGuide(fs.value,brew);
  let targetGuide=getGuide(ts.value,brew);
  let sameGrinder=fs.value===ts.value;
  let targetOfficial=isOfficialGuide(ts.value);
  let targetShown=sameGrinder?formatValue(ts.value,setting):targetGuide?targetGuide.display:"Use grinder's own guide";
  let resultBox=document.querySelector(".live-result");
  resultBox.classList.toggle("estimated-result",!sameGrinder&&Boolean(targetGuide)&&!targetOfficial);

  document.getElementById("micron").textContent=formatValue(fs.value,setting);
  document.getElementById("targetLine").innerHTML=`${ts.value}: <b>${targetShown}</b>${targetGuide&&!sameGrinder?` <span class="sub">(${grinderGuides[ts.value].source})</span>`:""}`;
  document.getElementById("toSetting").textContent=targetShown;
  document.getElementById("toSettingNote").textContent=sameGrinder?"Same grinder setting":targetGuide?(targetOfficial?"Official published starting point":"Caution: internet estimate, not official"):"No cross-grinder reference available";
  document.getElementById("suggestion").textContent=profile.label;
  document.getElementById("suggestionText").textContent=`${brewNames[brew]}: ${profile.note} ${roastNotes[roast]}`;

  let statusBox=document.getElementById("status");
  let statusKind="";
  let statusText="";
  let fromOfficial=isOfficialGuide(fs.value);
  let fromGuideType=fromOfficial?"published":"internet-estimated";
  if(sameGrinder&&fromGuide?.range){
    if(setting<fromGuide.range[0]){
      statusKind="warn";
      statusText=`Your setting is finer than the ${fromGuideType} ${brewNames[brew]} starting range for ${fs.value}.`;
    }else if(setting>fromGuide.range[1]){
      statusKind="warn";
      statusText=`Your setting is coarser than the ${fromGuideType} ${brewNames[brew]} starting range for ${fs.value}.`;
    }else{
      statusText=`Your setting is inside the ${fromGuideType} ${brewNames[brew]} starting range for ${fs.value}.`;
    }
  }else if(!sameGrinder&&targetGuide){
    statusKind=targetOfficial?"":"warn";
    statusText=`${targetOfficial?"Start":"Caution: start"} at ${guideText(ts.value,brew)} on ${ts.value}, then adjust by taste and brew time.${targetOfficial?"":" This is an internet estimate, not an official setting."}`;
  }else if(!sameGrinder){
    statusKind="warn";
    statusText=`There is no ${brewNames[brew]} starting point for ${ts.value} in this reference set. Check that grinder's own guide.`;
  }else if(fromGuide){
    statusText=`Use ${guideText(fs.value,brew)} as a starting point, then adjust by taste.`;
  }else{
    statusKind="warn";
    statusText=`There is no ${brewNames[brew]} starting point for ${fs.value} in this reference set.`;
  }
  let action=fromGuide?.start!==undefined?` <button class="secondary" onclick="applyPreset('${brew}')">Use ${brewNames[brew]} start</button>`:"";
  statusBox.className=`status ${statusKind}`;
  statusBox.innerHTML=`${statusText}${action}`;
  updateGrinderVisuals();

  let tableBody=document.getElementById("tb");
  tableBody.innerHTML="";
  const priority=["Fellow Ode Gen 2","Fellow Opus","KINGrinder K6"];
  const ordered=[...priority,...Object.keys(grinders).filter(g=>!priority.includes(g))];
  ordered.forEach((g,index)=>{
    if(index>=3&&!showAllGrinders) return;
    let d=grinders[g];
    let guide=getGuide(g,brew);
    let shown=guide?`${guide.display}<span class="guide-origin ${isOfficialGuide(g)?"":"estimate"}">${isOfficialGuide(g)?"Official":"Internet estimate"} · ${grinderGuides[g].source}</span>`:"No starting point";
    tableBody.innerHTML+=`<tr><td><img class="thumb" src="${grinderImage(g)}" alt="">${g}</td><td>${shown}</td><td>${d.min}-${d.max} ${d.u}</td></tr>`;
  });
  let toggle=document.getElementById("toggleMore");
  toggle.textContent=showAllGrinders?"Hide other grinders":"Show other grinders";

  let quick=document.getElementById("quickRanges");
  quick.innerHTML="";
  Object.keys(brewNames).forEach(key=>{
    let item=document.createElement("button");
    item.type="button";
    item.className="chip";
    item.onclick=()=>applyPreset(key);
    let guide=getGuide(fs.value,key);
    item.title=guide?`Use the ${fs.value} starting point for ${brewNames[key]}`:`No ${brewNames[key]} starting point for ${fs.value}`;
    item.innerHTML=`<span class="brew-icon">${brewIcon(key)}</span><span><span class="chip-title">${brewNames[key]}</span><span class="chip-range">${guide?guide.display:"No guide"}</span></span>`;
    quick.appendChild(item);
  });
}

if(fs&&ts&&settingInput){
  syncSettingInput();
}

const filterButtons = document.querySelectorAll(".filter-button");
const typeButtons = document.querySelectorAll(".type-button");
const beanCards = document.querySelectorAll(".bean-card");
let activeTasteFilter = "all";
let activeTypeFilter = "all";

function applyBeanFilters() {
  beanCards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const type = card.dataset.type || "";
    const tasteMatch = activeTasteFilter === "all" || tags.includes(activeTasteFilter);
    const typeMatch = activeTypeFilter === "all" || type === activeTypeFilter;

    card.classList.toggle("is-hidden", !tasteMatch || !typeMatch);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTasteFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyBeanFilters();
  });
});

typeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTypeFilter = button.dataset.typeFilter;
    typeButtons.forEach((item) => item.classList.toggle("active", item === button));
    applyBeanFilters();
  });
});
