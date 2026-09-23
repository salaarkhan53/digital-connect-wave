const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3900';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
  for(let i=0;i<60;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(50); }
  await p.waitForTimeout(700);
  await p.evaluate(()=>{
    const h=document.querySelector('#process');
    const y=window.scrollY+h.getBoundingClientRect().top+60;
    window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y);
  });
  await p.waitForTimeout(1400);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/proc-1.png'});
  const m=await p.evaluate(()=>{
    const sec=document.querySelector('#process');
    const vis=e=>e.offsetParent!==null||e.getBoundingClientRect().width>0;
    const det=[...sec.querySelectorAll('p')].filter(vis).find(e=>e.textContent.startsWith('Before anyone dials'));
    const img=[...sec.querySelectorAll('img')].filter(vis)[0];
    const lines = det ? Math.round(det.getBoundingClientRect().height/parseFloat(getComputedStyle(det).lineHeight)) : null;
    return {
      detailLines: lines,
      detailW: det?Math.round(det.getBoundingClientRect().width):null,
      img: img?{w:Math.round(img.getBoundingClientRect().width),h:Math.round(img.getBoundingClientRect().height)}:null,
      sceneBottom: Math.round(sec.getBoundingClientRect().bottom),
      vh: window.innerHeight,
    };
  });
  console.log(JSON.stringify(m));
  await b.close();
})();
