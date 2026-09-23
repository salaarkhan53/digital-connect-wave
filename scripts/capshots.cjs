const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:4200';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [path,tag,steps] of [['/capabilities/','idx',0],['/capabilities/inbound-support/','det',0],['/capabilities/inbound-support/','det2',4]]){
    const p=await b.newPage({viewport:{width:1440,height:950}});
    const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,100)));
    p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url().split('/').pop())});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(2200);
    for(let i=0;i<steps;i++){ await p.mouse.wheel(0,800); await p.waitForTimeout(160); }
    if(steps) await p.waitForTimeout(1200);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/cap-${tag}.png`});
    console.log(tag, 'errors:', errs.length?[...new Set(errs)].slice(0,3).join(' | '):'none');
    await p.close();
  }
  await b.close();
})();
