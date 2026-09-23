const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3400';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  const errs=[];
  p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url().split('/').pop())});
  await p.goto(B+'/',{waitUntil:'networkidle',timeout:90000});
  // Wheel down to the Industries section.
  for(let i=0;i<13;i++){ await p.mouse.wheel(0,700); await p.waitForTimeout(140); }
  await p.waitForTimeout(1800);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/ind-home.png'});
  // Hover a few rows so the panel swaps image.
  try {
    const rows=p.locator('section a[href^="/industries/"]:visible');
    await rows.nth(3).hover({timeout:4000}); await p.waitForTimeout(1200);
    await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/ind-home-hover.png'});
  } catch { console.log('(hover skipped)'); }
  await p.goto(B+'/industries/',{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(2500);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/ind-index.png',fullPage:false});
  console.log('errors:', errs.length?[...new Set(errs)].slice(0,4).join(' | '):'none');
  await b.close();
})();
