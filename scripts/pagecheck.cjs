const {chromium}=require('playwright-core');
const BASE=process.env.BASE||'http://localhost:4500/digital-connect-wave';
const routes=['/','/capabilities/','/capabilities/lead-generation/','/industries/','/industries/medicare/',
  '/about/','/compliance/','/careers/','/contact/','/nope/'];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  for(const r of routes){
    const p=await ctx.newPage();
    const errs=[], bad=[];
    p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
    p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message.slice(0,120)));
    p.on('response',res=>{ if(res.status()>=400) bad.push(res.status()+' '+res.url().replace(BASE,'')); });
    const res=await p.goto(BASE+r,{waitUntil:'networkidle',timeout:60000});
    await p.waitForTimeout(2500);
    const m=await p.evaluate(()=>({h1:document.querySelectorAll('h1').length,
      cv:document.querySelectorAll('canvas').length,
      ovf:document.documentElement.scrollWidth-window.innerWidth,
      title:document.title}));
    console.log(`${String(res.status()).padEnd(4)} ${r.padEnd(34)} h1=${m.h1} canvas=${m.cv} ovf=${m.ovf} errs=${errs.length} broken=${bad.length}`);
    if(bad.length) console.log('      404s:', [...new Set(bad)].slice(0,4).join(' | '));
    if(errs.length) console.log('      err :', [...new Set(errs)].slice(0,2).join(' | '));
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/pg-${r.replace(/[^a-z]/gi,'_')||'root'}.png`});
    await p.close();
  }
  await b.close();
})();
