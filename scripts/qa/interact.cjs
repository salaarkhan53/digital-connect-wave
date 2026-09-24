const {chromium}=require('playwright-core');
const BASE='https://salaarkhan53.github.io/digital-connect-wave';
const out=[];
const note=(ok,label,detail='')=>{out.push(`${ok?'✓':'✗'} ${label}${detail?'  — '+detail:''}`)};
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

  // ---------- desktop: mega menu keyboard + escape ----------
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto(BASE+'/',{waitUntil:'networkidle',timeout:60000});
  await p.waitForTimeout(2000);
  await p.keyboard.press('Tab');
  let chain=[];
  for(let i=0;i<8;i++){ chain.push(await p.evaluate(()=>{
    const a=document.activeElement; return a?a.tagName+':'+(a.textContent||'').trim().slice(0,16):'none';}));
    await p.keyboard.press('Tab'); }
  note(chain.some(c=>/Skip|Capabilities/i.test(c)),'keyboard reaches nav', chain.slice(0,4).join(' → '));

  // open Capabilities with the keyboard, then Escape
  await p.evaluate(()=>{const x=[...document.querySelectorAll('header button')].find(e=>(e.textContent||'').trim().startsWith('Capabilities'));x.focus();});
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const opened=await p.evaluate(()=>document.getElementById('menu-Capabilities')?.hidden===false);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const closed=await p.evaluate(()=>document.getElementById('menu-Capabilities')?.hidden===true);
  note(opened,'mega menu opens on Enter');
  note(closed,'mega menu closes on Escape');

  // focus visibility
  const ring=await p.evaluate(()=>{const a=document.querySelector('header a,header button');a.focus();
    const cs=getComputedStyle(a); return cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0;});
  note(ring,'visible focus ring on header controls');

  // anchor links resolve
  for(const href of ['/about/#process','/#trust']){
    const q=await b.newPage({viewport:{width:1440,height:900}});
    await q.goto(BASE+href,{waitUntil:'networkidle',timeout:60000});
    await q.waitForTimeout(1200);
    const id=href.split('#')[1];
    note(await q.evaluate(i=>!!document.getElementById(i),id), `anchor #${id} target exists`, href);
    await q.close();
  }
  await p.close();

  // ---------- mobile drawer ----------
  const m=await b.newPage({viewport:{width:390,height:844}});
  await m.goto(BASE+'/',{waitUntil:'networkidle',timeout:60000});
  await m.waitForTimeout(1800);
  const toggle=await m.evaluate(()=>{const t=[...document.querySelectorAll('header button')].pop();
    t.click(); return true;});
  await m.waitForTimeout(700);
  const drawerOpen=await m.evaluate(()=>{const n=document.querySelector('nav[aria-label="Mobile"]');
    return !!n && n.getBoundingClientRect().height>0;});
  note(drawerOpen,'mobile drawer opens');
  // body scroll lock while open
  const locked=await m.evaluate(()=>{const cs=getComputedStyle(document.body);
    return cs.overflow==='hidden'||cs.position==='fixed'||document.documentElement.style.overflow==='hidden';});
  note(locked,'body scroll locked while drawer open', locked?'':'page scrolls behind the drawer');
  // escape closes
  await m.keyboard.press('Escape'); await m.waitForTimeout(600);
  const drawerClosed=await m.evaluate(()=>{const n=document.querySelector('nav[aria-label="Mobile"]');
    return !n || n.getBoundingClientRect().height===0;});
  note(drawerClosed,'mobile drawer closes on Escape');
  await m.close();

  // ---------- savings calculator ----------
  const c=await b.newPage({viewport:{width:1440,height:900}});
  await c.goto(BASE+'/',{waitUntil:'networkidle',timeout:60000});
  await c.evaluate(async()=>{const s=document.getElementById('savings')||[...document.querySelectorAll('section')].find(x=>/savings|calculator/i.test(x.getAttribute('aria-labelledby')||x.id||''));
    const y=s?s.getBoundingClientRect().top+window.scrollY:2000; const l=window.__lenis;
    for(let i=0;i<=y;i+=500){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(r=>setTimeout(r,40));}});
  await c.waitForTimeout(1500);
  const calc=await c.evaluate(()=>{
    const ranges=[...document.querySelectorAll('input[type=range]')];
    if(!ranges.length) return {found:false};
    const before=document.body.innerText.match(/\$[\d,]+/g)||[];
    ranges[0].value=ranges[0].max; ranges[0].dispatchEvent(new Event('input',{bubbles:true}));
    return {found:true, ranges:ranges.length, before:before.slice(0,3)};
  });
  await c.waitForTimeout(800);
  const after=await c.evaluate(()=>(document.body.innerText.match(/\$[\d,]+/g)||[]).slice(0,3));
  note(calc.found,'savings calculator present', calc.found?`${calc.ranges} sliders`:'');
  if(calc.found) note(JSON.stringify(calc.before)!==JSON.stringify(after),'calculator reacts to slider',
    `${(calc.before||[]).join(',')} → ${after.join(',')}`);
  // NaN check
  note(!(await c.evaluate(()=>/NaN|Infinity|undefined/.test(document.body.innerText))),'no NaN/undefined in rendered text');
  await c.close();

  // ---------- back to top ----------
  const t=await b.newPage({viewport:{width:1440,height:900}});
  await t.goto(BASE+'/contact/',{waitUntil:'networkidle',timeout:60000});
  await t.evaluate(async()=>{const l=window.__lenis;const y=document.body.scrollHeight;
    for(let i=0;i<=y;i+=600){l?l.scrollTo(i,{immediate:true}):window.scrollTo(0,i);await new Promise(r=>setTimeout(r,40));}});
  await t.waitForTimeout(1200);
  const yBefore=await t.evaluate(()=>window.scrollY);
  await t.evaluate(()=>{const btn=[...document.querySelectorAll('button,a')].find(e=>/back to top/i.test(e.textContent||''));btn&&btn.click();});
  await t.waitForTimeout(2000);
  const yAfter=await t.evaluate(()=>window.scrollY);
  note(yAfter<yBefore*0.2,'back to top works', `${Math.round(yBefore)} → ${Math.round(yAfter)}`);
  await t.close();

  console.log(out.join('\n'));
  await b.close();
})();
