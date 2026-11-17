// Optional authoring step. Cloudflare serves the committed HTML directly.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sortCatalog } from '../assets/js/catalog-order.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = sortCatalog(JSON.parse(await readFile(path.join(root, 'assets/data/catalog.json'), 'utf8')));
await writeFile(path.join(root, 'assets/data/catalog.mjs'), '// Generated from catalog.json by scripts/build.mjs.\nexport const books = ' + JSON.stringify(catalog, null, 2) + ';\n');
const {routeFor, catalogItems, chips, icons, escapeHTML:e, featured} = await import('../assets/js/views.mjs');
const template = await readFile(path.join(root, 'scripts/page.html'), 'utf8');
const routes = ['/', '/audiobooks/', '/commercial/', '/about/', '/contact/', ...catalog.map(b => '/books/' + b.id + '/')];
for (const url of [...routes, '/404.html']) {
  const route = routeFor(url);
  const sample = route.book || featured;
  const description = route.book ? `${sample.title}${sample.author ? ' by ' + sample.author : ''}, narrated by Steve Schaeffer. Listen to an audiobook sample and explore the portfolio.` : 'Steve Schaeffer, Seattle voice artist and audiobook narrator. Hear narration samples, commercial voiceover demos, and commissioned work. Amplify Your Impact.';
  const schema = route.book ? {'@context':'https://schema.org', '@type':'Audiobook', name:sample.title, ...(sample.author ? {author:{'@type':'Person',name:sample.author}} : {}), readBy:{'@type':'Person',name:'Steve Schaeffer'}, image:'https://seattlevo.com' + sample.cover, url:'https://seattlevo.com' + url} : {'@context':'https://schema.org','@type':'Person',name:'Steve Schaeffer',jobTitle:'Voice Artist',url:'https://seattlevo.com/',email:'steve@seattlevo.com',homeLocation:{'@type':'Place',name:'Seattle, Washington'},knowsAbout:['Audiobook narration','Voice acting','Commercial voiceover'],sameAs:['https://www.audiobooks.com/browse/narrator/475772/steve-schaeffer','https://www.voices.com/profile/steveschaeffer']};
  const nav = [['audiobooks','Audiobooks','/'],['commercial','Commercial VO','/commercial/'],['about','About','/about/'],['contact','Contact','/contact/']].map(([key,label,href]) => `<a href="${href}" data-section="${key}" ${key === route.section ? 'aria-current="page"' : ''}>${label}</a>`).join('');
  const values = {TITLE:e(route.title), DESCRIPTION:e(description), PATH:url, VIEW:route.view, NAV:nav, CONTENT:route.html, COUNT:String(catalog.length), CATALOG:catalogItems(catalog, route.book?.id), CHIPS:chips(), SCHEMA:JSON.stringify(schema).replace(/</g,'\\u003c'), NATIVE_SAMPLE:`<h2>${e(sample.title)} · Sample</h2><audio controls preload="none" src="${sample.sample}"></audio>`};
  for (const [name,svg] of Object.entries(icons)) values[name.toUpperCase()] = svg;
  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {if (!(key in values)) throw new Error('Unknown template key: '+key); return values[key];});
  const dest = path.join(root, url === '/404.html' ? '404.html' : url.slice(1), url === '/404.html' ? '' : 'index.html');
  await mkdir(path.dirname(dest), {recursive:true});
  await writeFile(dest, html);
}
await writeFile(path.join(root,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(url => `  <url><loc>https://seattlevo.com${url}</loc></url>`).join('\n') + '\n</urlset>\n');
console.log(`Generated ${routes.length} static pages, 404.html, catalog module, and sitemap.`);
