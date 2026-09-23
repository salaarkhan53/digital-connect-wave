const {chromium}=require('playwright-core');
const B=process.env.BASE||'https://salaarkhan53.github.io/digital-connect-wave';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [path,tag] of [['/careers/','careers'],['/careers/apply/','apply']]){
    const p=await b.newPage({viewport:{width:1440,height:900}});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    for(let i=0;i<30;i++){ await p.mouse.wheel(0,900); await p.waitForTimeout(60); }
    await p.waitForTimeout(1500);
    await p.screenshot({path:`C:/Users/MSKXYZ/AppData/Local/Temp/bot-${tag}.png`});
    const info=await p.evaluate(()=>{
      const f=document.querySelector('footer').getBoundingClientRect();
      const last=document.querySelector('main').lastElementChild.getBoundingClientRect();
      return {footerTop:Math.round(f.top), footerH:Math.round(f.height),
        mainEndsAt:Math.round(last.bottom), vh:window.innerHeight,
        lastSection:document.querySelector('main').lastElementChild.className.slice(0,40)};
    });
    console.log(tag, JSON.stringify(info));
    await p.close();
  }
  await b.close();
})();
