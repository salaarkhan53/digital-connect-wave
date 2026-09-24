const {chromium}=require('playwright-core');
const BASE=process.env.BASE||'https://salaarkhan53.github.io/digital-connect-wave';
const ROUTES=['/','/capabilities/','/capabilities/lead-generation/','/industries/','/industries/final-expense/',
  '/about/','/compliance/','/careers/','/careers/apply/','/contact/'];
const SIZES=[[320,640,'iPhone SE'],[360,780,'small android'],[390,844,'iPhone 14'],[430,932,'iPhone Pro Max'],
  [640,900,'sm edge'],[768,1024,'iPad portrait'],[820,1180,'iPad Air'],[1024,768,'iPad landscape'],
  [1280,800,'small laptop'],[1366,768,'laptop'],[1440,900,'MBP'],[1680,1050,''],[1920,1080,'desktop'],[2560,1440,'2K']];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const findings=[];
  for(const [w,h,label] of SIZES){
    const ctx=await b.newContext({viewport:{width:w,height:h}});
    for(const r of ROUTES){
      const p=await ctx.newPage();
      const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,70)));
      await p.goto(BASE+r,{waitUntil:'networkidle',timeout:60000});
      await p.evaluate(async()=>{const l=window.__lenis;const y=document.body.scrollHeight;
        for(let i=0;i<=y;i+=600){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(x=>setTimeout(x,35));}});
      await p.waitForTimeout(600);
      const m=await p.evaluate(()=>{
        const vw=window.innerWidth;
        const ovf=Math.max(0,document.documentElement.scrollWidth-vw);
        // elements sticking out past the viewport
        const spill=[...document.querySelectorAll('body *')].filter(e=>{
          const r=e.getBoundingClientRect();
          if(r.width===0||r.height===0)return false;
          const cs=getComputedStyle(e);
          if(cs.position==='fixed')return false;
          return r.right>vw+2||r.left<-2;
        }).slice(0,4).map(e=>e.tagName.toLowerCase()+'.'+String(e.className).slice(0,34));
        // text clipped by its own box
        const clipped=[...document.querySelectorAll('h1,h2,h3,p,a,span,button,li,td')].filter(e=>{
          const cs=getComputedStyle(e);
          if(cs.overflow==='visible'&&cs.overflowX==='visible')return false;
          if(cs.textOverflow==='ellipsis')return false;
          return e.scrollWidth>e.clientWidth+2&&e.clientWidth>0;
        }).slice(0,3).map(e=>(e.textContent||'').trim().slice(0,30));
        // tap targets under 44px that are actually interactive
        const small=[...document.querySelectorAll('a[href],button,input,select,textarea')].filter(e=>{
          const r=e.getBoundingClientRect();
          if(r.width===0||r.height===0)return false;
          return r.height<24||r.width<24;
        }).slice(0,3).map(e=>e.tagName.toLowerCase()+':'+(e.textContent||'').trim().slice(0,18));
        return {ovf,spill,clipped,small};
      });
      const probs=[];
      if(m.ovf>0)probs.push(`xOverflow=${m.ovf}px`);
      if(m.spill.length)probs.push(`spill: ${m.spill.join(', ')}`);
      if(m.clipped.length)probs.push(`clipped: ${m.clipped.join(' | ')}`);
      if(m.small.length)probs.push(`tinyTarget: ${m.small.join(', ')}`);
      if(errs.length)probs.push(`jsError: ${errs[0]}`);
      if(probs.length)findings.push(`${String(w).padStart(5)}x${h} ${label.padEnd(15)} ${r.padEnd(32)} ${probs.join('  ')}`);
      await p.close();
    }
    await ctx.close();
    process.stdout.write(`${w} `);
  }
  console.log('\n\n=== responsive findings ===');
  console.log(findings.length? findings.join('\n') : 'none');
})();
