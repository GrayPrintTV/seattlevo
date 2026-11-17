import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL || 'http://127.0.0.1:4174';
const browser=await chromium.launch({channel:'chrome',args:['--mute-audio']});
const page=await browser.newPage({viewport:{width:1366,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
if (!process.env.TEST_URL) {
  // Emulate the observed Pages preview behavior: full responses, no ranges.
  await page.route('**/assets/audio/*.mp3',async route=>{
    const res=await fetch(route.request().url());const body=Buffer.from(await res.arrayBuffer());
    await route.fulfill({status:200,headers:{'content-type':'audio/mpeg','content-length':String(body.length)},body});
  });
}
try {
  await page.goto(base);await page.locator('.hero [data-play]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime>.1);
  await page.locator('.player [data-seek="15"]').click();
  await page.waitForFunction(()=>{const a=document.querySelector('#audio');return a.currentSrc.startsWith('blob:')&&a.currentTime>=15&&!a.paused;});
  console.log('PASS: Range-less host buffers only the selected sample on explicit seek and resumes playback.');
  const blob=await page.locator('#audio').evaluate(a=>a.currentSrc);
  await page.locator('[data-book="merciless"]').click();
  assert.equal(await page.locator('#audio').evaluate(a=>a.currentSrc),blob);
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
  await page.locator('.detail-actions [data-play]').click();
  await page.waitForFunction(()=>{const a=document.querySelector('#audio');return a.currentSrc.endsWith('Merciless.mp3')&&a.currentTime>.1;});
  await page.locator('.player .toggle-play').click();
  await page.locator('.player [data-seek="15"]').click();
  await page.waitForFunction(()=>{const a=document.querySelector('#audio');return a.currentSrc.startsWith('blob:')&&a.currentTime>=15;});
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
  console.log('PASS: Browsing preserves buffered playback, explicit Play switches cleanly, paused seek stays paused.');
  await page.locator('[data-section="commercial"]').click();
  await page.locator('[data-video="fmJ9mQk64XI"]').click();
  await expect(page.locator('#video-dialog')).toBeVisible();
  await page.goBack();await expect(page.locator('#video-dialog')).not.toBeVisible();
  await expect(page.locator('#video-frame iframe')).toHaveCount(0);
  console.log('PASS: Browser Back closes and cleans up a video dialog.');
  assert.deepEqual(errors,[]);
} finally {await browser.close();}
