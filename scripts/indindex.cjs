const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3400';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  const bad=[];
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').slice(-1)[0])});
  await p.goto(B+'/industries/',{waitUntil:'networkidle',timeout:90000});
  for(let i=0;i<4;i++){ await p.mouse.wheel(0,420); await p.waitForTimeout(160); }
  await p.waitForTimeout(1600);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/idx-industries.png'});
  const imgs=await p.evaluate(()=>[...document.querySelectorAll('img[src*="industries"]')].length);
  console.log('industry photos on index:', imgs, '(expect 8; technology uses generated art)');
  console.log('failed requests:', bad.length?[...new Set(bad)].join(' | '):'none');
  await b.close();
})();
