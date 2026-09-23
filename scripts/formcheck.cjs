const {chromium}=require('playwright-core');
const B=process.env.BASE||'https://salaarkhan53.github.io/digital-connect-wave';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const [path,label] of [['/careers/apply/','careers application'],['/contact/','contact enquiry']]){
    const p=await b.newPage({viewport:{width:1440,height:1000}});
    await p.goto(B+path,{waitUntil:'networkidle',timeout:90000});
    await p.waitForTimeout(2500);
    const r=await p.evaluate(()=>{
      const form=document.querySelector('form');
      const key=form?.querySelector('input[name="access_key"]')?.value||null;
      const notConnected=document.body.innerText.includes('not connected yet');
      return {
        hasForm: !!form,
        keyPresent: !!key && key.length>10,
        keyTail: key ? key.slice(-6) : null,
        fields: form ? [...form.querySelectorAll('input[name],select[name],textarea[name]')].map(e=>e.name).filter(n=>n!=='access_key'&&n!=='botcheck'&&n!=='from_name') : [],
        notConnected,
      };
    });
    console.log(label.padEnd(22), 'form='+r.hasForm, 'key='+r.keyPresent+(r.keyTail?'(…'+r.keyTail+')':''), 'notConnectedPanel='+r.notConnected);
    console.log('   fields:', r.fields.join(', '));
    await p.close();
  }
  await b.close();
})();
