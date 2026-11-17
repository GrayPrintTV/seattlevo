import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {books} from '../assets/js/views.mjs';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const browser = await chromium.launch({channel:'chrome',args:['--mute-audio']});
const page = await browser.newPage({viewport:{width:1366,height:900}});
const report=[];
try {
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4174');
  for (const book of books) {
    await page.locator(`[data-book="${book.id}"]`).click();
    await page.locator('.detail-actions [data-play]').click();
    await page.waitForFunction(sample=>{
      const a=document.querySelector('#audio');
      return new URL(a.currentSrc).pathname===sample && !a.paused && a.currentTime>0.05 && a.duration>0;
    },book.sample);
    const media=await page.locator('#audio').evaluate(a=>({duration:a.duration,time:a.currentTime,error:a.error?.message || null}));
    assert.equal(media.error,null);
    await page.locator('.player .toggle-play').click();
    report.push({title:book.title,sample:book.sample,...media});
    console.log(`PASS ${book.title}: ${media.duration.toFixed(1)} seconds, playback advanced`);
  }
  await writeFile('docs/catalog-playback-check.json',JSON.stringify(report,null,2));
} finally {await browser.close();}
