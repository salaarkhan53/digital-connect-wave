const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:4000';
const shots=[
  ['/industries/insurance/','ind', 'p', 'Insurance is the vertical'],
  ['/compliance/','comp', 'h2', 'What we are not claiming'],
  ['/about/','cta', 'h2', "Let's talk outcomes"],
];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [path,tag,sel,text] of shots){
    const p=await b.newPage({viewport:{width:1440,height:900}});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<50;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(45); }
    await p.waitForTimeout(700);
    await p.evaluate(({sel,text})=>{
      const el=[...document.querySelectorAll(sel)].find(e=>e.textContent.includes(text));
      if(!el) return;
      const y=window.scrollY+el.getBoundingClientRect().top-150;
      window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y);
    },{sel,text});
    await p.waitForTimeout(1200);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/fx-${tag}.png`});
    console.log(tag,'captured');
    await p.close();
  }
  await b.close();
})();
