const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3700';
const pages=(process.env.PAGES||'/,/about/,/capabilities/,/industries/,/compliance/,/careers/,/contact/').split(',');
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  let grand=0;
  for(const path of pages){
    const p=await b.newPage({viewport:{width:1440,height:900}});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<50;i++){ await p.mouse.wheel(0,900); await p.waitForTimeout(45); }
    await p.waitForTimeout(900);
    const r=await p.evaluate(()=>{
      const secs=[...document.querySelectorAll('main section')];
      const rows=secs.map(s=>{
        const cs=getComputedStyle(s);
        const inner=s.querySelector('.shell')||s.firstElementChild;
        const ib=inner?inner.getBoundingClientRect():null;
        const sb=s.getBoundingClientRect();
        // Padding on the inner shell counts too; that is where .section lives.
        const ics=inner?getComputedStyle(inner):null;
        return {
          pt:parseFloat(cs.paddingTop)+(ics?parseFloat(ics.paddingTop):0),
          pb:parseFloat(cs.paddingBottom)+(ics?parseFloat(ics.paddingBottom):0),
          h:Math.round(sb.height),
          content: ib?Math.round(ib.height):0,
        };
      });
      const docH=document.documentElement.scrollHeight;
      const chrome = rows.reduce((a,r)=>a+r.pt+r.pb,0);
      return {docH, count:rows.length, chrome:Math.round(chrome), rows:rows.map(r=>({pt:Math.round(r.pt),pb:Math.round(r.pb),h:r.h}))};
    });
    grand+=r.chrome;
    console.log(`${path.padEnd(16)} sections=${String(r.count).padStart(2)}  page=${String(r.docH).padStart(6)}px  verticalPadding=${String(r.chrome).padStart(5)}px  (${Math.round(r.chrome/r.docH*100)}% of page)`);
    await p.close();
  }
  console.log(`\ntotal vertical padding across pages: ${grand}px`);
  await b.close();
})();
