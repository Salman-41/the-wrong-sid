import { HISTORICAL_TEXTILES } from '../src/lib/collection-data';
import { mkdirSync, writeFileSync } from 'node:fs';
const directory='artifacts/qa/museum-records';mkdirSync(directory,{recursive:true});
const results=[];
for(let start=0;start<HISTORICAL_TEXTILES.length;start+=3){
 const batch=await Promise.all(HISTORICAL_TEXTILES.slice(start,start+3).map(async record=>{
  try{
   const response=await fetch(record.recordSourceUrl,{signal:AbortSignal.timeout(20000)});
   const text=await response.text();writeFileSync(directory+'/'+record.id+(response.headers.get('content-type')?.includes('json')?'.json':'.html'),text);
   let current: unknown;
   if(response.headers.get('content-type')?.includes('json')){
    const json=JSON.parse(text),data=record.id.startsWith('cma-')?json.data[0]:json;
    current=record.id.startsWith('cma-')?{title:data?.title,date:data?.creation_date,accession:data?.accession_number,rights:data?.share_license_status,medium:data?.technique,images:data?.images}:{title:data.title,date:data.objectDate,accession:data.objectNumber,rights:data.isPublicDomain,medium:data.medium,primaryImage:data.primaryImage};
   }else current={titlePresent:text.includes(record.title)||text.toLowerCase().includes(record.title.toLowerCase()),cc0Present:/CC0|Creative Commons Zero|creativecommons.org\/publicdomain\/zero/.test(text),imageIdentifiers:record.images.map(i=>{const id=new URL(i.sourceDownloadUrl).searchParams.get('id');return {id,present:id?text.includes(id):null};})};
   return {id:record.id,source:record.recordSourceUrl,status:response.status,current};
  }catch(error){return {id:record.id,source:record.recordSourceUrl,error:error instanceof Error?error.message:String(error)};}
 }));results.push(...batch);console.log(JSON.stringify(batch));
}
writeFileSync(directory+'/summary.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
