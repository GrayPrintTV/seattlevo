import { books as catalog } from '../data/catalog.mjs';
import { sortCatalog } from './catalog-order.mjs';
import { listenerReviews } from '../data/reviews.mjs';

export const books = sortCatalog(catalog);
export const featured = books[0];
export const genres = ['All', 'Thriller', 'Fantasy', 'Nonfiction', 'Military fiction', 'Science fiction', 'Mythology', 'Wellbeing', 'True crime', 'Business'];
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escapeHTML;
export const icons = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6L9 15M10 4H4v16h16v-6"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>',
  volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 5 9H2v6h3l6 5ZM16 9l6 6m-6 0 6-6"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>',
  library: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16M9 4v16m5-15 5 15"/></svg>',
};
export const art = (b, className = '', small = false) => `<img class="${className}" src="${small ? b.thumbnail : b.artwork}" ${small ? '' : `srcset="${b.thumbnail} 128w, ${b.artwork} 480w" sizes="(max-width: 600px) 44vw, 280px"`} width="480" height="480" alt="${e(b.title)} cover" loading="lazy" decoding="async">`;
export const playButton = (b, label = 'Play sample') => `<button class="button primary" data-play="${b.id}" aria-label="${e(label)}: ${e(b.title)}">${icons.play}<span>${label}</span></button>`;
export const retailer = b => `<a class="button secondary" href="${e(b.retailerUrl)}" target="_blank" rel="noopener noreferrer">View on <span class="original-case">${b.retailerUrl.includes('amazon.com') ? 'Amazon' : 'Audible'}</span> ${icons.external}<span class="sr-only"> (opens in a new tab)</span></a>`;
export function catalogItems(items = books, selected = '') {
  return items.map(b => `<a class="catalog-item${selected === b.id ? ' selected' : ''}" href="/books/${b.id}/" data-book="${b.id}" ${selected === b.id ? 'aria-current="page"' : ''}>${art(b, '', true)}<span class="catalog-copy"><strong>${e(b.title)}</strong><span>${e(b.author || (b.editors ? 'edited by ' + b.editors : 'audiobook'))}</span></span><span class="catalog-indicator" aria-hidden="true">${icons.arrow}</span></a>`).join('');
}
export function chips(active = 'All') {
  return genres.map(g => `<button class="chip" data-genre="${g}" aria-pressed="${active === g}">${g}</button>`).join('');
}
function shelf(ids, heading = 'A few places to begin') {
  return `<section class="shelf"><div class="section-heading"><h2>${heading}</h2><a class="text-link" href="/audiobooks/">Browse all ${icons.arrow}</a></div><div class="book-grid">${ids.map(id => {
    const b = books.find(book => book.id === id);
    return `<article class="book-card"><a href="/books/${b.id}/" class="cover-link">${art(b)}<span class="cover-caption">Explore audiobook ${icons.arrow}</span></a><a href="/books/${b.id}/" class="book-title">${e(b.title)}</a><p${b.author ? ' class="original-case"' : ''}>${e(b.author || b.genres[0])}</p><button class="card-play" data-play="${b.id}" aria-label="Play sample: ${e(b.title)}">${icons.play}</button></article>`;
  }).join('')}</div></section>`;
}
const footer = () => `<footer class="content-footer"><span>Steve Schaeffer · Seattle, Washington</span><a href="mailto:steve@seattlevo.com">Let’s talk about your project ${icons.arrow}</a></footer>`;
export function home() {
  return `<div class="home-content"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> Seattle voice artist</p><h1 tabindex="-1">Amplify<br>Your <span>Impact.</span></h1><p class="intro">Stories with character. Words with weight.<br>A Seattle-based voice actor bringing books to life, from the first line to the final chapter.</p><div class="hero-actions">${playButton(featured, 'Listen to a sample')}<a class="text-link" href="/about/">Meet Steve ${icons.arrow}</a></div><div class="credentials"><span>Audiobook narration</span><span>Pacific Northwest radio</span><span>Commercial voiceover</span></div></div><figure class="hero-portrait"><img src="/assets/images/portfolio/steve-toned.png" alt="Steve Schaeffer at his studio microphone" width="800" height="800" fetchpriority="high"><figcaption>Behind the mic. Inside the story.</figcaption></figure></section>
  <section class="featured"><a href="/books/${featured.id}/" class="featured-art">${art(featured, '', true)}</a><div><p class="eyebrow">Featured narration <span class="separator">/</span> Mythology</p><a class="featured-title" href="/books/${featured.id}/">${e(featured.title)}</a><p><span class="original-case">${e(featured.author)}</span> <span class="separator">·</span> Narrated by Steve Schaeffer</p></div><button class="round-play" data-play="${featured.id}" aria-label="Play sample: ${e(featured.title)}">${icons.play}</button></section>
  ${shelf(['bloodline-vendetta', 'burg-of-arcanum', 'battle-of-quang-tri', 'the-gala'])}
  <section class="invitation"><div><p class="eyebrow">Have a story in mind?</p><h2>Let’s give it a voice.</h2></div><a class="button secondary" href="/contact/">Start a conversation ${icons.arrow}</a></section>${footer()}</div>`;
}
export function detail(b) {
  return `<article class="detail-page"><a class="text-link back-link" href="/audiobooks/">${icons.back} All audiobooks</a><div class="detail-hero"><div class="detail-cover">${art(b)}</div><div class="detail-heading"><p class="eyebrow">Audiobook · Narration sample</p><h1 tabindex="-1">${e(b.title)}</h1>${b.subtitle ? `<p class="subtitle">${e(b.subtitle)}</p>` : ''}<p class="byline">${b.author ? 'by ' + e(b.author) : b.editors ? 'edited by ' + e(b.editors) : ''}</p><p class="narrator">Narrated by <a href="/about/">Steve Schaeffer</a></p><div class="tags">${b.genres.map(g => `<a href="/audiobooks/?genre=${encodeURIComponent(g)}">${g}</a>`).join('')}</div></div></div><div class="detail-actions">${playButton(b)}${retailer(b)}</div>${b.description ? `<section class="book-description"><h2>About the book</h2><p>${e(b.description)}</p></section>` : ''}<section class="sample-note"><div class="sample-mark">${icons.volume}</div><div><h2>Hear the story.</h2><p>A sample of the published audiobook. Keep listening as you explore the portfolio.</p></div></section><div class="detail-credit"><span>Narration</span><strong>Steve Schaeffer</strong><span>Format</span><strong>Audiobook sample</strong></div><section class="invitation"><div><p class="eyebrow">Casting your next audiobook?</p><h2>Find the voice for your story.</h2></div><a class="button secondary" href="/contact/">Get in touch ${icons.arrow}</a></section>${footer()}</article>`;
}
export const videos = [
  {id:'fmJ9mQk64XI',title:'TV commercial demo reel',image:'/assets/images/thumbnail.jpg',type:'Demo reel'},
  {id:'E6YjxAUbxfk',title:'Commercial demo',image:'/assets/images/thumbnail2.jpg',type:'Demo reel'},
  {id:'0w_xusRYoto',title:'Hoboken Coffee Roasters',image:'/assets/images/hoboken.png',type:'Client project',quote:'Steve nailed it right away! Very kind and professional, will definitely come back to him if the project calls for it!',credit:'Colton S., Hoboken Coffee Roasters'},
  {id:'V7s4bjxJsEY',title:'Hagleitner Hygiene International',image:'/assets/images/hagleitner.png',type:'Client project',quote:'Great working together with Steve! He’s got a fantastic voice and is quick to respond and deliver.',credit:'Harry, Hagleitner Hygiene International'},
  {id:'H_XPdan_3Us',title:'The Armenian Church of America — Eastern Diocese',image:'/assets/images/cropped-ArmenianChurch-1.png',type:'Client project',quote:'Thank you so much for such a quick turnaround.',credit:'Artur P., The Armenian Church of America — Eastern Diocese'},
];
const videoCard = v => `<article class="video-card"><a class="video-link ${v.type === 'Client project' ? 'client-logo' : ''}" href="https://www.youtube.com/watch?v=${v.id}" data-video="${v.id}"><img src="${v.image}" width="540" height="300" alt="${e(v.title)}" loading="lazy"><span class="video-play">${icons.play}<span>Watch ${v.type === 'Client project' ? 'project' : 'demo'}</span></span></a><p class="eyebrow">${v.type}</p><h3${v.type === 'Client project' ? ' class="original-case"' : ''}>${e(v.title)}</h3>${v.quote ? `<blockquote><p>“${e(v.quote)}”</p><cite>${e(v.credit)}</cite></blockquote>` : ''}</article>`;
export function commercial() {
  return `<div class="section-page"><p class="eyebrow">Commercial voiceover</p><h1 tabindex="-1">Make yourself<br><span>heard.</span></h1><p class="page-intro">A voice that understands the assignment. Commercials, promos, brand stories, and narration—grounded in a Pacific Northwest broadcast background.</p><a class="button primary" href="/contact/">Discuss a project ${icons.arrow}</a><section><div class="section-heading"><h2>Hear the range</h2><span>Commercial demos</span></div><p class="disclosure">These reels include illustrative and speculative spots. Brands featured in a demo are not necessarily commissioned clients.</p><div class="video-grid">${videos.slice(0,2).map(videoCard).join('')}</div></section><section><div class="section-heading"><h2>In good company</h2><span>Commissioned work & client feedback</span></div><div class="project-grid">${videos.slice(2).map(videoCard).join('')}</div></section>${footer()}</div>`;
}
export function about() {
  return `<div class="section-page about-page"><p class="eyebrow">About Steve</p><div class="about-hero"><div><h1 tabindex="-1"><span>a storyteller’s ear</span></h1><p class="page-intro">Steve Schaeffer is a Seattle-based voice artist bringing books to life through audiobook narration and voice acting.</p><p>Behind every read: the emotion and context of the words. Voice acting brings that experience beyond the booth and into the characters, ideas, and worlds of an audiobook.</p><p>A background in Pacific Northwest radio includes commercials, promos, narration, and imaging.</p></div><img class="about-portrait" src="/assets/images/portfolio/steve-toned.png" width="800" height="800" alt="Steve Schaeffer in the recording studio"></div><section class="approach"><img src="/assets/images/portfolio/studio.webp" width="900" height="600" alt="Steve’s recording and production workspace" loading="lazy"><div><p class="eyebrow">from manuscript to polished production</p><h2>inhabit your language<br>steward your vision</h2><p>With a technical background and ongoing interests in literature, science, and technology informing the work, the approach is straightforward: understand the material, find its intent, and carry that through the performance and production.</p><p>A catalog that spans thrillers, fantasy, military fiction, and nonfiction. Listen across genres to hear the range.</p><a class="text-link" href="/audiobooks/">Explore the audiobooks ${icons.arrow}</a></div></section>${reviewCarousel()}${footer()}</div>`;
}
export function reviewCarousel() {
  const clients = videos.filter(v => v.quote);
  // Lead with the owner's favorite; interleave commissioned work with listener feedback.
  const reviews = [listenerReviews[0], clients[0], ...listenerReviews.slice(1,5), clients[1], ...listenerReviews.slice(5,9), clients[2], ...listenerReviews.slice(9)];
  return `<section class="review-carousel" data-reviews aria-labelledby="reviews-heading"><div class="section-heading"><h2 id="reviews-heading">kind words from the other side of the mic</h2></div><div class="review-frame"><button class="icon-button review-previous" data-review-action="previous" aria-label="Previous review" hidden>${icons.back}</button><div class="review-slides">${reviews.map((r,i) => {
    const book = books.find(b => b.id === r.bookId);
    const credit = r.credit ? `<cite>${e(r.credit)}</cite><a class="text-link" href="https://www.youtube.com/watch?v=${r.id}" data-video="${r.id}">Watch the project ${icons.play}</a>` : book ? `<cite><a href="/books/${book.id}/">${e(book.title)}</a></cite><a class="text-link" href="${e(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read the review<span class="sr-only"> on ${e(r.source)} (opens in a new tab)</span> ${icons.external}</a>` : '';
    return `<figure class="review-slide" data-review-slide="${r.id}" role="group" aria-roledescription="slide" aria-label="${i+1} of ${reviews.length}"><blockquote><p>“${e(r.quote)}”</p></blockquote>${r.aside ? `<p class="review-aside">${e(r.aside)}</p>` : ''}${credit ? `<figcaption>${credit}</figcaption>` : ''}</figure>`;
  }).join('')}</div><button class="icon-button review-next" data-review-action="next" aria-label="Next review" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div><p class="sr-only" data-review-status aria-live="polite" aria-atomic="true"></p></section>`;
}
export function contact() {
  return `<div class="section-page contact-page"><p class="eyebrow">Let’s talk</p><h1 tabindex="-1">Your words.<br><span>A voice to match.</span></h1><p class="page-intro">Casting an audiobook? Bringing a commercial to life?<br>Get in touch to discuss the project or request a custom sample.</p><a class="email-link" href="mailto:steve@seattlevo.com">steve@seattlevo.com ${icons.arrow}</a><div class="contact-details"><section><h2>Audiobook inquiries</h2><p>Share a little about the book, its genre, your production timeline, and the voice you have in mind.</p></section><section><h2>Commercial inquiries</h2><p>Send the script or concept, intended usage, and your timing. Let’s find the right read.</p></section></div><section class="profiles"><p class="eyebrow">Elsewhere</p><a href="https://www.audible.com/search?narrator=steve+schaeffer" target="_blank" rel="noopener noreferrer">Audible ${icons.external}</a><a href="https://www.audiobooks.com/browse/narrator/475772/steve-schaeffer" target="_blank" rel="noopener noreferrer">Audiobooks.com ${icons.external}</a><a href="https://www.voices.com/profile/steveschaeffer" target="_blank" rel="noopener noreferrer">Voices ${icons.external}</a></section>${footer()}</div>`;
}
export function missing() {
  return `<section class="section-page"><p class="eyebrow">Page not found</p><h1 tabindex="-1">Let’s get you<br>back to the story.</h1><p class="page-intro">That page isn’t in this portfolio. Browse the catalog or get in touch.</p><a class="button primary" href="/audiobooks/">Browse audiobooks ${icons.arrow}</a></section>`;
}
export function routeFor(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  if (path === '/' || path === '/audiobooks') return {section:'audiobooks',view:path === '/' ? 'home' : 'catalog',title:'Steve Schaeffer | Voice Artist · Seattle Audiobook Narrator',html:home()};
  const book = books.find(b => path === '/books/' + b.id);
  if (book) return {section:'audiobooks',view:'book',book,title:book.title + ' · Steve Schaeffer',html:detail(book)};
  const sections = { '/commercial': ['commercial', 'Commercial Voiceover', commercial], '/about': ['about', 'About Steve Schaeffer', about], '/contact': ['contact', 'Contact Steve Schaeffer', contact] };
  const page = sections[path];
  return page ? {section:page[0],view:page[0],title:page[1] + ' | Seattle Voice Artist',html:page[2]()} : {section:'',view:'missing',title:'Page not found | Steve Schaeffer',html:missing()};
}
