import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {books,routeFor} from '../assets/js/views.mjs';
import {sortCatalog} from '../assets/js/catalog-order.mjs';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const sourceCSS = (await readFile('assets/css/portfolio.css','utf8')).replaceAll('\r\n','\n');
const stylesheet = '/assets/css/portfolio.' + createHash('sha256').update(sourceCSS).digest('hex').slice(0,12) + '.css';
assert.equal((await readFile('.'+stylesheet,'utf8')).replaceAll('\r\n','\n'),sourceCSS,'Generated stylesheet differs from canonical source');
const rootHTML=await readFile('index.html','utf8');
const entry=rootHTML.match(/type="module" src="([^"]+)"/)[1];
const checkedModules=new Set();
async function checkModule(url) {
  if(checkedModules.has(url)) return;
  checkedModules.add(url);
  const source=(await readFile('.'+url,'utf8')).replaceAll('\r\n','\n');
  const hash=createHash('sha256').update(source).digest('hex').slice(0,12);
  assert.ok(url.endsWith('.'+hash+'.mjs'),'Invalid module fingerprint: '+url);
  for(const [,specifier] of source.matchAll(/from\s*['"](\.[^'"]+\.mjs)['"]/g)) {
    await checkModule(new URL(specifier,'https://seattlevo.com'+url).pathname);
  }
}
await checkModule(entry);
assert.equal(books.length,28);
assert.deepEqual(sortCatalog([...books].reverse()).map(b=>b.id),books.map(b=>b.id),'Release sorting must not depend on metadata order');
assert.equal(books[0].id,'mythology-of-the-world');
assert.equal(books.at(-1).id,'notes-to-my-highness');
for (let i=1;i<books.length;i++) assert.ok(books[i-1].releaseDate>=books[i].releaseDate,'Newest releases must appear first');
assert.deepEqual(sortCatalog([{...books[0],id:'z'},{...books[0],id:'a'}]).map(b=>b.id),['a','z']);
assert.throws(()=>sortCatalog([{...books[0],releaseDate:'2024-02-30'}]),/Verified audiobook release date/);
assert.throws(()=>sortCatalog([{...books[0],releaseDateSource:''}]),/Verified audiobook release date/);
for (const key of ['id','sample','retailerUrl']) assert.equal(new Set(books.map(b => b[key])).size,books.length,`Duplicate ${key}`);
for (const b of books) {
  assert.ok(b.title && b.id && b.genres.length);
  assert.ok(['www.audible.com','www.amazon.com'].includes(new URL(b.retailerUrl).hostname));
  for (const key of ['cover','sample','thumbnail','artwork']) await access('.'+b[key]);
  const html = await readFile(`books/${b.id}/index.html`,'utf8');
  assert.ok(html.includes(`href="${stylesheet}"`),'Book uses stale stylesheet version');
  assert.ok(html.includes(`src="${entry}"`),'Book uses stale script version');
  assert.ok(html.includes('href="'+b.retailerUrl.replaceAll('&','&amp;')+'"'));
  assert.ok(html.includes('<h1 tabindex="-1">'));
  assert.ok(html.includes('https://seattlevo.com/books/'+b.id+'/'));
  assert.equal(routeFor('/books/'+b.id+'/').book.id,b.id);
}
for (const page of ['index.html','about/index.html','commercial/index.html','contact/index.html','audiobooks/index.html','404.html']) {
  const html = await readFile(page,'utf8');
  assert.ok(html.includes(`href="${stylesheet}"`),'Page uses stale stylesheet version');
  assert.ok(html.includes(`src="${entry}"`),'Page uses stale script version');
  assert.ok(!html.includes('{{'));
  assert.ok(!/[\u00e2][\u20ac]|[\u00c2][\u00b7]/.test(html),'UTF-8 mojibake');
  assert.ok(html.includes('mailto:steve@seattlevo.com'));
  assert.ok(html.includes('<meta name="description"'));
  assert.ok(!html.includes(' autoplay'));
  const renderedIds=[...html.matchAll(/data-book="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(renderedIds,books.map(b=>b.id),'Static catalog must match release order');
  for (const [,attrs] of html.matchAll(/<button\b([^>]+)>/g)) {
    assert.ok(/data-(?:play|genre|seek|open-player|close-dialog|reset-filters|review-action)|id="(?:clear-search|open-player)"|class="[^"]*(?:toggle-play|toggle-mute)/.test(attrs),`Unwired button: ${attrs}`);
  }
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)) {
    const url = match[1];
    if (url.endsWith('/')) await access('.'+url+'index.html');else await access('.'+url);
  }
}
assert.equal(routeFor('/unknown/').view,'missing');
const design = (await readFile('DESIGN.md','utf8')).replaceAll('\r\n','\n');
const css = await readFile('assets/css/portfolio.css','utf8');
const colorBlock = design.split('colors:\n')[1].split('typography:')[0];
for (const [,name,value] of colorBlock.matchAll(/^  ([\w-]+): "(#[\da-f]+)"$/gm)) {
  assert.ok(css.includes(`--${name}: ${value};`),`Design token drift: ${name}`);
}
// Git's normalized blob hash avoids CRLF-only differences in the saved original.
assert.equal(execFileSync('git',['hash-object','--path=index.html','legacy.html'],{encoding:'utf8'}).trim(),execFileSync('git',['rev-parse','f446ab9:index.html'],{encoding:'utf8'}).trim());
const changed = execFileSync('git',['diff','--name-only','f446ab9','--','assets/audio','assets/images/books','assets/images/steve.jpg','assets/images/studio.jpg'],{encoding:'utf8'}).trim();
assert.equal(changed,'','Original source assets changed');
console.log('PASS: 28 unique records; all source/optimized media paths; 33 routes; static content; contact/retailer links; original page and source assets preserved.');
