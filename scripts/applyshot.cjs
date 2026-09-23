const {chromium}=require('playwright-core');
const B=process.env.BASE||'http://localhost:3500';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  await p.goto(B+'/careers/apply?role=medicare-closer',{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(2500);
  await p.screenshot({path:'C:/Users/MSKXYZ/AppData/Local/Temp/apply.png',fullPage:true});
  console.log('errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
