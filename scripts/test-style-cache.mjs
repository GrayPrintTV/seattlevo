import http from 'node:http';
import path from 'node:path';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';

const root=fileURLToPath(new URL('../',import.meta.url));
const html=await readFile(path.join(root,'about/index.html'),'utf8');
const style=html.match(/rel="stylesheet" href="([^"]+)"/)[1];
const oldCSS=execFileSync('git',['show','3dcfe0f:assets/css/portfolio.css'],{cwd:root,encoding:'utf8'});
let upgraded=false;
const requested=[];
const mime={'.mjs':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.mp3':'audio/mpeg'};
const server=http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  requested.push(pathname);
  try {
    if(pathname==='/about/') {
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      res.end(upgraded?html:html.replace(style,'/assets/css/portfolio.css'));return;
    }
    if(pathname==='/assets/css/portfolio.css') {
      res.writeHead(200,{'Content-Type':'text/css','Cache-Control':'public, max-age=31536000'});
      res.end(oldCSS);return;
    }
    const file=path.resolve(root,'.'+decodeURIComponent(pathname));
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)) {res.writeHead(403);res.end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'public, max-age=31536000'});
    res.end(await readFile(file));
  } catch {res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const context=await browser.newContext({viewport:{width:1366,height:900}});
  const page=await context.newPage();
  const url=`http://127.0.0.1:${server.address().port}/about/`;
  await page.goto(url);await expect(page.locator('[data-reviews]')).toHaveClass(/reviews-enhanced/);
  await expect(page.locator('[data-review-slide]:visible')).toHaveCount(19);
  await mkdir(path.join(root,'test-results'),{recursive:true});
  await page.locator('[data-reviews]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(root,'test-results/cached-styles-before.png')});
  console.log('PASS: Old cached CSS reproduces all 19 reviews appearing as a list despite active carousel code.');
  upgraded=true;
  // Same browser/context; no cache purge, routing mocks, or hard refresh.
  await page.goto(url);await expect(page.locator('[data-reviews]')).toHaveClass(/reviews-enhanced/);
  await expect(page.locator('[data-review-slide]:visible')).toHaveCount(1);
  assert.equal(requested.filter(p=>p==='/assets/css/portfolio.css').length,1);
  assert.ok(requested.includes(style),'New hashed stylesheet was not requested');
  await page.locator('[data-reviews]').scrollIntoViewIfNeeded();await page.mouse.move(1,1);
  await page.screenshot({path:path.join(root,'test-results/cached-styles-after.png')});
  await expect(page.locator('.review-slide.is-active')).toHaveAttribute('data-review-slide','0w_xusRYoto',{timeout:6500});
  console.log('PASS: Ordinary revisit fetches the new stylesheet, shows one review, and rotates after five seconds with the old CSS still cached.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
