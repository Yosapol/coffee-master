const grinders={
  "Fellow Ode Gen 2":{min:1,max:11,step:1/3,decimals:2,u:"dial",note:"11 numbered settings with two tick marks between numbers (31 steps total). Fellow says it is not intended for espresso."},
  "Fellow Opus":{min:1,max:11,step:0.25,u:"outer dial",note:"Outer ring is 1-11 with quarter-step marks; inner ring is not modeled."},
  "KINGrinder K6":{min:0,max:240,step:1,u:"clicks",note:"Clicks from burr touch / zero."},
  "KINGrinder K4":{min:0,max:240,step:1,u:"clicks",note:"Clicks from burr touch / zero."},
  "Comandante C40 MK4":{min:0,max:60,step:1,u:"clicks",type:"woodHand",color:"#a86737",note:"MK4 Nitro Blade hand grinder. Count clicks from zero; 12 clicks per full turn.",info:["Nitro Blade burr","12 clicks/turn","40g jar option","Filter favorite"]},
  "Comandante C40 MK4 Red Clix":{min:0,max:120,step:1,u:"clicks",type:"woodHand",color:"#bf743b",note:"C40 MK4 with Red Clix axle upgrade. It doubles the click resolution, so roughly 2 Red Clix clicks equal 1 standard C40 click.",info:["Red Clix axle","24 clicks/turn","Finer espresso control","C40 compatible"]},
  "Comandante C60 Baracuda":{min:0,max:90,step:1,u:"clicks",type:"metalHand",color:"#4a4d50",note:"Clicks from zero; C60 uses finer adjustment than C40."},
  "Mischeif / Mischief M40":{min:0,max:120,step:1,u:"clicks",type:"woodHand",color:"#7c4a30",note:"Mischief/MisChief Workshop M40, modeled like a Red Clix-style hand grinder."},
  "Timemore Chestnut C3":{min:5,max:34,step:1,u:"clicks",note:"Clicks from closed; avoid grinding at true zero."},
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

const inferredBrewBands={
  espresso:[0.05,0.17],
  moka:[0.16,0.30],
  aeropress:[0.27,0.43],
  pourover:[0.38,0.55],
  drip:[0.47,0.64],
  frenchpress:[0.66,0.82],
  coldbrew:[0.82,0.95]
};

const roastNotes={
  light:"Light roasts often need more extraction; if the cup tastes sharp or thin, try a finer setting.",
  medium:"Medium roast is a neutral starting point; let taste and brew time guide the next move.",
  dark:"Dark roasts extract readily; if the cup tastes bitter or dry, try a coarser setting."
};

// Starting points combine manufacturer references, community reports, and cautious estimates.
const grinderGuides={
  "Fellow Ode Gen 2":{
    official:true,
    source:"Fellow",
    sourceUrl:"https://help.fellowproducts.com/hc/en-us/articles/29101533994267-How-should-I-dial-in-my-grinder-when-brewing-with-Aiden-Getting-Started-With-Aiden-Pt-3",
    methods:{
      pourover:{
        display:"4-6 dial (community range; start near 5)",
        range:[4,6],
        official:false,
        community:true,
        source:"r/pourover community thread",
        sourceUrl:"https://www.reddit.com/r/pourover/comments/1m8fj2c/fellow_ode_2_whats_your_recipe_and_grind_setting/"
      },
      drip:{display:"5.33, 8, or 10 dial",start:5.33},
      coldbrew:{display:"8 dial (small batch) or 10 dial (large batch)",start:8}
    }
  },
  "Fellow Opus":{
    official:true,
    source:"Fellow",
    sourceUrl:"https://fellowproducts.com/blogs/brew-talks/fellows-take-on-pb-j-by-brandywine-and-black-white",
    methods:{
      pourover:{display:"6.5-9 dial (community range)",range:[6.5,9],official:false,community:true,source:"r/pourover Opus owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/16ptzi0/fellow_opus_settings/"},
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
      moka:{display:"60-70 clicks",range:[60,70]},
      aeropress:{display:"60-70 clicks",range:[60,70]},
      pourover:{display:"85-100 clicks (community range)",range:[85,100],official:false,community:true,source:"r/pourover K6 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/wkq1vu/kingrinder_k6_grind_settings/"},
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
      pourover:{display:"16-35 clicks (community range)",range:[16,35],official:false,community:true,source:"r/pourover C40 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/uz1iab/comandante_c40_mk3_vs_mk4_clicks/"},
      frenchpress:{display:"25-35 clicks",range:[25,35]}
    }
  },
  "1Zpresso K-Ultra":{
    official:true,
    source:"1Zpresso",
    sourceUrl:"https://1zpresso.coffee/how-to-dial-in-the-perfect-grind-size-for-pour-over-coffee/",
    methods:{pourover:{display:"60-85 clicks (community range)",range:[60,85],official:false,community:true,source:"r/pourover K-Ultra owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/1d7lao4/for_those_who_use_the_k_ultra_what_are_your_grind/"}}
  },
  "1Zpresso ZP6 Special":{
    official:true,
    source:"1Zpresso",
    sourceUrl:"https://1zpresso.coffee/how-to-dial-in-the-perfect-grind-size-for-pour-over-coffee/",
    methods:{pourover:{display:"45-60 clicks (community range)",range:[45,60],official:false,community:true,source:"r/pourover ZP6 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/142mbpw/help_with_zp6_special/"}}
  },
  "Baratza Encore":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{pourover:{display:"12-20 setting (community range)",range:[12,20],official:false,community:true,source:"r/pourover Encore owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/166e19x/encore_grind_size/"},aeropress:{display:"12 setting",start:12}}
  },
  "Baratza Encore ESP":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{
      espresso:{display:"1-20 setting",range:[1,20]},
      aeropress:{display:"22 setting",start:22},
      pourover:{display:"22-28 setting (community range)",range:[22,28],official:false,community:true,source:"r/pourover Encore ESP owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/1aitxpp/grind_settings_on_encore_esp/"},
      frenchpress:{display:"21-40 setting",range:[21,40]},
      coldbrew:{display:"21-40 setting",range:[21,40]}
    }
  },
  "Baratza Virtuoso+":{
    official:true,
    source:"Baratza",
    sourceUrl:"https://www.baratza.com/en-us/blog/brew-guides/hario-v60-brew-guide",
    methods:{pourover:{display:"17-23 setting (community range)",range:[17,23],official:false,community:true,source:"r/pourover Virtuoso+ owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/meqx7w/virtuoso_grind_settings_for_the_james/"},aeropress:{display:"12 setting",start:12}}
  },
  "KINGrinder K4":{
    official:false,
    source:"online K4/K6 manual",
    sourceUrl:"https://m.media-amazon.com/images/I/C1Qj7rgBFiL.pdf",
    methods:{
      espresso:{display:"50-60 clicks",range:[50,60]},
      moka:{display:"60-90 clicks",range:[60,90]},
      aeropress:{display:"60-90 clicks",range:[60,90]},
      pourover:{display:"90-110 clicks (community range)",range:[90,110],community:true,source:"Reddit K4 owner comparison",sourceUrl:"https://www.reddit.com/r/espresso/comments/15n5yw4/ive_used_both_kingrinders_k4_and_k6_for_the_last/"},
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
      pourover:{display:"30-50 clicks (community range)",range:[30,50],community:true,source:"r/CoffeePH M40 owners",sourceUrl:"https://www.reddit.com/r/CoffeePH/comments/1pqfndh/mischief_m40/"},
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
      pourover:{display:"14-24 clicks (community range)",range:[14,24],community:true,source:"r/pourover C3 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/ytbdl1/v60_timemore_c3_click_for_46_method/"},
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
      pourover:{display:"5-6.5 dial (community range)",range:[5,6.5],community:true,source:"r/pourover S3 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/1ujqsye/grind_settings_with_timemore_s3/"},
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
      pourover:{display:"45-75 dial (community range)",range:[45,75],community:true,source:"Reddit DF64 Gen 2 owners",sourceUrl:"https://www.reddit.com/r/DF64/comments/18zeu7q/df64_gen_2_pour_over_grind_setting/"},
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
      pourover:{display:"90-95 clicks (community range)",range:[90,95],community:true,source:"r/pourover Blade R3 owners",sourceUrl:"https://www.reddit.com/r/pourover/comments/1i2kzmo/mhw3bomber_blader3_an_unbiased_review/"},
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

function guideMeta(g,brew){
  let guideSet=grinderGuides[g];
  let explicit=guideSet?.methods?.[brew];
  if(explicit){
    return {
      guide:explicit,
      official:explicit.official===undefined?guideSet.official===true:explicit.official===true,
      inferred:false,
      community:explicit.community===true,
      source:explicit.source||guideSet.source,
      sourceUrl:explicit.sourceUrl||guideSet.sourceUrl||null
    };
  }

  let d=grinders[g];
  let band=inferredBrewBands[brew]||inferredBrewBands.pourover;
  let low=roundToGrinderStep(g,d.min+(band[0]*(d.max-d.min)));
  let high=roundToGrinderStep(g,d.min+(band[1]*(d.max-d.min)));
  return {
    guide:{
      display:`${formatNumber(g,low)}-${formatNumber(g,high)} ${d.u}`,
      range:[Math.min(low,high),Math.max(low,high)],
      inferred:true
    },
    official:false,
    inferred:true,
    community:false,
    source:"Common brew-range inference",
    sourceUrl:null
  };
}

function getGuide(g,brew){
  return guideMeta(g,brew).guide;
}

function guideText(g,brew){
  let meta=guideMeta(g,brew);
  return `${meta.guide.display} (${meta.source})`;
}

function isOfficialGuide(g,brew){
  return guideMeta(g,brew).official;
}

function stepDecimals(step){
  let text=String(step);
  if(text.includes("e-")) return parseInt(text.split("e-")[1],10);
  return (text.split(".")[1]||"").length;
}

function roundToGrinderStep(g,v){
  let d=grinders[g];
  let steps=Math.round((clamp(v,d.min,d.max)-d.min)/d.step);
  return clamp(d.min+(steps*d.step),d.min,d.max);
}

function formatNumber(g,v){
  let d=grinders[g];
  return roundToGrinderStep(g,v).toFixed(d.decimals??stepDecimals(d.step));
}

function formatValue(g,v){
  let d=grinders[g];
  return `${formatNumber(g,v)} ${d.u}`;
}

function guideCenter(g,brew){
  let guide=getGuide(g,brew);
  if(guide.range) return (guide.range[0]+guide.range[1])/2;
  if(guide.start!==undefined) return guide.start;
  return (grinders[g].min+grinders[g].max)/2;
}

function recommendedBounds(g,brew){
  let guide=getGuide(g,brew);
  let d=grinders[g];
  if(guide.range){
    return [
      roundToGrinderStep(g,Math.min(...guide.range)),
      roundToGrinderStep(g,Math.max(...guide.range))
    ];
  }
  if(guide.start!==undefined){
    let tolerance=Math.max(d.step*2,(d.max-d.min)*0.04);
    return [
      roundToGrinderStep(g,guide.start-tolerance),
      roundToGrinderStep(g,guide.start+tolerance)
    ];
  }
  return null;
}

function convertSetting(fromName,toName,setting,brew,roast){
  let fromData=grinders[fromName];
  let toData=grinders[toName];
  let sourceRange=fromData.max-fromData.min;
  let position=sourceRange===0?0:clamp((setting-fromData.min)/sourceRange,0,1);
  let targetRange=toData.max-toData.min;
  let mapped=toData.min+(position*targetRange);
  let sourceGuidePosition=sourceRange===0?0.5:clamp((guideCenter(fromName,brew)-fromData.min)/sourceRange,0,1);
  let mappedSourceGuide=toData.min+(sourceGuidePosition*targetRange);
  let guideOffset=(guideCenter(toName,brew)-mappedSourceGuide)*0.35;
  let brewFractions={
    espresso:-0.04,
    moka:-0.026,
    aeropress:-0.013,
    pourover:0,
    drip:0.013,
    frenchpress:0.026,
    coldbrew:0.04
  };
  let brewShift=(brewFractions[brew]||0)*targetRange;
  let roastFractions={light:-0.025,medium:0,dark:0.025};
  let roastShift=(roastFractions[roast]||0)*targetRange;
  let adjusted=mapped+guideOffset+brewShift+roastShift;
  return {
    kind:fromName===toName&&roast==="medium"?"same":"guided",
    value:roundToGrinderStep(toName,adjusted),
    position,
    guideOffset,
    brewShift,
    roastShift
  };
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

// Shared calculation data and convertSetting above are preserved from the original tool.
let grinderMode='start';
const context=CoffeeContext;
const field=id=>document.getElementById(id);
const initialContext=context.get();
if(initialContext.brew)field('brew').value=initialContext.brew;
if(initialContext.roast)field('roast').value=['light','medium','dark'].includes(initialContext.roast)?initialContext.roast:'';
function sourceKind(meta){return meta.community?'Community reference':meta.inferred?'Inferred estimate':meta.official?'Manufacturer reference':'Online reference';}
function syncSettingInput(){
  const data=grinders[fs.value];settingInput.min=data.min;settingInput.max=data.max;settingInput.step='any';
  field('settingHelp').textContent=`Range: ${data.min}–${data.max} ${data.u}. Values are rounded to this grinder’s adjustment steps.`;
  calc();
}
function updateMode(mode){
  grinderMode=mode;field('conversion-fields').hidden=mode!=='convert';
  field('mode-start').setAttribute('aria-pressed',String(mode==='start'));
  field('mode-convert').setAttribute('aria-pressed',String(mode==='convert'));
  field('from-label').textContent=mode==='start'?'Your grinder':'From grinder';calc();
}
function guidePresetValue(g,brew){return guideCenter(g,brew);}
function applyPreset(brew){field('brew').value=brew;context.update({brew});CoffeeCup.choose({brew});calc();}
function toggleOtherGrinders(){showAllGrinders=!showAllGrinders;renderReferences();}
function renderReferences(){
  const brew=field('brew').value;field('tb').replaceChildren();
  field('toggleMore').hidden=!brew;field('toggleMore').textContent=showAllGrinders?'Hide other grinders':'Show other grinders';
  if(!brew)return;
  const priority=[fs.value,ts.value,'Fellow Ode Gen 2','Fellow Opus','KINGrinder K6'];
  const names=[...new Set([...priority,...Object.keys(grinders)])];
  names.slice(0,showAllGrinders?names.length:3).forEach(name=>{
    const meta=guideMeta(name,brew),g=grinders[name],row=document.createElement('tr');
    const unsupported=name==='Fellow Ode Gen 2'&&brew==='espresso';
    const source=meta.sourceUrl?`<a href="${meta.sourceUrl}" target="_blank" rel="noopener noreferrer">${meta.source}</a>`:meta.source;
    row.innerHTML=`<td><img class="thumb" src="${grinderImage(name)}" alt="">${name}</td><td>${unsupported?'Not intended for espresso':meta.guide.display}<span class="guide-origin">${unsupported?'Grinder compatibility note':sourceKind(meta)+' · '+source}</span></td><td>${g.min}–${g.max} ${g.u}</td>`;
    field('tb').append(row);
  });
}
function calc(){
  const brew=field('brew').value,roast=field('roast').value,data=grinders[fs.value];
  field('fromImg').src=grinderImage(fs.value);field('fromImg').alt=fs.value;field('fromMeta').textContent=scaleText(fs.value);
  field('toImg').src=grinderImage(ts.value);field('toImg').alt=ts.value;field('toMeta').textContent=scaleText(ts.value);
  const roastContext=context.get().roast,rangeRoast=roastContext?.includes('-');
  field('roast-context').hidden=!rangeRoast;
  field('roast-context').textContent=rangeRoast?`Your suggested coffee is ${context.labels.roast[roastContext].toLowerCase()}. Choose the roast level printed on your bag.`:'';
  const quick=field('quickRanges');quick.innerHTML=Object.entries(brewNames).map(([key,label])=>`<button class="chip" type="button" data-brew="${key}" aria-pressed="${key===brew}">${label}</button>`).join('');
  field('grinder-facts').innerHTML=`${infoChips(fs.value)}${grinderMode==='convert'?infoChips(ts.value):''}`;
  field('roast-guidance').textContent=roast?roastNotes[roast]:'Choose a roast level to see taste-aware guidance.';
  field('conversion-explanation').textContent='Conversions retain the original tool’s scale mapping, guide offset, brew adjustment, and roast adjustment. They cannot account for every grinder calibration.';
  renderReferences();
  let error='';
  if(grinderMode==='convert'){
    const entered=settingInput.valueAsNumber;
    if(settingInput.value.trim()===''||!Number.isFinite(entered))error='Enter a current grinder setting to see a fresh conversion.';
    else if(entered<data.min||entered>data.max)error=`Use a setting between ${data.min} and ${data.max} ${data.u} for this grinder.`;
  }
  settingInput.setAttribute('aria-invalid',String(Boolean(error)));field('setting-error').textContent=error;
  const box=field('grinder-result');
  if(error||!brew||!roast){
    box.innerHTML=`<p class="eyebrow">YOUR NEXT STEP</p><h2>${error?'Check your setting':'Make it your own.'}</h2><p>${error||(!brew?'Choose your brew method to see a starting point.':'Choose the roast level printed on your bag.')}</p>`;return;
  }
  if(brew==='espresso'&&(fs.value==='Fellow Ode Gen 2'||(grinderMode==='convert'&&ts.value==='Fellow Ode Gen 2'))){box.innerHTML='<p class="eyebrow">A DIFFERENT PAIRING</p><h2>Choose an espresso grinder.</h2><p>Fellow Ode Gen 2 is not intended for espresso. Choose another grinder or a filter method to see a useful starting point.</p>';return;}
  const name=grinderMode==='start'?fs.value:ts.value,meta=guideMeta(name,brew),bounds=recommendedBounds(name,brew);
  let value,description,resultHint='';
  if(grinderMode==='start'){
    const qualifier=meta.guide.display.match(/\s*\((.*?)\)\s*$/);
    value=meta.guide.display.replace(/\s*\(.*?\)\s*$/,'');
    resultHint=qualifier?qualifier[1]:'';
    description=`This is the ${sourceKind(meta).toLowerCase()} for ${name} and ${brewNames[brew]}. ${roastNotes[roast]}`;
  }else{
    const setting=roundToGrinderStep(fs.value,settingInput.valueAsNumber),conversion=convertSetting(fs.value,ts.value,setting,brew,roast);
    value=formatValue(name,conversion.value);
    const outside=bounds&&(conversion.value<bounds[0]-grinders[name].step/2||conversion.value>bounds[1]+grinders[name].step/2);
    description=`From ${formatValue(fs.value,setting)} on ${fs.value}. ${outside?'Outside':'Within'} the reference range${bounds?': '+formatValue(name,bounds[0])+' to '+formatValue(name,bounds[1]):''}. This is an approximate conversion; brew once and adjust by taste.`;
  }
  const source=meta.sourceUrl?`<a href="${meta.sourceUrl}" target="_blank" rel="noopener noreferrer">${meta.source} ↗</a>`:meta.source;
  const recipeLink=brew==='pourover'?`<a class="button" href="${context.link('recipes.html')}">Explore filter recipes ↗</a>`:`<a class="button" href="${context.link('brewing.html')}${brew==='drip'?'':'#'+brew}">Explore brewing guidance ↗</a>`;
  box.innerHTML=`<p class="eyebrow">${grinderMode==='start'?'YOUR STARTING POINT':'YOUR APPROXIMATE CONVERSION'}</p><h2>${name}</h2><span id="toSetting" class="result-value">${value}</span><p class="hint">${resultHint}</p><span class="source-badge">${sourceKind(meta)}</span><p class="source-line">${source}</p><p id="toSettingNote">${description}</p><p class="hint">${brewProfiles[brew].label} · ${brewNames[brew]} · ${context.labels.roast[roast]}</p><div class="next-actions">${recipeLink}<a class="button" href="${context.link('dial-in.html')}">Help with the taste ↗</a></div>`;
 const save=document.createElement('button');save.type='button';save.className='button cup-save';save.textContent='Use for my cup';
  const snapshot={mode:grinderMode,from:fs.value,to:name,brew,roast,value,kind:sourceKind(meta),source:meta.source,input:grinderMode==='convert'?settingInput.valueAsNumber:null};
  save.addEventListener('click',()=>CoffeeCup.saveGrind(snapshot));box.append(save);
}
field('mode-start').addEventListener('click',()=>updateMode('start'));
field('mode-convert').addEventListener('click',()=>updateMode('convert'));
fs.addEventListener('change',syncSettingInput);ts.addEventListener('change',calc);settingInput.addEventListener('input',calc);
settingInput.addEventListener('blur',()=>{const value=settingInput.valueAsNumber,d=grinders[fs.value];if(Number.isFinite(value)&&value>=d.min&&value<=d.max){settingInput.value=formatNumber(fs.value,value);}});
for(const id of ['brew','roast'])field(id).addEventListener('change',()=>{context.update({[id]:field(id).value||null});CoffeeCup.choose({[id]:field(id).value||null});calc();});
field('quickRanges').addEventListener('click',e=>{const button=e.target.closest('[data-brew]');if(button)applyPreset(button.dataset.brew);});
field('toggleMore').addEventListener('click',toggleOtherGrinders);
document.addEventListener('coffee-context-clear',()=>{field('brew').value='';field('roast').value='medium';calc();field('brew').focus();});
const savedGrind=CoffeeCup.get().grind;
if(savedGrind){fs.value=savedGrind.from;ts.value=savedGrind.to;if(savedGrind.input!==null)settingInput.value=savedGrind.input;updateMode(savedGrind.mode);}
syncSettingInput();

document.addEventListener('coffee-cup-restored',()=>{const s=CoffeeCup.get();field('brew').value=s.brew||'';field('roast').value=s.roast||'';if(s.grind){fs.value=s.grind.from;ts.value=s.grind.to;settingInput.value=s.grind.input??'';updateMode(s.grind.mode);}syncSettingInput();});
