const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1600,height:900}});
  await p.goto('http://localhost:3309/',{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(2500);
  await p.getByRole('button',{name:/^Industries/}).hover();
  await p.waitForTimeout(1200);
  const r=await p.evaluate(()=>{
    const tile=[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Compliance')&&a.querySelector('img'));
    if(!tile) return 'no tile';
    const tb=tile.getBoundingClientRect();
    const img=tile.querySelector('img'), svg=tile.querySelector('svg');
    const ib=img.getBoundingClientRect(), sb=svg.getBoundingClientRect();
    const cs=getComputedStyle(img);
    return {
      tile:{x:Math.round(tb.x),w:Math.round(tb.width),h:Math.round(tb.height),cx:Math.round(tb.x+tb.width/2)},
      img:{x:Math.round(ib.x),w:Math.round(ib.width),cx:Math.round(ib.x+ib.width/2)},
      svg:{x:Math.round(sb.x),w:Math.round(sb.width),cx:Math.round(sb.x+sb.width/2)},
      imgTransform:cs.transform, imgPos:cs.position, imgLeft:cs.left,
    };
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
