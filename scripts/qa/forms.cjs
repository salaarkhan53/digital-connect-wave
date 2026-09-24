const {chromium}=require('playwright-core');
const BASE='https://salaarkhan53.github.io/digital-connect-wave';
const errOf=(p,n)=>p.evaluate((name)=>{
  const el=document.querySelector(`[name="${name}"]`); if(!el) return '(missing)';
  const w=el.closest('div,fieldset');
  return [...w.querySelectorAll('p,span')].map(x=>x.textContent.trim())
    .filter(t=>/cannot|does not|Please|need|limit|Pick|only|short|valid/i.test(t)).join(' / ')||'(none)';
},n);

(async()=>{
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

  console.log('=== CONTACT FORM ===');
  for(const [label, vals, expect] of [
    ['whitespace-only name', {name:'   ', email:'a@b.co', message:'A sentence about the campaign.'}, 'name'],
    ['name is just spaces+digits', {name:' 123 ', email:'a@b.co', message:'A sentence about the campaign.'}, 'name'],
    ['email missing @',   {name:'Jordan Miller', email:'nope', message:'A sentence about the campaign.'}, 'email'],
    ['email plus-address',{name:'Jordan Miller', email:'a+tag@b.co', message:'A sentence about the campaign.'}, 'none'],
    ['email subdomain',   {name:'Jordan Miller', email:'a@mail.b.co.uk', message:'A sentence about the campaign.'}, 'none'],
    ['message too short', {name:'Jordan Miller', email:'a@b.co', message:'hi'}, 'message'],
    ['script in name',    {name:'<script>x</script>', email:'a@b.co', message:'A sentence about the campaign.'}, 'name'],
    ['very long name',    {name:'A'.repeat(300), email:'a@b.co', message:'A sentence about the campaign.'}, 'none'],
  ]){
    const p=await b.newPage({viewport:{width:1440,height:1000}});
    let sent=0; await p.route('**api.web3forms.com/**', r=>{sent++; r.abort();});
    await p.goto(BASE+'/contact/',{waitUntil:'networkidle',timeout:60000});
    await p.waitForTimeout(1200);
    await p.fill('input[name="name"]',vals.name);
    await p.fill('input[name="email"]',vals.email);
    await p.fill('textarea[name="message"]',vals.message);
    await p.click('form button[type="submit"]');
    await p.waitForTimeout(700);
    const errs={}; for(const f of ['name','email','message']) errs[f]=await errOf(p,f);
    const blocked = sent===0;
    const shown=Object.entries(errs).filter(([,v])=>v!=='(none)').map(([k])=>k);
    const ok = expect==='none' ? (!blocked && shown.length===0) : (blocked && shown.includes(expect));
    console.log(`${ok?'✓':'✗'} ${label.padEnd(26)} blocked=${blocked} errors=[${shown}] ${ok?'':'EXPECTED '+expect}`);
    if(!ok) console.log('    detail:', JSON.stringify(errs));
    await p.close();
  }

  console.log('\n=== CAREERS FORM ===');
  const base={name:'Jordan Miller',email:'a@b.co',city:'Sheridan',state:'Wyoming',phone:'3252024836'};
  for(const [label, over, file, expect] of [
    ['wrong file type', {}, {name:'cv.txt',mimeType:'text/plain',buffer:Buffer.from('hi')}, 'attachment'],
    ['oversized file',  {}, {name:'cv.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(6*1024*1024,1)}, 'attachment'],
    ['no file',         {}, null, 'attachment'],
    ['city with digits',{city:'Sheridan 2'}, {name:'cv.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF')}, 'city'],
    ['valid everything',{}, {name:'cv.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF')}, 'none'],
  ]){
    const p=await b.newPage({viewport:{width:1440,height:1100}});
    let sent=0; await p.route('**api.web3forms.com/**', r=>{sent++; r.abort();});
    await p.goto(BASE+'/careers/apply/',{waitUntil:'networkidle',timeout:60000});
    await p.waitForTimeout(1200);
    const v={...base,...over};
    for(const k of ['name','email','city','state','phone']) await p.fill(`input[name="${k}"]`, v[k]);
    if(file) await p.setInputFiles('input[name="attachment"]', file);
    await p.check('input[name="experience"]').catch(()=>{});
    await p.click('form button[type="submit"]');
    await p.waitForTimeout(900);
    const fields=['name','email','city','state','phone','attachment','experience'];
    const errs={}; for(const f of fields) errs[f]=await errOf(p,f);
    const blocked=sent===0;
    const shown=Object.entries(errs).filter(([,val])=>val!=='(none)'&&val!=='(missing)').map(([k])=>k);
    const ok = expect==='none' ? (!blocked && shown.length===0) : (blocked && shown.includes(expect));
    console.log(`${ok?'✓':'✗'} ${label.padEnd(20)} blocked=${blocked} errors=[${shown}] ${ok?'':'EXPECTED '+expect}`);
    if(!ok) console.log('    detail:', JSON.stringify(errs));
    await p.close();
  }
  await b.close();
})();
