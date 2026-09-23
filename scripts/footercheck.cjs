const {chromium}=require('playwright-core');
const B=process.env.BASE||'https://salaarkhan53.github.io/digital-connect-wave';
const pages=['/','/careers/','/careers/apply/','/contact/','/about/','/compliance/','/industries/','/capabilities/'];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const path of pages){
    const p=await b.newPage({viewport:{width:1440,height:900}});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(2000);
    const before=await p.evaluate(()=>{
      const f=document.querySelector('footer');
      if(!f) return {noFooter:true};
      const kids=[...f.querySelectorAll('[data-reveal]')];
      return {
        docH:document.documentElement.scrollHeight, vh:window.innerHeight,
        scrollable:document.documentElement.scrollHeight>window.innerHeight+4,
        total:kids.length,
        hidden:kids.filter(e=>parseFloat(getComputedStyle(e).opacity)<0.9).length,
      };
    });
    // Now scroll to the bottom like a person would.
    for(let i=0;i<30;i++){ await p.mouse.wheel(0,900); await p.waitForTimeout(60); }
    await p.waitForTimeout(1200);
    const after=await p.evaluate(()=>{
      const kids=[...document.querySelectorAll('footer [data-reveal]')];
      return kids.filter(e=>parseFloat(getComputedStyle(e).opacity)<0.9).length;
    });
    console.log(`${path.padEnd(18)} scrollable=${String(before.scrollable).padEnd(5)} reveals=${before.total} hiddenAtLoad=${before.hidden} hiddenAfterScroll=${after}${after>0?'   <-- FOOTER INVISIBLE':''}`);
    await p.close();
  }
  await b.close();
})();
