const {chromium}=require('playwright-core');
const URL=process.env.URL||'http://localhost:3306/';
const sizes=[[2560,1170,'wide'],[1920,940,'1080p'],[1366,768,'small'],[390,844,'phone']];
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h,tag] of sizes){
    const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
    await p.goto(URL,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(4500);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/hv-${tag}.png`});
    console.log(tag,'captured',w+'x'+h);
    await p.close();
  }
  await b.close();
})();
