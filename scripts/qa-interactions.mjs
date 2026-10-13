import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const dir='artifacts/qa/interactions';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.QA_CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
try{
 for(const [profile,width,height,rate] of [['desktop',1440,900,1],['mobile-4x',390,844,4]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<500,reducedMotion:'reduce'});
  await context.addInitScript({content:readFileSync(require.resolve('web-vitals').replace('web-vitals.umd.cjs','web-vitals.iife.js'),'utf8')});
  await context.addInitScript(()=>{
   window.__qaMetrics={};window.__qaTasks=[];
   for(const name of ['LCP','CLS','INP']) window.webVitals['on'+name](m=>{window.__qaMetrics[name]={value:m.value,rating:m.rating,entries:m.entries.length};},{reportAllChanges:true});
   new PerformanceObserver(list=>{window.__qaTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})));}).observe({type:'longtask',buffered:true});
  });
  const page=await context.newPage(),cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate});
  if(rate>1){await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:204800,uploadThroughput:76800});}
  for(const route of ['/','/loom','/reverse','/pattern-room','/collection','/edition']){
   await page.goto('http://127.0.0.1:3100'+route,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);
   if(route==='/loom')await page.locator('.loom-material.is-ready').waitFor();
   if(route==='/reverse')await page.locator('.reverse-surface.is-ready').waitFor();
   if(route==='/pattern-room')await page.locator('.pattern-art-layer canvas.is-ready').first().waitFor();
   if(route==='/edition')await page.locator('.edition-canvas.is-ready').waitFor();
   const timing=[];
   const timed=async(name,act,ready)=>{const start=performance.now();await act();if(ready)await ready();timing.push({name,acknowledgedMs:Math.round(performance.now()-start)});};
   if(route==='/')await timed('open menu',()=>page.getByLabel('Explore the exhibition').click());
   if(route==='/loom')await timed('add row',()=>page.getByRole('button',{name:'Add a woven row',exact:true}).click(),()=>page.waitForFunction(()=>document.querySelector('.loom-material').dataset.renderedRows==='29'));
   if(route==='/reverse')await timed('lift edge',()=>page.locator('.reverse-edge-cue').click(),()=>page.waitForFunction(()=>document.querySelector('.reverse-moving-cloth').dataset.progress==='0.3800'));
   if(route==='/pattern-room'){
    const repeat=page.locator('.pattern-mobile-tabs button').filter({hasText:'Repeat'});if(await repeat.isVisible())await repeat.click();
    await timed('arrange ribbon',()=>page.getByRole('button',{name:'Ribbon',exact:true}).click(),()=>page.waitForFunction(()=>document.querySelector('.pattern-art-layer canvas').dataset.composition==='ribbon'));
   }
   if(route==='/collection')await timed('browse materials',()=>page.locator('.collection-modes--horizontal').getByRole('link',{name:'Materials',exact:true}).click());
   if(route==='/edition')await timed('change print',()=>page.getByRole('radio',{name:'Material study',exact:true}).check(),()=>page.getByRole('button',{name:'Export your edition',exact:true}).waitFor({state:'visible'}));
   await page.waitForTimeout(600);
   const data=await page.evaluate(()=>({vitals:window.__qaMetrics,longTasks:window.__qaTasks,resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').slice(-1)[0],type:r.initiatorType,bytes:r.encodedBodySize,transfer:r.transferSize})),canvas:[...document.querySelectorAll('canvas')].map(c=>({class:c.className,width:c.width,height:c.height,renderer:c.dataset.renderer})),fonts:document.fonts.status}));
   results.push({profile,route,cpuSlowdown:rate,timing,...data});console.log(JSON.stringify({profile,route,vitals:data.vitals,timing}));
  }
  await context.close();
 }
 writeFileSync(dir+'/summary.json',JSON.stringify({browser:browser.version(),environment:'Local production server; synthetic CPU/network and real scripted browser interactions; not field data',results},null,2));
}finally{await browser.close()}
