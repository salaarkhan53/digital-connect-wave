const {chromium}=require('playwright-core');
const PORT=process.env.PORT||'3001';
const routes=['/','/capabilities','/capabilities/lead-generation','/industries','/industries/medicare',
  '/about','/compliance','/careers','/careers/apply','/careers/apply?role=medicare-closer','/contact','/contact?seats=25&hours=40&rate=32&target=14','/does-not-exist'];
const W=parseInt(process.argv[2]||'1440',10), H=parseInt(process.argv[3]||'900',10);
const tag=process.argv[4]||'d';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:1,
    reducedMotion: process.argv[5]==='reduce' ? 'reduce' : 'no-preference'});
  for(const r of routes){
    const p=await ctx.newPage();
    const errs=[];
    p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160))});
    p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message.slice(0,160)));
    const res=await p.goto('http://localhost:'+PORT+r,{waitUntil:'networkidle',timeout:60000});
    await p.waitForTimeout(1800);
    const m=await p.evaluate(()=>({
      h1:document.querySelectorAll('h1').length,
      title:document.title,
      hidden:[...document.querySelectorAll('[data-reveal]')].filter(e=>parseFloat(getComputedStyle(e).opacity)<0.9).length,
      overflow:document.documentElement.scrollWidth>window.innerWidth+1
        ? document.documentElement.scrollWidth-window.innerWidth : 0,
    }));
    const name=r.replace(/[^a-z0-9]/gi,'_')||'root';
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/rt-${tag}-${name}.png`});
    console.log(`${String(res.status()).padEnd(4)} ${r.padEnd(46)} h1=${m.h1} xOverflow=${m.overflow}px errs=${errs.length} | ${m.title.slice(0,44)}`);
    if(errs.length) console.log('      ', [...new Set(errs)].slice(0,3).join(' | '));
    await p.close();
  }
  await b.close();
})();
