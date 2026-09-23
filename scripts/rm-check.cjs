const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const rm of ['reduce','no-preference']){
    const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:rm});
    const p=await ctx.newPage();
    await p.goto((process.env.URL||'http://localhost:3000/'),{waitUntil:'networkidle',timeout:60000});
    await p.waitForTimeout(2500);
    const r=await p.evaluate(()=>{
      const els=[...document.querySelectorAll('[data-reveal]')];
      return {
        total:els.length,
        visibleNoScroll:els.filter(e=>parseFloat(getComputedStyle(e).opacity)>0.9).length,
        canvases:document.querySelectorAll('canvas').length,
        marqueeState:(()=>{const m=document.querySelector('[class*=marquee]');
          return m?getComputedStyle(m).animationName+'/'+getComputedStyle(m).animationDuration:'n/a';})(),
      };
    });
    console.log(rm.padEnd(15), JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
