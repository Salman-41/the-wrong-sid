import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const dir='artifacts/qa/'+(process.argv[2]||'final');mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.QA_CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const report=[];
const routes=['/','/loom','/reverse','/pattern-room','/collection','/edition','/missing-page','/collection/missing-object'];
try{
 for(const [device,width,height] of [['desktop',1600,1000],['laptop',1366,768],['tablet',834,1112],['mobile',390,844],['narrow',320,740],['landscape',844,390]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<1000,reducedMotion:'reduce'});
  const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   const response=await page.goto('http://127.0.0.1:3100'+route,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
   const slug=route==='/'?'entrance':route.slice(1).replaceAll('/','-');
   await page.screenshot({path:dir+'/'+device+'-'+slug+'.png'});
   const data=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,fonts:document.fonts.status,images:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).map(i=>({alt:i.alt,loaded:i.complete&&i.naturalWidth>0,currentSrc:i.currentSrc})),canvas:[...document.querySelectorAll('canvas')].filter(c=>c.getBoundingClientRect().left>=0).map(c=>({class:c.className,width:c.width,height:c.height})),smallTargets:[...document.querySelectorAll('a,button,input,summary,select')].filter(n=>!n.disabled&&n.getBoundingClientRect().width>0&&getComputedStyle(n).visibility!=='hidden'&&getComputedStyle(n).display!=='none').filter(n=>{const r=n.getBoundingClientRect();return r.width<24||r.height<24}).map(n=>({text:n.getAttribute('aria-label')||n.textContent.trim().slice(0,55),width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height}))}));
   let violations=[];
   if(['desktop','mobile'].includes(device)){
    await page.addScriptTag({content:readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
    const axe=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22a','wcag22aa']}}));
    violations=axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
    writeFileSync(dir+'/'+device+'-'+slug+'-axe.json',JSON.stringify(axe,null,2));
   }
   report.push({device,route,status:response.status(),...data,violations,errors});errors=[];
   console.log(device,route,'status',response.status(),'overflow',data.scrollWidth-width,'axe',violations.map(v=>v.id).join(','));
  }
  await context.close();
 }
 writeFileSync(dir+'/report.json',JSON.stringify({browser:browser.version(),report},null,2));
}finally{await browser.close()}
