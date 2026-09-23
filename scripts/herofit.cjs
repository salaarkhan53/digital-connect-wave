const {chromium}=require('playwright-core');
const URL=process.env.URL||'http://localhost:3302/';
const sizes=[[2560,1170,'wide @75% zoom'],[1920,940,'1080p'],[1536,864,'laptop'],[1366,768,'small laptop'],[1440,900,'macbook'],[390,844,'phone']];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h,label] of sizes){
    const p=await b.newPage({viewport:{width:w,height:h}});
    await p.goto(URL,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(3000);
    const m=await p.evaluate(()=>{
      const s=document.querySelector('section');
      const h1=document.querySelector('h1');
      const cs=getComputedStyle(h1);
      const cue=document.querySelector('a[href="#trust"]');
      // How much of the hero's content actually sits inside the first screen.
      const inner=s.querySelector('.shell');
      const ib=inner.getBoundingClientRect();
      return {
        hero:Math.round(s.getBoundingClientRect().height),
        contentBottom:Math.round(ib.bottom),
        h1px:cs.fontSize, h1h:Math.round(h1.getBoundingClientRect().height),
        lines:Math.round(h1.getBoundingClientRect().height/parseFloat(cs.lineHeight)),
        cueBottom: cue?Math.round(cue.getBoundingClientRect().bottom):null,
      };
    });
    const overflow=m.contentBottom>h;
    console.log(`${String(w+'x'+h).padEnd(10)} ${label.padEnd(14)} hero=${String(m.hero).padStart(5)} contentEnds=${String(m.contentBottom).padStart(5)} h1=${m.h1px.padEnd(7)} lines=${m.lines} ${overflow?'  <-- OVERFLOWS VIEWPORT':''}`);
    await p.close();
  }
  await b.close();
})();
