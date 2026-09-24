const {chromium}=require('playwright-core');
const BASE='https://salaarkhan53.github.io/digital-connect-wave';
const ROUTES=['/','/capabilities/','/capabilities/inbound-support/','/capabilities/digital-marketing/',
 '/industries/','/industries/insurance/','/industries/technology/','/about/','/compliance/',
 '/careers/','/careers/apply/','/contact/'];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const metas=new Map(), titles=new Map(); const findings=[];
  for(const r of ROUTES){
    const p=await ctx.newPage();
    await p.goto(BASE+r,{waitUntil:'networkidle',timeout:60000});
    await p.evaluate(async()=>{const l=window.__lenis;const y=document.body.scrollHeight;
      for(let i=0;i<=y;i+=700){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(x=>setTimeout(x,35));}});
    await p.waitForTimeout(600);
    const d=await p.evaluate(()=>{
      const text=document.body.innerText;
      const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(h=>h.offsetParent!==null)
        .map(h=>+h.tagName[1]);
      let skips=[];
      for(let i=1;i<hs.length;i++) if(hs[i]-hs[i-1]>1) skips.push(`h${hs[i-1]}→h${hs[i]}`);
      return {
        text,
        title:document.title,
        desc:document.querySelector('meta[name=description]')?.content||'',
        og:!!document.querySelector('meta[property="og:title"]'),
        ogImg:document.querySelector('meta[property="og:image"]')?.content||'',
        canonical:document.querySelector('link[rel=canonical]')?.getAttribute('href')||'',
        lang:document.documentElement.lang||'',
        headingSkips:skips,
        jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent.slice(0,0)).length,
      };
    });
    const t=d.text;
    const hit=(re)=>{const m=t.match(re);return m?m[0]:null};
    const probs=[];
    const em=hit(/—/); if(em) probs.push('EM DASH in copy');
    const off=hit(/pakistan|rawalpindi|islamabad|balitech|\+92/i); if(off) probs.push(`offshore mention: "${off}"`);
    const lorem=hit(/lorem ipsum|TODO|FIXME|placeholder|XXX/i); if(lorem) probs.push(`placeholder: "${lorem}"`);
    const dotnet=hit(/digitalconnectwave\.(net|org)/i); if(dotnet) probs.push(`wrong domain: "${dotnet}"`);
    const badmail=hit(/info@example|@example\.com/i); if(badmail) probs.push(`template email: "${badmail}"`);
    // contact values where present
    const phones=[...new Set((t.match(/\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g)||[]))];
    const wrongPhone=phones.filter(x=>x.replace(/\D/g,'').replace(/^1/,'')!=='3252024836');
    if(wrongPhone.length) probs.push(`unexpected phone: ${wrongPhone.join(', ')}`);
    if(!d.lang) probs.push('no <html lang>');
    if(!d.og) probs.push('no og:title');
    if(!d.ogImg) probs.push('no og:image');
    if(!d.canonical) probs.push('no canonical');
    if(d.headingSkips.length) probs.push(`heading level skip: ${d.headingSkips.join(', ')}`);
    if(titles.has(d.title)) probs.push(`duplicate <title> with ${titles.get(d.title)}`); else titles.set(d.title,r);
    if(d.desc && metas.has(d.desc)) probs.push(`duplicate meta description with ${metas.get(d.desc)}`); else if(d.desc) metas.set(d.desc,r);
    if(probs.length) findings.push(`✗ ${r}\n    ${probs.join('\n    ')}`); else findings.push(`✓ ${r}`);
    await p.close();
  }
  console.log(findings.join('\n'));
  await b.close();
})();
