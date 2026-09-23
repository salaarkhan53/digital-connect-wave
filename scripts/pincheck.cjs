const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3904';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
  const seen=new Set();
  for(let i=0;i<220;i++){
    await p.mouse.wheel(0,120); await p.waitForTimeout(55);
    const step=await p.evaluate(()=>{
      const cur=document.querySelector('[aria-current="step"]');
      return cur?cur.textContent.trim():null;
    });
    if(step) seen.add(step);
  }
  console.log('process steps reached while scrolling:', [...seen].join(' -> ') || 'none');
  await b.close();
})();
