const {chromium}=require('playwright-core');
const BASE='https://salaarkhan53.github.io/digital-connect-wave';
const ROUTES=['/','/capabilities/','/capabilities/lead-generation/','/industries/','/industries/insurance/',
 '/about/','/compliance/','/careers/','/careers/apply/','/contact/'];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  for(const r of ROUTES){
    const p=await ctx.newPage();
    await p.goto(BASE+r,{waitUntil:'networkidle',timeout:60000});
    await p.evaluate(async()=>{const l=window.__lenis;const y=document.body.scrollHeight;
      for(let i=0;i<=y;i+=700){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(x=>setTimeout(x,35));}});
    await p.waitForTimeout(700);
    const f=await p.evaluate(()=>{
      const vis=e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed';
      const name=e=>(e.getAttribute('aria-label')||e.getAttribute('title')||
        (e.getAttribute('aria-labelledby')?(document.getElementById(e.getAttribute('aria-labelledby'))?.textContent||''):'')||
        e.textContent||'').trim();
      const out={};
      out.unlabelledInputs=[...document.querySelectorAll('input:not([type=hidden]):not([type=submit]),select,textarea')]
        .filter(vis).filter(e=>{
          if(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby'))return false;
          if(e.id&&document.querySelector(`label[for="${CSS.escape(e.id)}"]`))return false;
          if(e.closest('label'))return false;
          return true;
        }).map(e=>e.name||e.type);
      out.namelessLinks=[...document.querySelectorAll('a[href]')].filter(vis).filter(e=>!name(e)).length;
      out.namelessButtons=[...document.querySelectorAll('button')].filter(vis).filter(e=>!name(e)).length;
      out.imgNoAlt=[...document.querySelectorAll('img')].filter(e=>e.getAttribute('alt')===null).length;
      const ids={}; out.duplicateIds=[];
      document.querySelectorAll('[id]').forEach(e=>{ids[e.id]=(ids[e.id]||0)+1});
      for(const k in ids) if(ids[k]>1) out.duplicateIds.push(k);
      out.danglingAria=[...document.querySelectorAll('[aria-labelledby],[aria-controls],[aria-describedby]')]
        .flatMap(e=>['aria-labelledby','aria-controls','aria-describedby'].flatMap(a=>{
          const v=e.getAttribute(a); if(!v)return [];
          return v.split(/\s+/).filter(id=>!document.getElementById(id)).map(id=>`${a}=${id}`);
        }));
      out.positiveTabindex=[...document.querySelectorAll('[tabindex]')].filter(e=>+e.getAttribute('tabindex')>0).length;
      out.emptyHeadings=[...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).filter(e=>!e.textContent.trim()).length;
      out.emptyLinks=[...document.querySelectorAll('a')].filter(e=>!e.getAttribute('href')).length;
      // lists must only contain li
      out.badLists=[...document.querySelectorAll('ul,ol')].filter(l=>
        [...l.children].some(c=>!['LI','SCRIPT','TEMPLATE'].includes(c.tagName))).length;
      return out;
    });
    const probs=Object.entries(f).filter(([,v])=>Array.isArray(v)?v.length:v>0)
      .map(([k,v])=>`${k}=${Array.isArray(v)?JSON.stringify(v):v}`);
    console.log(`${probs.length?'✗':'✓'} ${r.padEnd(34)} ${probs.join('  ')}`);
    await p.close();
  }
  await b.close();
})();
