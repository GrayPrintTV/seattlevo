import {books, featured, icons, routeFor, catalogItems, escapeHTML as e, videos} from './views.mjs';
import {mountReviews} from './review-carousel.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const audio = $('#audio');
const main = $('#main-content');
const catalog = $('#catalog-list');
const search = $('#catalog-search');
const nowPlaying = $('#now-playing');
const videoDialog = $('#video-dialog');
const mobile = matchMedia('(max-width: 700px)');
let route = routeFor(location.pathname);
let currentBook = featured;
let playRequest = 0;
let loadTimer;
let previousVolume = 1;
let dialogTrigger;
let lastTrackedPath;
let sampleBlobURL;
let seekController;
let pendingSeekTarget = null;
let unmountReviews;

function filters() {
  const params = new URLSearchParams(location.search);
  return {genre: params.get('genre') || 'All', query: params.get('q') || ''};
}
function filteredBooks() {
  const {genre, query} = filters();
  const needle = query.toLocaleLowerCase('en-US').trim();
  return books.filter(b => (genre === 'All' || b.genres.includes(genre)) && [b.title, b.subtitle, b.author, b.editors].some(value => String(value || '').toLocaleLowerCase('en-US').includes(needle)));
}
function updateCatalog() {
  const {genre, query} = filters();
  search.value = query;
  $('#clear-search').hidden = !query;
  $$('[data-genre]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.genre === genre)));
  const matches = filteredBooks();
  $('#catalog-count').textContent = `${matches.length} ${matches.length === 1 ? 'audiobook' : 'audiobooks'}${genre !== 'All' ? ' · ' + genre : ''}`;
  catalog.innerHTML = matches.length ? catalogItems(matches, route.book?.id) : `<div class="empty-state"><h3>No matching audiobooks</h3><p>Try another title, author, or genre.</p><button class="button secondary" data-reset-filters>Clear filters</button></div>`;
  catalog.querySelectorAll('a').forEach(link => {link.search = location.search;});
}
function saveScroll() {
  history.replaceState({...history.state,mainScroll:main.scrollTop,catalogScroll:catalog.scrollTop}, '', location.href);
}
function syncPage({focus = false, restore = false} = {}) {
  const nextRoute = routeFor(location.pathname);
  const changed = nextRoute.title !== route.title || nextRoute.view !== route.view;
  route = nextRoute;
  document.body.dataset.view = route.view;
  if (changed) {
    unmountReviews?.();
    unmountReviews = undefined;
    main.innerHTML = route.html;
  }
  if (!unmountReviews) unmountReviews = mountReviews(main.querySelector('[data-reviews]'));
  document.title = route.title;
  const description = route.book ? `${route.book.title}${route.book.author ? ' by '+route.book.author : ''}, narrated by Steve Schaeffer. Listen to an audiobook sample and explore the portfolio.` : 'Steve Schaeffer, Seattle voice artist and audiobook narrator. Hear narration samples, commercial voiceover demos, and commissioned work. Amplify Your Impact.';
  $('meta[name="description"]').content = description;
  $('link[rel="canonical"]').href = 'https://seattlevo.com' + location.pathname;
  $('meta[property="og:title"]').content = route.title;
  $('meta[property="og:description"]').content = description;
  $('meta[property="og:url"]').content = 'https://seattlevo.com' + location.pathname;
  // Preserve the site's existing GA property; do not send search queries.
  if (lastTrackedPath !== location.pathname && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {page_title:route.title,page_location:location.origin + location.pathname,page_path:location.pathname});
    lastTrackedPath = location.pathname;
  }
  $$('[data-section]').forEach(link => {
    if (link.dataset.section === route.section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  updateCatalog();
  updateButtons();
  if (focus) {
    const target = mobile.matches && route.view === 'catalog' ? $('#catalog-heading') : main.querySelector('h1') || main;
    target.focus({preventScroll:true});
  }
  if (restore) {
    main.scrollTop = history.state?.mainScroll || 0;
    catalog.scrollTop = history.state?.catalogScroll || 0;
  } else if (changed) main.scrollTop = 0;
}
function navigate(url) {
  if (url.href === location.href) return;
  saveScroll();
  history.pushState({}, '', url);
  syncPage({focus:true});
}
function filterTo(genre, query, replace = false) {
  const url = new URL(location.href);
  if (genre && genre !== 'All') url.searchParams.set('genre', genre); else url.searchParams.delete('genre');
  if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
  saveScroll();
  history[replace ? 'replaceState' : 'pushState']({...history.state}, '', url);
  updateCatalog();
  catalog.scrollTop = 0;
}
window.addEventListener('popstate', () => {closeDialogs();syncPage({focus:true,restore:true});});
search.addEventListener('input', event => {
  if (!event.isComposing) filterTo(filters().genre, search.value, true);
});
search.addEventListener('compositionend', () => filterTo(filters().genre, search.value, true));
$('#clear-search').addEventListener('click', () => {filterTo(filters().genre, '', true);search.focus();});

const formatTime = seconds => {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
};
function setStatus(text, error = false) {
  $$('.player-status').forEach(node => {node.textContent = text;node.classList.toggle('error',error);});
  $('#player-subtitle').textContent = error ? text : 'Steve Schaeffer · Narration sample';
}
function updateProgress() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const position = pendingSeekTarget ?? audio.currentTime;
  $$('.elapsed').forEach(node => node.textContent = formatTime(position));
  $$('.duration').forEach(node => node.textContent = formatTime(duration));
  $$('.progress').forEach(input => {
    input.disabled = duration <= 0;
    input.max = duration || 100;
    input.value = position || 0;
    input.style.setProperty('--progress', `${duration ? position / duration * 100 : 0}%`);
    input.setAttribute('aria-valuetext', `${formatTime(position)} of ${formatTime(duration)}`);
  });
}
function updateButtons() {
  const playing = !audio.paused && !audio.ended;
  $$('.toggle-play').forEach(button => {
    button.innerHTML = playing ? icons.pause : icons.play;
    button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} sample: ${currentBook.title}`);
  });
  $$('[data-play]').forEach(button => {
    const active = button.dataset.play === currentBook.id && playing;
    const book = books.find(b => b.id === button.dataset.play);
    const label = button.querySelector('span');
    const svg = button.querySelector('svg');
    if (svg) svg.outerHTML = active ? icons.pause : icons.play;
    if (label) label.textContent = active ? 'Pause sample' : button.dataset.idleLabel || 'Play sample';
    button.setAttribute('aria-label', `${active ? 'Pause' : 'Play'} sample: ${book.title}`);
  });
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}
function updateTrack() {
  $('#player-title').textContent = currentBook.title;
  $('#player-cover').src = currentBook.thumbnail;
  $('#now-cover').src = currentBook.artwork;
  $('#now-cover').alt = currentBook.title + ' cover';
  $('#now-title').textContent = currentBook.title;
  $('#now-author').textContent = currentBook.author || (currentBook.editors ? 'edited by '+currentBook.editors : '');
  $('#now-detail').href = '/books/'+currentBook.id+'/';
  $('#open-player').setAttribute('aria-label', `Open Now Playing: ${currentBook.title}`);
  if ('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({title:currentBook.title,artist:'Steve Schaeffer',album:currentBook.author || 'Narration sample',artwork:[{src:currentBook.artwork,type:'image/webp',sizes:'480x480'}]});
  }
}
function loading() {
  clearTimeout(loadTimer);
  setStatus('Loading sample…');
  loadTimer = setTimeout(() => {
    if (audio.readyState < 3) {
      ++playRequest;
      audio.pause();
      setStatus('Connection is slow. Press Play to retry.', true);
    }
  }, 15000);
}
async function play(book = currentBook) {
  const request = ++playRequest;
  clearTimeout(loadTimer);
  if (book.id !== currentBook.id) {
    seekController?.abort();
    pendingSeekTarget = null;
    if (sampleBlobURL) {URL.revokeObjectURL(sampleBlobURL);sampleBlobURL = undefined;}
    audio.pause();
    currentBook = book;
    audio.src = book.sample;
    updateTrack();
    updateProgress();
  } else if (audio.error) {
    audio.load();
  }
  if (audio.ended) audio.currentTime = 0;
  loading();
  try {
    await audio.play();
    if (request !== playRequest) return;
    clearTimeout(loadTimer);
    setStatus('Playing sample');
  } catch (error) {
    if (request !== playRequest || error.name === 'AbortError') return;
    clearTimeout(loadTimer);
    setStatus(error.name === 'NotAllowedError' ? 'Playback needs a tap. Press Play to listen.' : 'Sample unavailable. Press Play to retry.', true);
  }
  updateButtons();
}
function pause() {++playRequest;clearTimeout(loadTimer);audio.pause();setStatus('Paused');}
function toggle() {if (audio.paused) void play();else pause();}
async function seekTo(seconds) {
  if (!Number.isFinite(audio.duration)) return;
  const target = Math.min(audio.duration, Math.max(0, seconds));
  const directlySeekable = target === 0 || sampleBlobURL || Array.from({length:audio.seekable.length}, (_,i) => i).some(i => target >= audio.seekable.start(i) && target <= audio.seekable.end(i));
  seekController?.abort();
  if (directlySeekable) {
    pendingSeekTarget = null;
    audio.currentTime = target;
    updateProgress();
    return;
  }
  // Some static preview hosts ignore Range. Buffer only this sample, only
  // after an explicit seek. Browsing never enters this path or swaps audio.
  const controller = new AbortController();
  seekController = controller;
  const bookId = currentBook.id;
  let timedOut = false;
  const timeout = setTimeout(() => {timedOut = true;controller.abort();}, 15000);
  pendingSeekTarget = target;
  updateProgress();
  setStatus('Preparing seek…');
  try {
    // Bypass the browser's in-progress media cache entry, which may be held
    // open by the streaming audio request while playback is paused.
    const response = await fetch(currentBook.sample, {signal:controller.signal,cache:'no-store'});
    if (!response.ok) throw new Error('Sample download failed');
    const blob = await response.blob();
    if (controller.signal.aborted || currentBook.id !== bookId) return;
    const resume = !audio.paused;
    const requestAtSwap = ++playRequest;
    audio.pause();
    sampleBlobURL = URL.createObjectURL(blob);
    const metadata = new Promise((resolve,reject) => {
      const cleanup = () => {audio.removeEventListener('loadedmetadata',ready);audio.removeEventListener('error',failed);controller.signal.removeEventListener('abort',aborted);};
      const ready = () => {cleanup();resolve();};
      const failed = () => {cleanup();reject(new Error('Unable to read sample'));};
      const aborted = () => {cleanup();reject(new DOMException('Seek cancelled','AbortError'));};
      audio.addEventListener('loadedmetadata',ready,{once:true});
      audio.addEventListener('error',failed,{once:true});
      controller.signal.addEventListener('abort',aborted,{once:true});
    });
    audio.src = sampleBlobURL;
    audio.load();
    await metadata;
    if (controller.signal.aborted || currentBook.id !== bookId) return;
    audio.currentTime = target;
    pendingSeekTarget = null;
    updateProgress();
    if (resume && requestAtSwap === playRequest) await audio.play();
    setStatus(audio.paused ? 'Paused' : 'Playing sample');
  } catch (error) {
    if (timedOut) setStatus('Seeking timed out. Try again.', true);
    else if (error.name !== 'AbortError') setStatus(error.name === 'NotAllowedError' ? 'Playback needs a tap. Press Play to listen.' : 'Could not seek. Try again when connected.', true);
  } finally {
    clearTimeout(timeout);
    if (seekController === controller) {seekController = undefined;pendingSeekTarget = null;updateProgress();}
    updateButtons();
  }
}
function seekBy(seconds) {
  void seekTo((pendingSeekTarget ?? audio.currentTime) + seconds);
}
function syncVolume() {
  $$('.volume').forEach(input => {input.value = audio.muted ? 0 : audio.volume;input.style.setProperty('--progress', `${Number(input.value) * 100}%`);});
  $$('.toggle-mute').forEach(button => {
    const muted = audio.muted || audio.volume === 0;
    button.innerHTML = muted ? icons.mute : icons.volume;
    button.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    button.setAttribute('aria-pressed', String(muted));
  });
}
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('durationchange', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('play', updateButtons);
audio.addEventListener('pause', updateButtons);
audio.addEventListener('playing', () => {clearTimeout(loadTimer);setStatus('Playing sample');updateButtons();});
audio.addEventListener('waiting', () => {if (!audio.paused) loading();});
audio.addEventListener('ended', () => {clearTimeout(loadTimer);setStatus('Sample finished · Play to listen again');updateButtons();});
audio.addEventListener('error', () => {clearTimeout(loadTimer);setStatus('Sample unavailable. Press Play to retry.', true);updateButtons();});
audio.addEventListener('volumechange', syncVolume);
$$('.progress').forEach(input => input.addEventListener('input', () => {
  void seekTo(Number(input.value));
}));
$$('.volume').forEach(input => input.addEventListener('input', () => {audio.volume = Number(input.value);audio.muted = false;syncVolume();}));

function openNowPlaying(trigger) {
  dialogTrigger = trigger;
  nowPlaying.showModal();
  updateProgress();
}
function closeDialogs() {if (nowPlaying.open) nowPlaying.close();if (videoDialog.open) videoDialog.close();}
for (const dialog of [nowPlaying, videoDialog]) {
  dialog.addEventListener('close', () => {
    if (dialog === videoDialog) $('#video-frame').replaceChildren();
    if (dialogTrigger?.isConnected) dialogTrigger.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button) {
    if (button.dataset.genre) filterTo(button.dataset.genre, filters().query);
    if ('resetFilters' in button.dataset) {filterTo('All','');search.focus();}
    if (button.dataset.play) {
      const book = books.find(b => b.id === button.dataset.play);
      if (book.id === currentBook.id && !audio.paused) pause(); else void play(book);
    }
    if (button.classList.contains('toggle-play')) toggle();
    if (button.dataset.seek) seekBy(Number(button.dataset.seek));
    if (button.classList.contains('toggle-mute')) {
      if (audio.muted || audio.volume === 0) {audio.muted = false;audio.volume = previousVolume || 1;}
      else {previousVolume = audio.volume;audio.muted = true;}
      syncVolume();
    }
    if (button.id === 'open-player' || 'openPlayer' in button.dataset) openNowPlaying(button);
    if ('closeDialog' in button.dataset) button.closest('dialog').close();
    return;
  }
  const link = event.target.closest('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
  if (link.dataset.video) {
    event.preventDefault();
    const video = videos.find(v => v.id === link.dataset.video);
    pause();
    dialogTrigger = link;
    $('#video-title').textContent = video.title;
    $('#video-title').classList.toggle('original-case', video.type === 'Client project');
    $('#video-external').href = link.href;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`;
    frame.title = video.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    $('#video-frame').replaceChildren(frame);
    videoDialog.showModal();
    return;
  }
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.hash || !/^\/(?:$|audiobooks\/?$|commercial\/?$|about\/?$|contact\/?$|books\/[^/]+\/?$)/.test(url.pathname)) return;
  event.preventDefault();
  if (link.dataset.section === 'audiobooks' && mobile.matches) url.pathname = '/audiobooks/';
  if (link.dataset.section === 'audiobooks' || url.pathname.startsWith('/books/') || (url.pathname === '/audiobooks/' && !url.search)) url.search = location.search;
  closeDialogs();
  navigate(url);
});
if ('mediaSession' in navigator) {
  for (const [action, handler] of Object.entries({play:() => void play(),pause,seekbackward:() => seekBy(-15),seekforward:() => seekBy(15),seekto:event => {if (Number.isFinite(event.seekTime)) void seekTo(event.seekTime);}})) {
    try {navigator.mediaSession.setActionHandler(action, handler);} catch { /* Older browsers may omit individual media actions. */ }
  }
}
// Keep existing inbound section anchors useful after the redesign.
const legacyHashes = {'#top':'/','#portfolio-book':'/audiobooks/','#portfolio-audio':'/commercial/','#about-me':'/about/','#section-testimonial':'/commercial/','#contact':'/contact/'};
if (legacyHashes[location.hash]) history.replaceState({}, '', legacyHashes[location.hash]);
document.body.classList.add('enhanced');
syncPage();
updateTrack();
syncVolume();
updateProgress();
