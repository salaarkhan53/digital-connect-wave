const {chromium}=require('playwright-core');
const fs=require('fs');
const B=process.env.BASE||'http://localhost:3501';
const TMP='C:/Users/MSKXYZ/AppData/Local/Temp';
(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1440,height:1100}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
  // Never let the test actually hit Web3Forms.
  await p.route('https://api.web3forms.com/**', r=>r.fulfill({status:200,contentType:'application/json',body:'{"message":"ok"}'}));

  await p.goto(B+'/careers/apply?role=medicare-closer',{waitUntil:'networkidle',timeout:90000});
  await p.waitForTimeout(2000);
  console.log('role prefilled:', await p.locator('#role-select').inputValue());
  await p.screenshot({path:TMP+'/apply-form.png',fullPage:true});

  // 1. Empty submit should surface every required error and send nothing.
  let posted=false;
  p.on('request',r=>{ if(r.url().includes('web3forms')) posted=true; });
  await p.getByRole('button',{name:/submit application/i}).click();
  await p.waitForTimeout(700);
  const errCount=await p.locator('[role="alert"]').count();
  console.log('errors shown on empty submit:', errCount, '| posted:', posted);
  await p.screenshot({path:TMP+'/apply-errors.png',fullPage:true});

  // 2. Bad phone + oversized file.
  fs.writeFileSync(TMP+'/big.pdf', Buffer.alloc(6*1024*1024, 0x20));
  fs.writeFileSync(TMP+'/cv.pdf', '%PDF-1.4 test cv');
  await p.locator('#name').fill('Jordan Miller');
  await p.locator('#email').fill('jordan@example.com');
  await p.locator('#phone').fill('12345');
  await p.locator('#city').fill('Sheridan');
  await p.locator('#state').fill('Wyoming');
  await p.locator('#attachment').setInputFiles(TMP+'/big.pdf');
  await p.getByRole('radio',{name:'2 Years'}).check();
  await p.getByRole('button',{name:/submit application/i}).click();
  await p.waitForTimeout(600);
  const msgs=await p.locator('[role="alert"]').allTextContents();
  console.log('validation messages:', JSON.stringify(msgs));

  // 3. Fix both and submit for real (intercepted).
  await p.locator('#phone').fill('307 555 0123');
  await p.locator('#attachment').setInputFiles(TMP+'/cv.pdf');
  await p.getByRole('button',{name:/submit application/i}).click();
  await p.waitForTimeout(1500);
  const ok=await p.locator('text=Application received').count();
  console.log('success state shown:', ok===1, '| posted to endpoint:', posted);
  await p.screenshot({path:TMP+'/apply-success.png'});
  console.log('page errors:', errs.length?errs.join(' | '):'none');
  await b.close();
})();
