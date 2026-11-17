import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {books} from '../assets/js/views.mjs';
const base=process.env.TEST_URL || 'http://127.0.0.1:4174';
const restored=['homeschool-college-planner','future-of-work','lettuce-farming','notes-to-my-highness'];
const browser=await chromium.launch({channel:'chrome',args:['--mute-audio']});
const context=await browser.newContext();
const page=await context.newPage();
await mkdir('test-results',{recursive:true});
try {
  for(const [width,height] of [[1366,768],[390,844]]) {
    await page.setViewportSize({width,height});
    await page.goto(base+'/audiobooks/');
    await expect(page.locator('body')).toHaveClass('enhanced');
    assert.deepEqual(await page.locator('.catalog-item').evaluateAll(es=>es.map(e=>e.dataset.book)),books.map(b=>b.id));
    await page.locator('[data-genre="Nonfiction"]').click();
    assert.deepEqual(await page.locator('.catalog-item').evaluateAll(es=>es.map(e=>e.dataset.book)),books.filter(b=>b.genres.includes('Nonfiction')).map(b=>b.id));
    for(const id of restored) {
      await page.goto(`${base}/books/${id}/`);
      await expect(page.locator('body')).toHaveClass('enhanced');
      await expect(page.locator('h1')).toHaveText(books.find(b=>b.id===id).title);
      await page.waitForFunction(()=>document.querySelector('.detail-cover img')?.naturalWidth>0);
      const geometry=await page.evaluate(()=>({window:innerWidth,body:document.body.scrollWidth,main:document.querySelector('main').scrollWidth,available:document.querySelector('main').clientWidth}));
      assert.ok(geometry.body<=geometry.window&&geometry.main<=geometry.available+1,JSON.stringify(geometry));
      const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      assert.equal(a11y.violations.length,0,JSON.stringify(a11y.violations));
      await page.screenshot({path:`test-results/restored-${id}-${width}.png`});
      await page.locator('.detail-actions [data-play]').click();
      await page.waitForFunction(()=>document.querySelector('#audio').currentTime>.1&&!document.querySelector('#audio').paused);
      await page.locator('[data-section="contact"]').click();
      assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
    }
    console.log(`PASS ${width}px: release ordering, filter order, four direct links, artwork, title layout, accessibility, playback and persistence`);
  }
} finally {await browser.close();}
