const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3903';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h,tag] of [[1366,768,'short'],[1440,900,'tall'],[390,844,'phone']]){
    const p=await b.newPage({viewport:{width:w,height:h}});
    await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<60;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(45); }
    await p.waitForTimeout(600);
    await p.evaluate(()=>{const s=document.querySelector('#process');
      const y=window.scrollY+s.getBoundingClientRect().top+40;
      window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y);});
    await p.waitForTimeout(1200);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/pv-${tag}.png`});
    const mode=await p.evaluate(()=>{
      const sec=document.querySelector('#process');
      const desktop=[...sec.children].find(c=>c.className.includes('hidden'));
      return desktop && desktop.getBoundingClientRect().width>0 ? 'pinned scene' : 'stacked list';
    });
    console.log(`${w}x${h}`.padEnd(10), mode);
    await p.close();
  }
  await b.close();
})();
