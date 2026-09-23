const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:4102';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h] of [[1440,900],[1366,768],[1536,864],[1920,1080]]){
    const p=await b.newPage({viewport:{width:w,height:h}});
    await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<60;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(45); }
    await p.waitForTimeout(600);
    await p.evaluate(()=>{const s=document.querySelector('#process');
      const y=window.scrollY+s.getBoundingClientRect().top+60;
      window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):window.scrollTo(0,y);});
    await p.waitForTimeout(1100);
    const m=await p.evaluate(()=>{
      const vis=e=>e.getBoundingClientRect().width>0;
      const sec=document.querySelector('#process');
      const inner=[...sec.querySelectorAll('.shell')].filter(vis).pop();
      const r=inner.getBoundingClientRect();
      const img=[...sec.querySelectorAll('img')].filter(vis)[0];
      return {top:Math.round(r.top), bottom:Math.round(r.bottom),
        img: img?{w:Math.round(img.getBoundingClientRect().width),h:Math.round(img.getBoundingClientRect().height)}:null};
    });
    const spare = h - m.bottom;
    console.log(`${String(w+'x'+h).padEnd(10)} scene ${String(m.top).padStart(4)}..${String(m.bottom).padStart(4)}  spare=${String(spare).padStart(4)}px  img=${m.img?m.img.w+'x'+m.img.h:'none'}${spare<0?'  <-- CROPPED':''}`);
    await p.close();
  }
  await b.close();
})();
