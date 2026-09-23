const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3700';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h,tag] of [[1440,900,'d'],[2560,1170,'w'],[390,844,'m']]){
    const p=await b.newPage({viewport:{width:w,height:h}});
    await p.goto(B+'/about/',{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<40;i++){ await p.mouse.wheel(0,900); await p.waitForTimeout(60); }
    await p.waitForTimeout(1400);
    await p.evaluate(()=>{
      const el=[...document.querySelectorAll('h2')].find(e=>e.textContent.includes("Let's talk"));
      if(el){const y=window.scrollY+el.getBoundingClientRect().top-160;
        window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y);}
    });
    await p.waitForTimeout(1200);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/cta-${tag}.png`});
    const m=await p.evaluate(()=>{
      const el=[...document.querySelectorAll('h2')].find(e=>e.textContent.includes("Let's talk"));
      const card=el?.closest('div.relative');
      const r=card?.getBoundingClientRect();
      return r?{w:Math.round(r.width),h:Math.round(r.height)}:null;
    });
    console.log(tag, w+'x'+h, 'panel:', JSON.stringify(m));
    await p.close();
  }
  await b.close();
})();
