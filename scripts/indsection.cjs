const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3400';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
  // Full pass down so every reveal has fired, then come back to the section.
  for(let i=0;i<45;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(70); }
  await p.waitForTimeout(800);
  await p.evaluate(()=>{
    const el=document.querySelector('#industries-heading');
    const y=window.scrollY+el.getBoundingClientRect().top-110;
    window.__lenis ? window.__lenis.scrollTo(y,{immediate:true}) : window.scrollTo(0,y);
  });
  await p.waitForTimeout(1500);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/sec-industries.png'});
  const rows=p.locator('section ul li a[href^="/industries/"]');
  await rows.nth(4).hover(); await p.waitForTimeout(1400);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/sec-industries-hover.png'});
  console.log('ok');
  await b.close();
})();
