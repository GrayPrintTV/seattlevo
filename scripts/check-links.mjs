import {books,videos} from '../assets/js/views.mjs';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const urls = [...books.map(b=>({label:b.title,url:b.retailerUrl})),...videos.map(v=>({label:v.title,url:'https://www.youtube.com/watch?v='+v.id})),{label:'Audible profile',url:'https://www.audible.com/search?narrator=steve+schaeffer'},{label:'Audiobooks.com profile',url:'https://www.audiobooks.com/browse/narrator/475772/steve-schaeffer'},{label:'Voices profile',url:'https://www.voices.com/profile/steveschaeffer'}];
const results=[];
while (urls.length) {
  const batch = await Promise.all(urls.splice(0,4).map(async link=>{
    try {
      const res=await fetch(link.url,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'Mozilla/5.0'}});
      const body=await res.text();
      return {...link,status:res.status,resolvedUrl:res.url,title:body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '',restricted:/captcha|robot check|automated access|access denied/i.test(body)};
    } catch (error) {return {...link,error:error.message};}
  }));
  results.push(...batch);
  batch.forEach(r=>console.log(`${r.status || 'ERROR'} ${r.restricted?'restricted ':''}${r.label}`));
}
await writeFile('docs/link-check.json',JSON.stringify(results,null,2));
