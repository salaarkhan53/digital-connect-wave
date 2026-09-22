/**
 * Screenshots a page viewport-by-viewport using real wheel scrolling, so
 * Lenis + ScrollTrigger reveals actually fire. A fullPage screenshot does not
 * scroll the way a person does and captures every reveal still hidden.
 */
const {chromium}=require('playwright-core');
const PORT=process.env.PORT||'3001';
const url=process.argv[2]||'http://localhost:'+PORT+'/';
const prefix=process.argv[3]||'C:/Users/MSKXYZ/AppData/Local/Temp/tour';
const W=parseInt(process.argv[4]||'1440',10);
const H=parseInt(process.argv[5]||'900',10);
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:W,height:H}});
  const errs=[];
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message.slice(0,200)));
  await p.goto(url,{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(2800);

  const total=await p.evaluate(()=>document.documentElement.scrollHeight);
  const steps=Math.ceil(total/H);
  let n=0;
  await p.screenshot({path:`${prefix}-${String(n).padStart(2,'0')}.png`});
  for(n=1;n<steps;n++){
    // Wheel in a few increments so Lenis eases rather than jumps.
    for(let k=0;k<4;k++){ await p.mouse.wheel(0,H/4); await p.waitForTimeout(120); }
    await p.waitForTimeout(700);
    await p.screenshot({path:`${prefix}-${String(n).padStart(2,'0')}.png`});
  }
  const hidden=await p.evaluate(()=>[...document.querySelectorAll('[data-reveal]')]
    .filter(e=>parseFloat(getComputedStyle(e).opacity)<0.9).length);
  console.log('shots:',steps,'pageHeight:',total,'stillHidden:',hidden);
  console.log('errors:',errs.length?[...new Set(errs)].slice(0,6).join('\n'):'none');
  await b.close();
})();
