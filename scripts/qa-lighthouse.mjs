import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdirSync, writeFileSync } from 'node:fs';
const stage=process.argv[2]||'final';
const routes=process.argv.slice(3).length?process.argv.slice(3):['/','/loom','/reverse','/pattern-room','/collection','/edition'];
const dir='artifacts/qa/lighthouse-'+stage;mkdirSync(dir,{recursive:true});
const results=[];
for(const route of routes){
 const chrome=await launch({chromePath:process.env.QA_CHROME_PATH,chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
 try{
  const result=await lighthouse('http://127.0.0.1:3100'+route,{port:chrome.port,logLevel:'error',output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo']});
  const slug=route==='/'?'entrance':route.slice(1).replaceAll('/','-');
  writeFileSync(dir+'/'+slug+'.json',result.report[0]);writeFileSync(dir+'/'+slug+'.html',result.report[1]);
  const r=result.lhr;
  const data={route,lighthouse:r.lighthouseVersion,fetchTime:r.fetchTime,settings:r.configSettings,scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,r.audits[k]?.numericValue])),bytes:r.audits['total-byte-weight']?.numericValue,failures:Object.values(r.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,displayValue:a.displayValue}))};
  results.push(data);console.log(JSON.stringify({route,scores:data.scores,metrics:data.metrics,bytes:data.bytes}));
 }finally{await chrome.kill()}
}
writeFileSync(dir+'/summary.json',JSON.stringify(results,null,2));
