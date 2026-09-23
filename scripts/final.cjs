const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:900}});
  await p.goto('https://salaarkhan53.github.io/digital-connect-wave/',{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(4000);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/f-header.png',clip:{x:0,y:0,width:1440,height:110}});
  for(let i=0;i<45;i++){ await p.mouse.wheel(0,900); await p.waitForTimeout(80); }
  await p.waitForTimeout(1500);
  const h=await p.evaluate(()=>Math.round(document.querySelector('footer').getBoundingClientRect().height));
  console.log('desktop footer:', h+'px');
  await p.locator('footer').screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/f-footer.png'});
  await b.close();
})();
