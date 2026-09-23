const {chromium}=require('playwright-core');
const URL=process.env.URL||'http://localhost:3307/';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1600,height:900}});
  const errs=[];
  p.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,140))});
  await p.goto(URL,{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(3000);
  for (const label of ['Capabilities','Industries','Company']) {
    await p.getByRole('button',{name:new RegExp('^'+label)}).hover();
    await p.waitForTimeout(1600);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/menu-${label}.png`,clip:{x:0,y:0,width:1600,height:640}});
    console.log(label,'captured');
  }
  console.log('errors:', errs.length?[...new Set(errs)].slice(0,3).join(' | '):'none');
  await b.close();
})();
