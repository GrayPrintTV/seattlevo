import {chromium, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {books} from '../assets/js/views.mjs';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));

const base = process.env.TEST_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chrome',headless:true,args:['--mute-audio']});
const result = {base,checks:[],screenshots:[],accessibility:[],consoleErrors:[]};
const passed = message => {result.checks.push(message);console.log('PASS: '+message);};
await mkdir('test-results',{recursive:true});
const context = await browser.newContext({viewport:{width:1366,height:900}});
const page = await context.newPage();
page.on('pageerror',error => result.consoleErrors.push(error.message));
async function screenshot(name) {const file=`test-results/${name}.png`;await page.screenshot({path:file});result.screenshots.push(file);}
async function axe(label) {
  const report = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  result.accessibility.push({label,violations:report.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  assert.equal(report.violations.length,0,`${label}: ${JSON.stringify(result.accessibility.at(-1))}`);
}
async function noOverflow(label) {
  const measurements = await page.evaluate(() => ({window:innerWidth,body:document.body.scrollWidth,main:document.querySelector('main').scrollWidth,mainWidth:document.querySelector('main').clientWidth}));
  assert.ok(measurements.body <= measurements.window, `${label} body overflow: ${JSON.stringify(measurements)}`);
  if (measurements.mainWidth) assert.ok(measurements.main <= measurements.mainWidth+1,`${label} panel overflow: ${JSON.stringify(measurements)}`);
}
try {
  const mediaRequests = [];
  page.on('request',request => {if (request.url().endsWith('.mp3')) mediaRequests.push(request.url());});
  await page.goto(base);
  await expect(page.locator('body')).toHaveClass('enhanced');
  await page.waitForFunction(() => document.querySelector('#audio').duration > 0);
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
  assert.equal(new Set(mediaRequests).size,1);
  passed('Initial load cues one sample without autoplay or loading the full catalog audio.');
  for (const [label,width,height] of [['widescreen',1920,1080],['laptop',1366,768],['tablet-landscape',1024,768],['tablet-portrait',768,1024],['phone',390,844],['small-phone',320,740]]) {
    await page.setViewportSize({width,height});
    await page.goto(base);
    await expect(page.locator('body')).toHaveClass('enhanced');
    await noOverflow(label);
    await screenshot(label);
    await axe(label+' home');
    const player = await page.locator('.player').boundingBox();
    const main = await page.locator('main').boundingBox();
    assert.ok(main.y+main.height <= player.y+1, `${label}: player obscures main`);
    passed(`${label} ${width}×${height}: no horizontal overflow, no player overlap, axe checks passed.`);
  }
  await page.setViewportSize({width:1366,height:900});
  await page.goto(base);
  await page.locator('[data-genre="Fantasy"]').click();
  await expect(page.locator('.catalog-item')).toHaveCount(4);
  await expect(page).toHaveURL(/genre=Fantasy/);
  await page.locator('#catalog-search').fill('zzzz-no-match');
  await expect(page.getByText('No matching audiobooks')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await expect(page.locator('.catalog-item')).toHaveCount(books.length);
  await page.locator('#catalog-search').fill('Stephen Bentley');
  await expect(page.locator('.catalog-item')).toHaveCount(7);
  await page.getByRole('button',{name:'Clear search',exact:true}).click();
  await expect(page.locator('.catalog-item')).toHaveCount(books.length);
  passed('Immediate genre/author filtering, URL state, empty state, clear search, and reset filters.');

  await page.locator('.hero [data-play]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime>0.3 && !document.querySelector('#audio').paused);
  const initial = await page.locator('#audio').evaluate(a=>({src:a.currentSrc,time:a.currentTime}));
  await page.locator('[data-book="merciless"]').click();
  await expect(page.locator('h1')).toHaveText('Merciless');
  const browsing = await page.locator('#audio').evaluate(a=>({src:a.currentSrc,time:a.currentTime,paused:a.paused}));
  assert.equal(browsing.src,initial.src);assert.equal(browsing.paused,false);assert.ok(browsing.time>=initial.time);
  await page.locator('[data-section="commercial"]').click();
  await expect(page.locator('h1')).toContainText('Make yourself');
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
  await page.locator('[data-section="about"]').click();
  await page.locator('[data-section="contact"]').click();
  assert.equal(await page.locator('#audio').evaluate(a=>a.currentSrc),initial.src);
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
  await page.goBack();await expect(page.locator('h1')).toContainText('A broadcast voice.');
  await page.goBack();await expect(page.locator('h1')).toContainText('Make yourself');
  await page.goBack();await expect(page.locator('h1')).toHaveText('Merciless');
  await page.goForward();await expect(page.locator('h1')).toContainText('Make yourself');
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
  passed('Audio plays and continues across book selection, all sections, browser Back, and Forward.');
  await page.locator('[data-book="merciless"]').click();
  await page.locator('.detail-actions [data-play]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentSrc.endsWith('/Merciless.mp3') && document.querySelector('#audio').currentTime>0.1);
  await expect(page.locator('#player-title')).toHaveText('Merciless');
  assert.equal(await page.locator('audio').count(),1);
  await page.locator('.player .toggle-play').click();
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
  await page.locator('#player-progress').focus();
  await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime>0);
  await page.locator('.player [data-seek="15"]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime>=15);
  await page.locator('.player [data-seek="-15"]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime<1);
  await page.locator('.player .toggle-mute').click();assert.equal(await page.locator('#audio').evaluate(a=>a.muted),true);
  await page.locator('.player .toggle-mute').click();assert.equal(await page.locator('#audio').evaluate(a=>a.muted),false);
  await page.locator('#player-volume').focus();await page.keyboard.press('ArrowLeft');
  assert.ok(await page.locator('#audio').evaluate(a=>a.volume)<1);
  passed('Explicit Play switches samples; single audio element; pause, keyboard scrubbing, ±15 seconds, mute, volume.');

  for (const [section,href] of [['commercial','/commercial/'],['about','/about/'],['contact','/contact/'],['book','/books/stop-overthinking/']]) {
    await page.goto(base+href);
    await expect(page.locator('body')).toHaveClass('enhanced');
    await noOverflow(section);await axe(section);await screenshot(section+'-desktop');
    assert.ok((await page.locator('h1').textContent()).length>0);
  }
  await expect(page.locator('.detail-heading h1')).toHaveText('Stop Overthinking and Let Go of Anxiety');
  passed('Direct section/book links, long title layout, and accessibility on all primary views.');

  await page.goto(base+'/commercial/');
  await page.locator('.player .toggle-play').click();
  await page.waitForFunction(()=>!document.querySelector('#audio').paused);
  await page.locator('[data-video="fmJ9mQk64XI"]').click();
  await expect(page.locator('#video-dialog')).toBeVisible();
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
  await expect(page.locator('#video-frame iframe')).toHaveAttribute('src',/youtube-nocookie.com\/embed\/fmJ9mQk64XI/);
  await page.keyboard.press('Escape');await expect(page.locator('#video-dialog')).not.toBeVisible();
  await expect(page.locator('#video-frame iframe')).toHaveCount(0);
  await expect(page.locator('[data-video="fmJ9mQk64XI"]')).toBeFocused();
  passed('Commercial videos open on request, pause narration, clean up on close, and restore keyboard focus.');

  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  await page.locator('.hero [data-play]').click();
  await page.waitForFunction(()=>document.querySelector('#audio').currentTime>0.1);
  await page.locator('[data-section="audiobooks"]').click();
  await expect(page.locator('.catalog-panel')).toBeVisible();
  await expect(page.locator('main')).not.toBeVisible();
  await page.locator('[data-genre="Thriller"]').click();
  await expect(page.locator('.catalog-item')).toHaveCount(8);
  await page.locator('[data-book="the-gala"]').click();
  await expect(page.locator('h1')).toHaveText('The Gala');
  assert.equal(await page.locator('#audio').evaluate(a=>a.paused),false);
  await screenshot('phone-book');await axe('phone book');
  await page.locator('#open-player').click();
  await expect(page.locator('#now-playing')).toBeVisible();
  await screenshot('phone-now-playing');await axe('Now Playing dialog');
  await page.locator('#now-playing .toggle-play').click();
  await page.locator('#now-progress').focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>{const a=document.querySelector('#audio');return Math.abs(a.duration-a.currentTime)<1;});
  await page.keyboard.press('Escape');await expect(page.locator('#open-player')).toBeFocused();
  await page.goBack();await expect(page.locator('.catalog-panel')).toBeVisible();
  await expect(page.locator('[data-genre="Thriller"]')).toHaveAttribute('aria-pressed','true');
  await page.goForward();await expect(page.locator('h1')).toHaveText('The Gala');
  passed('Phone catalog/detail navigation, persistent mini-player, expanded controls, focus restoration, and filter history.');
  for (const href of ['/commercial/','/about/','/contact/','/books/stop-overthinking/']) {
    await page.goto(base+href);await expect(page.locator('body')).toHaveClass('enhanced');
    await noOverflow('phone '+href);await axe('phone '+href);await screenshot('phone-'+href.split('/')[1]);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('button').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
  passed('Phone secondary views and long titles; reduced-motion preference honored.');
  for (const b of books) {
    const response = await context.request.get(base+b.sample,{headers:{Range:'bytes=0-255'}});
    assert.ok([200,206].includes(response.status()),b.sample);
    assert.match(response.headers()['content-type'],/audio\/mpeg/);
    const cover = await context.request.get(base+b.artwork);assert.equal(cover.status(),200,b.artwork);
  }
  passed('All 28 MP3 and optimized cover URLs respond successfully.');

  const noJS = await browser.newContext({javaScriptEnabled:false});
  const plain = await noJS.newPage();await plain.goto(base+'/books/merciless/');
  await expect(plain.locator('h1')).toHaveText('Merciless');
  await expect(plain.locator('noscript audio')).toBeVisible();
  await plain.goto(base+'/commercial/');await expect(plain.getByText('Commissioned work & client feedback')).toBeVisible();
  await noJS.close();passed('Static content and native sample playback remain available without JavaScript.');

  if (base.includes('127.0.0.1') || base.includes('localhost')) {
    await page.route('**/assets/audio/MythologyoftheWorldSample.mp3',r=>r.fulfill({status:404,body:'not found'}));
    await page.goto(base);await page.locator('.hero [data-play]').click();
    await expect(page.locator('.player .player-status')).toContainText('Sample unavailable');
    await page.unroute('**/assets/audio/MythologyoftheWorldSample.mp3');
    await page.locator('.player .toggle-play').click();
    await page.waitForFunction(()=>document.querySelector('#audio').currentTime>0.1);
    await page.locator('.player .toggle-play').click();
    passed('Missing audio produces an actionable error and playback recovers on retry.');
    const denied = await browser.newContext();
    await denied.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Playback blocked','NotAllowedError'));};});
    const deniedPage = await denied.newPage();await deniedPage.goto(base);await deniedPage.locator('.hero [data-play]').click();
    await expect(deniedPage.locator('.player .player-status')).toContainText('Playback needs a tap');
    await denied.close();passed('Browser playback restriction is caught and explained.');
    await context.setOffline(true);
    await page.locator('[data-section="about"]').click();await expect(page.locator('h1')).toContainText('A broadcast voice.');
    await page.locator('[data-section="contact"]').click();await expect(page.locator('h1')).toContainText('Your words.');
    await context.setOffline(false);passed('Loaded in-site text/navigation remain usable when the connection drops.');
  }
  assert.deepEqual(result.consoleErrors,[]);
  passed('No uncaught application JavaScript errors.');
} catch (error) {
  result.failure=error.stack;console.error(error);
  await screenshot('failure');process.exitCode=1;
} finally {
  await writeFile('test-results/browser-report.json',JSON.stringify(result,null,2));
  await browser.close();
}
