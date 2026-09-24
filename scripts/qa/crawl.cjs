const {chromium}=require('playwright-core');
const BASE=process.env.BASE||'https://salaarkhan53.github.io/digital-connect-wave';
const W=parseInt(process.env.W||'1440',10), H=parseInt(process.env.H||'900',10);

const seen=new Set(), queue=['/'], results=[];
const norm=(u)=>{try{const x=new URL(u,BASE+'/');if(!x.href.startsWith(BASE))return null;
  let p=x.pathname.replace(BASE.replace(/^https?:\/\/[^/]+/,''),'')||'/';
  return p+(x.search||'');}catch{return null}};

(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:W,height:H}});

  while(queue.length){
    const route=queue.shift();
    if(seen.has(route))continue; seen.add(route);
    const p=await ctx.newPage();
    const errs=[], failed=[];
    p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
    p.on('pageerror',e=>errs.push('PAGEERROR: '+e.message.slice(0,120)));
    p.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url().replace(BASE,''))});

    let status=0;
    try{ const res=await p.goto(BASE+route,{waitUntil:'networkidle',timeout:60000}); status=res?res.status():0; }
    catch(e){ results.push({route,status:'NAV FAIL',errs:[e.message.slice(0,80)],failed:[],links:0}); await p.close(); continue; }

    await p.evaluate(async()=>{const l=window.__lenis;const y=document.body.scrollHeight;
      for(let i=0;i<=y;i+=600){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(r=>setTimeout(r,40));}});
    await p.waitForTimeout(900);

    const info=await p.evaluate(()=>({
      title:document.title, desc:document.querySelector('meta[name=description]')?.content||'',
      h1:document.querySelectorAll('h1').length,
      canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')||'',
      ovf:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
      links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),
      imgsBroken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length,
      emptyAlt:[...document.querySelectorAll('img')].filter(i=>i.getAttribute('alt')===null).length,
    }));

    for(const href of info.links){
      const n=norm(href); if(n&&!seen.has(n)&&!queue.includes(n))queue.push(n);
    }
    results.push({route,status,errs:[...new Set(errs)],failed:[...new Set(failed)],
      title:info.title,desc:info.desc.length,h1:info.h1,canonical:info.canonical,
      ovf:info.ovf,imgsBroken:info.imgsBroken,missingAlt:info.emptyAlt,links:info.links.length});
    await p.close();
  }
  await b.close();

  console.log(`\n=== ${results.length} routes at ${W}x${H} ===\n`);
  let bad=0;
  for(const r of results){
    const problems=[];
    if(r.status!==200) problems.push(`status=${r.status}`);
    if(r.h1!==1) problems.push(`h1=${r.h1}`);
    if(r.ovf>0) problems.push(`xOverflow=${r.ovf}px`);
    if(r.imgsBroken) problems.push(`brokenImgs=${r.imgsBroken}`);
    if(r.missingAlt) problems.push(`imgMissingAlt=${r.missingAlt}`);
    if(!r.desc) problems.push('noMetaDescription');
    if(r.errs.length) problems.push(`consoleErrors=${r.errs.length}`);
    if(r.failed.length) problems.push(`failedRequests=${r.failed.length}`);
    if(problems.length){ bad++;
      console.log(`✗ ${r.route}`);
      console.log(`    ${problems.join('  ')}`);
      r.errs.slice(0,3).forEach(e=>console.log(`    err: ${e}`));
      r.failed.slice(0,4).forEach(e=>console.log(`    req: ${e}`));
    } else console.log(`✓ ${r.route}`);
  }
  console.log(`\n${results.length-bad} clean, ${bad} with findings`);
})();
